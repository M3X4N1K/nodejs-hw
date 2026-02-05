import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars'; // Додано
import path from 'node:path';        // Додано
import fs from 'node:fs/promises';   // Додано

import User from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw createHttpError(400, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const session = await createSession(newUser._id);

    setSessionCookies(res, session);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid credentials');
    }

    await Session.deleteOne({ userId: user._id });

    const session = await createSession(user._id);

    setSessionCookies(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await Session.deleteOne({ _id: req.cookies.sessionId });
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    const newSession = await createSession(session.userId);

    await Session.deleteOne({ _id: sessionId, refreshToken });

    setSessionCookies(res, newSession);

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // З міркувань безпеки не кажемо, що юзера немає, але й листа не шлемо
      return res.status(200).json({
        status: 200,
        message: 'Password reset email sent successfully',
        data: {},
      });
    }

    const resetToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );

    const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;

    // Читаємо та компілюємо шаблон тут
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'reset-password-email.html'
    );
    
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    
    const html = template({
      name: user.username,
      link: resetLink,
    });

    try {
      await sendEmail({
        from: process.env.SMTP_FROM, // Обов'язково передаємо від кого
        to: email,
        subject: 'Reset your password',
        html,
      });
    } catch (err) {
      console.log(err);
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.'
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Password reset email sent successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({
      email: decoded.email,
      _id: decoded.sub,
    });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ _id: user._id }, { password: hashedPassword });

    res.status(200).json({
      status: 200,
      message: 'Password reset successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
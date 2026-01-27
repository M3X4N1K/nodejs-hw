import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

// Реєстрація
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Перевіряємо, чи є такий email
    const user = await User.findOne({ email });
    if (user) {
      throw createHttpError(409, 'Email in use');
    }

    // 2. Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Створюємо користувача
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // 4. Створюємо сесію
    const session = await createSession(newUser._id);

    // 5. Встановлюємо кукі
    setSessionCookies(res, session);

    // 6. Віддаємо відповідь (201 Created)
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Логін
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Шукаємо користувача
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    // 2. Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid credentials');
    }

    // 3. Видаляємо стару сесію (за бажанням можна лишати, але за завданням часто чистять)
    await Session.deleteOne({ userId: user._id });

    // 4. Створюємо нову сесію
    const session = await createSession(user._id);

    // 5. Встановлюємо кукі
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

// Оновлення сесії (Refresh)
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    // 1. Шукаємо сесію в базі
    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // 2. Перевіряємо термін дії refresh токена
    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    // 3. Видаляємо стару та створюємо нову
    await Session.deleteOne({ _id: sessionId });
    const newSession = await createSession(session.userId);

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

// Логаут
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    // Очищаємо кукі
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const templatePath = path.join(
    process.cwd(),
    'src',
    'templates',
    'reset-password-email.html'
  );

  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    name: options.data.name,
    link: options.data.link,
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: options.to,
    subject: 'Reset your password',
    html,
  };

  await transporter.sendMail(mailOptions);
};
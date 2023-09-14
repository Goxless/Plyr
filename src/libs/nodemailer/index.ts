import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, MAILER_USER, MAILER_PASS } = process.env;

const transportConfig = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
    },
};

export const transporter = nodemailer.createTransport(transportConfig);

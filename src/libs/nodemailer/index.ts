import nodemailer, { TransportOptions } from 'nodemailer';
import { config } from '@config';

const { host, port, user, pass } = config.mailer;

const transportConfig = {
    host: host,
    port: Number(port),
    secure: true,
    auth: {
        user: user,
        pass: pass,
    },
};

export const transporter = nodemailer.createTransport(transportConfig);

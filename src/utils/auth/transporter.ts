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

const transporter = nodemailer.createTransport(transportConfig);

async function sendEmail(recipient: string, link: string): Promise<object> {
    const info = await transporter.sendMail({
        from: 'kirill@voloshinp.ru',
        to: recipient,
        subject: 'Reset link',
        text: `Here is your reset link: ${link}`,
    });

    return <object>info;
}

export default sendEmail;

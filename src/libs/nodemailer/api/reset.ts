import { transporter } from '@/libs/nodemailer';

export const resetMail = async (recipient: string, link: string) => {
    const info = await transporter.sendMail({
        from: 'kirill@voloshinp.ru',
        to: recipient,
        subject: 'Reset link',
        text: `Here is your reset link: ${link}`,
    });

    return <object>info;
};

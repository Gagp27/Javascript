import nodemailer from "nodemailer";

const recoverAccountEmail = async (userId, email, userName, token) => {

    const transport = nodemailer.createTransport(
        {
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        });

    const sendMail = await transport.sendMail(
        {
            from: "UpTask@mailer.com",
            to: email,
            subject: "Recover you account",
            text: "Recover you account",
            html: `
            <p>Hello ${userName}, recover you account in UpTask
            <a href="${process.env.FRONTEND_URL}/recover-account/${token}/${userId}">Recover Account</a></p>
            <p>If you did not request this change please ignore this message</p>
        `
        });

    return !!sendMail;
}


export default recoverAccountEmail;

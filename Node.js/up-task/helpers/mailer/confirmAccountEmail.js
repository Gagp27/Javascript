import nodemailer from "nodemailer";

const confirmAccountEmail = async (userId, email, userName, token) => {

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
        subject: "Confirm you account",
        text: "Confirm you account",
        html: `
            <p>Hello ${userName}, confirm you account in UpTask
            <a href="${process.env.FRONTEND_URL}/confirm/${token}/${userId}">Confirm Account</a></p>
            <p>If you don't create this account please ingore this message</p>
        `
    });

    return !!sendMail;
}


export default confirmAccountEmail;

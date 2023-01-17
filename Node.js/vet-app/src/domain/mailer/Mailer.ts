import nodemailer from "nodemailer";
import Config from "../../config/config";

class Mailer {

	public static async confirmAccount(userName: string, email: string, token: string | null) {
		const data = {
			from: "origin@mail.com",
			to: email,
			subject: "Confirm your account",
			text: "Confirm your account",
			html: `
				<p>Hello ${userName}, confirm your account 
					<a href="${Config.FRONTEND_URL}/confirm/${token}">Confirm Account</a></p>
				<p>If you don't create this account please ignore this message</p>
			`
		}

		return this.createAndSend(data);
	}

	public static async recoverAccount(userName: string, email: string, token: string | null) {
		const data = {
			from: "origin@mail.com",
			to: email,
			subject: "Recover your account",
			text: "Recover your account",
			html: `
				<p>Hello ${userName}, confirm your account 
					<a href="${Config.FRONTEND_URL}/recover-account/${token}">Recover Account</a></p>
				<p>If you don't create this account please ignore this message</p>
			`
		}

		return this.createAndSend(data);
	}

	public static async createAndSend(mailData: {from: string, to: string, subject: string, text: string, html: string}) {
		const transport = nodemailer.createTransport({//@ts-ignore
			host: Config.NODEMAILER_HOST,
			port: Config.NODEMAILER_PORT,
			auth: {
				user: Config.NODEMAILER_USER,
				pass: Config.NODEMAILER_PASS
			}
		});

		const sendMail = await transport.sendMail({
			from: mailData.from,
			to: mailData.to,
			subject: mailData.subject,
			text: mailData.text,
			html: mailData.html
		});
	}
}

export default Mailer;

import "dotenv/config";

class Config {
	static SERVER_PORT= process.env.SERVER_PORT;
	static MONGO_DATABASE= process.env.MONGO_DATABASE;
	static MONGO_HOST= process.env.MONGO_HOST;
	static MONGO_PORT= process.env.MONGO_PORT;
	static NODEMAILER_HOST= process.env.NODEMAILER_HOST;
	static NODEMAILER_PORT= process.env.NODEMAILER_PORT;
	static NODEMAILER_USER= process.env.NODEMAILER_USER;
	static NODEMAILER_PASS= process.env.NODEMAILER_PASS;
	static SECRET_KEY= process.env.SECRET_KEY;
	static FRONTEND_URL= process.env.FRONTEND_URL;
}

export default Config;

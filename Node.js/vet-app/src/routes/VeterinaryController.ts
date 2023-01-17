import {Request, Response} from "express";
import {constants} from "http2";
import {v4 as uuid} from "uuid";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

import Veterinary from "../domain/documents/Veterinary";
import ResponseObject from "../domain/ResponseObject";
import {
	AuthenticateRequestObject,
	IVeterinary,
	ProfileRequestObject,
	RegisterRequestObject
} from "../domain/interfaces/VeterinaryInterfaces";
import Validation from "../domain/validation/Validation";
import Mailer from "../domain/mailer/Mailer";
import Config from "../config/config";
import validUpdateAndReplace from "../domain/validation/validUpdateAndReplace";

class VeterinaryController {
	public static async register(req: Request, res: Response) {
		const { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		const body: RegisterRequestObject = req.body;

		try {
			const validBody: ResponseObject | null = Validation.registerValidation(body);
			if(validBody !== null) {
				return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
			}

			const existEmail: IVeterinary | null = await Veterinary.findOne({ email: body.email });
			if(existEmail) {
				const errors = {email: "The email is already registered"};
				return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseObject(body, errors, "Failed validation"));
			}

			const veterinary = new Veterinary(body);
			const salt: string = await bcrypt.genSalt(10);
			veterinary.password = await bcrypt.hash(veterinary.password, salt);
			veterinary.token = uuid();

			const veterinarySaved: IVeterinary = await veterinary.save();
			await Mailer.confirmAccount(`${veterinarySaved.firstName} ${veterinarySaved.lastName}`, veterinarySaved.email, veterinarySaved.token);
			return res.status(HTTP_STATUS_CREATED).json(new ResponseObject(null, null, "Created successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async confirm(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;

		const { token } = req.params;

		try {
			const veterinary = await Veterinary.findOne({token});
			if(!veterinary) {
				return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseObject(null, null, "Veterinary not found"));
			}

			veterinary.confirm = true;
			veterinary.token = null;
			await veterinary.save();

			return res.status(HTTP_STATUS_OK).json(new ResponseObject(null, null, "Confirmed successfully"));


		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async recover(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		const body: { email: string } = req.body;

		const validBody: ResponseObject | null = Validation.recoverValidation(body.email);
		if(validBody !== null) {
			return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
		}

		try {
			const existVeterinary = await Veterinary.findOne({email: body.email});
			if(existVeterinary === null || !existVeterinary.confirm) {
				const errors = { "email": "The email is not registered or confirmed" }
				return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseObject(body, errors, "Failed validation"));
			}

			existVeterinary.token = uuid();
			const veterinarySaved = await existVeterinary.save();
			await Mailer.recoverAccount(`${veterinarySaved.firstName} ${veterinarySaved.lastName}`, veterinarySaved.email, veterinarySaved.token);
			return res.status(HTTP_STATUS_OK).json(new ResponseObject(null, null, "Request successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async validToken(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		const { token } = req.params;
		console.log(token);

		try {
			const veterinary = await Veterinary.findOne({token});
			if(veterinary === null) {
				return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseObject(null, null, "Veterinary not found"));
			}

			return res.status(HTTP_STATUS_OK).json(new ResponseObject(null, null, "Request successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async resetPassword(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		const { token } = req.params;
		const body: { password: string } = req.body;

		try {
			const veterinary = await Veterinary.findOne({token});
			if(veterinary === null || !veterinary.confirm) {
				return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseObject(null, null, "The email is not registered or is not confirmed"));
			}

			const validBody: ResponseObject | null = Validation.recoverValidation(body.password);
			if(validBody !== null) {
				console.log("rip here");
				return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
			}

			const salt: string = await bcrypt.genSalt(10);
			veterinary.password = await bcrypt.hash(body.password, salt);
			veterinary.token = null;
			await veterinary.save();
			return res.status(HTTP_STATUS_OK).json(new ResponseObject(null, null, "Reset password successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async authenticate(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		const body: AuthenticateRequestObject = req.body;

		const validBody: ResponseObject | null = Validation.authenticateValidation(body);
		if(validBody !== null) {
			return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
		}

		try {
			const veterinaryToAuthenticate = await Veterinary.findOne({email: body.email});
			if(veterinaryToAuthenticate === null || !veterinaryToAuthenticate.confirm) {
				const errors = { "email": "The email is not registered or confirmed" };
				return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseObject(body, errors, "Failed validation"));
			}

			const passwordVerify = await bcrypt.compare(body.password, veterinaryToAuthenticate.password);
			if(!passwordVerify) {
				const errors = { "password": "The password is incorrect" };
				return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseObject(body, errors, "Failed validation"));
			}

			//@ts-ignore
			const secretKey: string = Config.SECRET_KEY;
			const jws = JWT.sign({"_id": veterinaryToAuthenticate._id}, secretKey);
			return res.status(HTTP_STATUS_OK).json(new ResponseObject({authenticate: true, jws}, null, "Authenticate successfully"))

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async getProfile(req: Request, res: Response) {
		//@ts-ignore
		const profile = req.veterinary;
		return res.status(constants.HTTP_STATUS_OK).json(new ResponseObject(profile, null, "Get profile successfully"));
	}

	public static async updateProfile(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		const body: ProfileRequestObject = req.body;
		//@ts-ignore
		const { id } = req.veterinary;

		const validBody: ResponseObject | null = Validation.updateProfileValidation(body);
		if(validBody !== null) {
			return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
		}

		try {
			const veterinary = await Veterinary.findById(id);
			if(veterinary === null) {
				return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseObject(null, null, "Veterinary not found"));
			}

			const testFirstName = validUpdateAndReplace(veterinary.firstName, body.firstName);
			veterinary.firstName = testFirstName.value;

			const testLastName = validUpdateAndReplace(veterinary.lastName, body.lastName);
			veterinary.lastName = testLastName.value;

			const testEmail = validUpdateAndReplace(veterinary.email, body.email);
			veterinary.email = testEmail.value;

			if([testFirstName.isUpdate, testLastName.isUpdate, testEmail.isUpdate].includes(true)) {
				const veterinarySaved = await veterinary.save();

				//@ts-ignore
				req.veterinary = {
					id: veterinarySaved.id,
					firstName: veterinarySaved.firstName,
					lastName: veterinarySaved.lastName,
					email: veterinarySaved.email
				};
			}

			return res.status(HTTP_STATUS_OK).json(new ResponseObject(null, null, "Profile updated successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}
}

export default VeterinaryController;

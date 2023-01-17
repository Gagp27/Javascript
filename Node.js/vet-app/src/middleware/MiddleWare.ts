import {NextFunction, Request, Response} from "express";
import {constants} from "http2";
import ResponseObject from "../domain/ResponseObject";
import JWT from "jsonwebtoken";
import Config from "../config/config";
import Veterinary from "../domain/documents/Veterinary";


class MiddleWare {

	public static async checkAuth(req: Request, res: Response, next: NextFunction) {
		if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
			return res.status(constants.HTTP_STATUS_BAD_REQUEST).json(new ResponseObject(null, null, "Missing JWT or missing Authorization header"));
		}

		try {
			const token: string[] = req.headers.authorization.split(" ");
			//@ts-ignore
			const decoded = await JWT.verify(token[1], Config.SECRET_KEY);

			const auth = await Veterinary.findById(decoded._id);
			if(auth === null) {
				return res.status(constants.HTTP_STATUS_NOT_FOUND).json(new ResponseObject(null, null, "Veterinary not found"));
			}

			//@ts-ignore
			req.veterinary = {
				id: auth._id,
				firstName: auth.firstName,
				lastName: auth.lastName,
				email: auth.email
			}

			return next();

		} catch (e) {
			return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}
}

export default MiddleWare;

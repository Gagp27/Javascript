import JWT from "jsonwebtoken";
import User from "../models/User.js";

export default async function checkAuth (req, res, next) {
    let token;

    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
		return res.status(400).json({data: null, errors: "Missing jsonwebtoken", message: "No valid jsonwebtoken found"});
    }

	try {
		token = req.headers.authorization.split(" ");
		const decoded = await JWT.verify(token[1], process.env.JWT_SECRET);
		const authUser = await User.findByPk(decoded.userId);

		req.user = {
			userId: authUser.userId,
			firstName: authUser.firstName,
			lastName: authUser.lastName,
			userName: authUser.userName,
			email: authUser.email
		}

		return next();

	} catch (e) {
		return res.status(500).json({data: null, errors: "Jsonwebtoken validation", message: "Could not verify JWT token integrity!"});
	}
}

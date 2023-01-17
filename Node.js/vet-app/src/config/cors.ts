import Config from "./config";
import ResponseObject from "../domain/ResponseObject";

const allowedOrigins = [Config.FRONTEND_URL];

export const corsOptions: Object = {
	origin: function (origin: string, callback: Function) {
		if(allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback("Access denied from CORS");
		}
	}
}

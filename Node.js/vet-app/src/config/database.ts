import mongoose from "mongoose";
import Config from "./config";

(async () => {
	const host = Config.MONGO_HOST;
	const port = Config.SERVER_PORT;
	const database = Config.MONGO_DATABASE;

	try {
		mongoose.set({strictQuery: false})
		const db = await mongoose.connect(`mongodb://${host}/${database}`);

	} catch (error) {
		console.error(error);
	}
})()

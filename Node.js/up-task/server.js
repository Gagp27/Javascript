import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import { connection } from "./database/database.js";
import userRouter from "./routes/userRouter.js";
import projectRouter from "./routes/projectRouter.js";
import taskRouter from "./routes/taskRouter.js";


const app = express();
const port =process.env.SERVER_PORT;
await connection();


const allowedHosts = [process.env.FRONTEND_URL];
const corsOptions ={
	origin: function (origin, callback) {
		if(allowedHosts.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('No permitido por CORS'));
		}
	}
}

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.listen(port);

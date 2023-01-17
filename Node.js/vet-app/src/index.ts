import express, {Express} from "express";
import morgan from "morgan";
import cors from "cors";

import "./config/database";
import { corsOptions } from "./config/cors";
import Config from "./config/config";
import veterinaryRoutes from "./routes/VeterinaryRoutes";
import patientRoutes from "./routes/PatientRoutes";


const app: Express = express();

const port = Config.SERVER_PORT;

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/veterinary", veterinaryRoutes);
app.use("/api/patient", patientRoutes);

app.listen(port);

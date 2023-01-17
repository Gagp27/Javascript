import { Schema, model } from "mongoose";
import {IPatient} from "../interfaces/PatientInterfaces";

const patientSchema = new Schema<IPatient> ({
	name: { type: String, required: true },
	owner: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	symptoms: { type: String, required: true },
	date: { type: String, required: true },
	veterinaryId: { type: String, required: true }
}, { timestamps: true });

const Patient = model<IPatient>("Patient", patientSchema, "patients");

export default Patient;

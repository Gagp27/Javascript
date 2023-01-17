import { Schema, model } from "mongoose";
import { IVeterinary } from "../interfaces/VeterinaryInterfaces";

const veterinarySchema = new Schema<IVeterinary> ({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	confirm: { type: Boolean, required: false, default: false },
	token: { type: String, required: false, default: null },
}, { timestamps: true });

const Veterinary = model<IVeterinary>("Veterinary", veterinarySchema, "vets");

export default Veterinary;

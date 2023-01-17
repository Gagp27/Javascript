import {raw, Request, Response} from "express";
import {constants} from "http2";
import ResponseObject from "../domain/ResponseObject";
import {IPatient, PatientRequestObject} from "../domain/interfaces/PatientInterfaces";
import Patient from "../domain/documents/Patient";
import Validation from "../domain/validation/Validation";
import Veterinary from "../domain/documents/Veterinary";
import ValidUpdateAndReplace from "../domain/validation/validUpdateAndReplace";

class PatientController {

	public static async getPatients(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		//@ts-ignore
		const { id } = req.veterinary;
		console.log(id);

		try {
			console.log(id);
			const patients: IPatient[] = await Patient.find({veterinaryId: `${id}`});
			return res.status(HTTP_STATUS_OK).json(new ResponseObject(patients, null, "Get patients successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async getPatient(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		//@ts-ignore
		const veterinaryId = req.veterinary.id;
		const { id } = req.params;

		try {
			const patient: IPatient | null = await Patient.findOne({_id: `${id}`, veterinaryId: `${veterinaryId}`});
			if(patient === null) {
				return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseObject(null, null, "Patient not found"));
			}

			return res.status(HTTP_STATUS_OK).json(new ResponseObject(patient, null, "Get patient successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async create(req: Request, res: Response) {
		const { HTTP_STATUS_CREATED, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		//@ts-ignore
		const { id } = req.veterinary;
		const body: PatientRequestObject = req.body;

		try {
			const validBody: ResponseObject | null = Validation.createAndUpdatePatientValidation(body);
			if(validBody !== null) {
				return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
			}

			const patient = new Patient(body);
			patient.veterinaryId = id;
			const patientSaved = await patient.save();
			return res.status(HTTP_STATUS_CREATED).json(new ResponseObject(patientSaved, null, "Patient created successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async update(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		//@ts-ignore
		const veterinaryId = req.veterinary.id;
		const { id } = req.params;
		const body: PatientRequestObject = req.body;

		const validBody: ResponseObject | null = Validation.createAndUpdatePatientValidation(body);
		if(validBody !== null) {
			return res.status(HTTP_STATUS_BAD_REQUEST).json(validBody);
		}

		try {
			const patient = await Patient.findOne({_id: `${id}`, veterinaryId});
			if(patient === null) {
				return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseObject(null, null, "Patient not found"));
			}

			const testName = ValidUpdateAndReplace(patient.name, body.name);
			patient.name = testName.value;

			const testOwner  = ValidUpdateAndReplace(patient.owner, body.owner);
			patient.owner = testOwner.value;

			const testEmail = ValidUpdateAndReplace(patient.email, body.email);
			patient.email = testEmail.value;

			const testPhone = ValidUpdateAndReplace(patient.phone, body.phone);
			patient.phone = testPhone.value;

			const testSymptoms = ValidUpdateAndReplace(patient.symptoms, body.symptoms);
			patient.symptoms = testSymptoms.value;

			const testDate = ValidUpdateAndReplace(patient.date, body.date);
			patient.date = testDate.value;

			if([testName.isUpdate, testOwner.isUpdate, testEmail.isUpdate, testPhone.isUpdate, testSymptoms.isUpdate, testDate.isUpdate].includes(true)) {
				const patientSaved = await patient.save();
				return res.status(HTTP_STATUS_OK).json(new ResponseObject(patientSaved, null, "Updated successfully"));
			}

			return res.status(HTTP_STATUS_OK).json(new ResponseObject(patient, null, "Updated successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}

	public static async delete(req: Request, res: Response) {
		const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;
		//@ts-ignore
		const veterinaryId = req.veterinary.id;
		const { id } = req.params;

		try {
			const patient = await Patient.findOne({_id: `${id}`, veterinaryId});
			console.log(patient);

			if(patient === null) {
				return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseObject(patient, null, "Patient not found"));
			}

			await patient.delete();
			return res.status(HTTP_STATUS_OK).json(new ResponseObject(null, null, "Patient deleted successfully"));

		} catch (e) {
			return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json(new ResponseObject(null, null, "Internal server error"));
		}
	}
}

export default PatientController;

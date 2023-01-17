import {
	AuthenticateRequestObject,
	IVeterinary,
	ProfileRequestObject,
	RegisterRequestObject
} from "../interfaces/VeterinaryInterfaces";
import ResponseObject from "../ResponseObject";
import {PatientRequestObject} from "../interfaces/PatientInterfaces";

class Validation {

	private static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	private static  phoneRegex = /[+]507[- ]6[0-9]{3}[- ][0-9]{4}/;


	public static emailValidation(email: string) {
		const response = this.isEmptyValidation(email, "The email can't be empty");
		if(response !== null) {
			return response;
		}

		else if(!this.emailRegex.test(email)) {
			return "The email don't have a valid format";
		}

		return null;
	}

	public static firstNameValidation(firstName: string) {
		const response = this.isEmptyValidation(firstName, "The first name can't be empty");
		if(response !== null) {
			return response;
		}

		return null;
	}

	public static lastNameValidation(lastName: string) {
		const response = this.isEmptyValidation(lastName, "The last name can't be empty");
		if(response !== null) {
			return response;
		}

		return null;
	}

	public static passwordValidation(password: string) {
		const response = this.isEmptyValidation(password, "The password length min 8 characters");
		if(response !== null) {
			return response;
		}

		else if(password.length < 8) {
			return "The password length min 8 characters";
		}

		return null;
	}

	public static registerValidation(data: RegisterRequestObject) {
		const errors = {
			firstName: this.firstNameValidation(data.firstName),
			lastName: this.lastNameValidation(data.lastName),
			email: this.emailValidation(data.email),
			password: this.passwordValidation(data.password)
		}

		const { firstName, lastName, email, password } = errors;
		if(firstName === null && lastName === null && email === null && password === null) {
			return null;
		}

		return new ResponseObject(data, errors, "Failed validation");
	}

	public static recoverValidation(password: string) {
		const data = { password }
		const errors = {
			password: this.passwordValidation(password)
		}

		if(errors.password === null) {
			return null;
		}

		return new ResponseObject(data, errors, "Failed validation");
	}

	public static resetValidation(password: string) {
		const data = { password }
		const errors = {
			password: this.passwordValidation(password)
		}

		if(errors.password === null) {
			return null;
		}

		return new ResponseObject(data, errors, "Failed validation");
	}

	public static authenticateValidation(data: AuthenticateRequestObject) {
		const errors = {
			email: this.emailValidation(data.email),
			password: this.isEmptyValidation(data.password, "The password can't be empty")
		}

		if(errors.password === null && errors.email === null) {
			return null;
		}

		return new ResponseObject(data, errors, "Failed validation");
	}

	public static updateProfileValidation(data: ProfileRequestObject) {
		const errors = {
			firstName: this.firstNameValidation(data.firstName),
			lastName: this.lastNameValidation(data.lastName),
			email: this.emailValidation(data.email)
		}

		if(errors.email === null && errors.lastName === null && errors.firstName === null) {
			return null;
		}

		return new ResponseObject(data, errors, "Failed validation");
	}

	public static phoneValidation(phone: string) {
		const response = this.isEmptyValidation(phone, "The phone can't be empty");
		if(response !== null) {
			return response;
		}

		else if(!this.phoneRegex.test(phone)) {
			return "The phone don't have a valid format";
		}

		return null;
	}

	public static createAndUpdatePatientValidation(data: PatientRequestObject) {
		const errors = {
			name: this.isEmptyValidation(data.name, "The name can't be empty"),
			owner: this.isEmptyValidation(data.owner, "The owner can't be empty"),
			email: this.emailValidation(data.email),
			phone: this.phoneValidation(data.phone),
			symptoms: this.isEmptyValidation(data.symptoms, "The symptoms can't be empty"),
			date: this.isEmptyValidation(data.date, "The date can't be empty")
		}

		if(errors.name === null && errors.owner === null && errors.email === null && errors.phone === null && errors.symptoms === null && errors.date === null) {
			return null;
		}

		return new ResponseObject(data, errors, "Failed validation");
	}

	public static isEmptyValidation(data: string, message: string) {
		if(data === undefined || data === null || data.trim() === "") {
			return message;
		}

		return null;
	}

}

export default Validation;

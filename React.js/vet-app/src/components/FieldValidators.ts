class FieldValidators {

	protected static emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	protected static  phoneRegex = /[+]507[- ]6[0-9]{3}[- ][0-9]{4}/;

	static validEmail(email: String, setState: Function) {
		email = email.trim();

		if(email === "") {
			setState("The email can't be empty");
			return true;
		}

		//@ts-ignore
		else if(!this.emailRegex.test(email)) {
			setState("The email don't have a valid format");
			return true;
		}

		return false;
	}

	static validFirstName(firstName: String, setState: Function) {
		if(firstName.trim() === "") {
			setState("The first name can't be empty");
			return true;
		}

		return false;
	}

	static validLastName(lastName: String, setState: Function) {
		if(lastName.trim() === "") {
			setState("The last name can't be empty");
			return true;
		}

		return false;
	}

	static validName(name: String, setState: Function) {
		if (name.trim() === "") {
			setState("The patient name can't be empty");
			return true;
		}

		return false;
	}

	static validOwner(owner: String, setState: Function) {
		if (owner.trim() === "") {
			setState("The owner can't be empty");
			return true;
		}

		return false;
	}

	static validPhone(phone: String, setState: Function) {
		if (phone.trim() === "") {
			setState("The phone can't be empty");
			return true;
		}

		else if(!this.phoneRegex.test(phone.trim())) {
			setState("The phone don't have a valid format");
			return true;
		}

		return false;
	}

	static validSymptoms(symptoms: String, setState: Function) {
		if (symptoms.trim() === "") {
			setState("The symptoms can't be empty");
			return true;
		}

		return false;
	}

	static validDate(date: String, setState: Function) {
		if (date.trim() === "") {
			setState("The date can't be empty");
			return true;
		}

		return false;
	}

	static valid2SPassword(password: String, password2: String, setState: Function, setState2: Function) {
		let isError: boolean = false;
		password = password.trim();
		password2 = password2.trim();

		if(password2 === "") {
			isError = true;
			setState2("The password can't be empty");
		}

		if(password === "") {
			isError = true;
			setState("The password can't be empty");
		}

		else if(password.length < 8) {
			isError = true;
			setState("Password min length 8 characters");
		}

		else if(password !== password2) {
			isError = true;
			setState("the passwords are not the same");
			setState2("the passwords are not the same");
		}

		return isError;
	}

	static validPassword(password: String, setState: Function) {
		if(password === "") {
			setState("The password can't be empty");
			return true;
		}

		return false;
	}
}

export default FieldValidators;

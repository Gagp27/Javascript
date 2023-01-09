const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function registerUserValidation(data, errors) {
	const { firstName, lastName, userName, email, password } = data;

	if(firstName === null ||  firstName.trim() === "") {
		errors.firstName = "The firstname can't be empty";
	}

	if(lastName === null || lastName.trim() === "") {
		errors.lastName = "The lastname can't be empty";
	}

	if(userName === null || userName.trim() === "") {
		errors.userName = "The username can't be empty";
	}

	if(email === null || email.trim() === "") {
		errors.email = "The email can't be empty";
	}

	else if (!emailRE.test(email.trim())) {
		errors.email = "Invalid email format";
	}

	if(password === null || password.trim() === "") {
		errors.password = "The password can't be empty";
	}

	else if(password.trim().length < 8) {
		errors.password = "Password min length 8 characters";
	}
}

export function emailValidation (data, errors) {
	const { email } = data;

	if(email === undefined || email === null) {
		data.email = null;
		errors.email = "The email can't be empty";
	}

	else if(email.trim() === "") {
		errors.email = "The email can't be empty";
	}

	else if (!emailRE.test(email.trim())) {
		errors.email = "invalid email format";
	}

	return {data, errors}
}

export function passwordValidation (data, errors) {
	const { password } = data;

	if(password === undefined || password === null) {
		data.password = null;
		errors.password = "The password can't be empty";
	}

	else if(password.trim() === "") {
		errors.password = "The password can't be empty";
	}

	else if(password.trim().length < 8) {
		errors.password = "Password min length 8 characters";
	}
}

export function loginValidation(data, errors) {
	const {email, password} = data;

	if(email === undefined || email === null) {
		data.email = null;
		errors.email = "The email can't be empty";
	}

	else if(email.trim() === "") {
		errors.email = "The email can't be empty";
	}

	else if (!emailRE.test(email.trim())) {
		errors.email = "invalid email format";
	}

	if(password === undefined || password === null) {
		data.password = null;
		errors.password = "The password can't be empty";
	}

	else if(password.trim() === "") {
		errors.password = "The password can't be empty";
	}
}

export function editProfileValidation(data, errors) {
	const { firstName, lastName, userName, email } = data;

	if(firstName === undefined || firstName === null) {
		data.firstName = null;
		errors.firstName = "The firstname can't be empty";
	}

	else if (firstName.trim() === "") {
		errors.firstName = "The firstname can't be empty";
	}


	if(lastName === undefined || lastName === null) {
		data.lastName = null;
		errors.lastName = "The lastname can't be empty";
	}

	else if (lastName.trim() === "") {
		errors.lastName = "The lastname can't be empty";
	}


	if(userName === undefined || userName === null) {
		data.userName = null;
		errors.userName = "The username can't be empty";
	}

	else if (userName.trim() === "") {
		errors.userName = "The username can't be empty";
	}


	if(email === undefined || email === null) {
		data.email = null;
		errors.email = "The email can't be empty";
	}

	else if(email.trim() === "") {
		errors.email = "The email can't be empty";
	}

	else if (!emailRE.test(email.trim())) {
		errors.email = "invalid email format";
	}
}

export function editProfileChangePasswordValidation(data, errors) {
	const { currentPassword, newPassword } = data;

	if(currentPassword === undefined || currentPassword === null) {
		data.currentPassword = null;
		errors.currentPassword = "The password can't be empty";
	}

	else if(currentPassword === "") {
		errors.currentPassword = "The password can't be empty";
	}

	if(newPassword === undefined || newPassword === null) {
		data.newPassword = null;
		errors.newPassword = "The password can't be empty";
	}

	else if(newPassword === "") {
		errors.newPassword = "The password can't be empty";
	}

	else if(newPassword.length < 8) {
		errors.newPassword = "Password min length 8 characters";
	}
}

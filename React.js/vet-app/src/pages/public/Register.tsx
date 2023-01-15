import React, {useState} from "react";
import {Link} from "react-router-dom";
import Alert from "../../components/Alert";
import Request from "../../components/Request";
import FieldValidators from "../../components/FieldValidators";
import Spinner from "../../components/Spinner";


interface RequestBody {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

interface Response400 {
	data: {
		firstName: string | null,
		lastName: string | null,
		email: string | null,
		password: string | null
	}
	errors: {
		firstName: string | null,
		lastName: string | null,
		email: string | null,
		password: string | null
	};
	message: string;
}

const Register: React.FunctionComponent = () => {

	const [showModal, setShowModal] = useState(false);
	const [showSpinner, setShowSpinner] = useState(false);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
	const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const [RPasswordErrorMessage, setRPasswordErrorMessage] = useState("");


	const cleanStates = (cleanAll: boolean) => {

		if(cleanAll) {
			setFirstName("");
			setLastName("");
			setEmail("");
			setPassword("");
			setRepeatPassword("");
		}

		setFirstNameErrorMessage("");
		setLastNameErrorMessage("");
		setEmailErrorMessage("");
		setPasswordErrorMessage("");
		setRPasswordErrorMessage("");
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setShowSpinner(true);
		cleanStates(false);

		const fNameHasError: boolean = FieldValidators.validFirstName(firstName, setFirstNameErrorMessage);
		const lNameHasError: boolean = FieldValidators.validLastName(lastName, setLastNameErrorMessage);
		const emailHasError: boolean = FieldValidators.validEmail(email, setEmailErrorMessage);
		const passwordHasError: boolean = FieldValidators.valid2SPassword(password, repeatPassword, setPasswordErrorMessage, setRPasswordErrorMessage);

		if([fNameHasError, lNameHasError, emailHasError, passwordHasError].includes(true)) {
			return setShowSpinner(false);
		}

		const body: RequestBody = { firstName, lastName, email, password }
		const result = await Request.requestHandler("api/veterinary/register", "post", body, null);

		if(result.status === 400) {
			const response: Response400 = await result.json();
			setFirstNameErrorMessage(response.errors.firstName || "");
			setLastNameErrorMessage(response.errors.lastName || "");
			setEmailErrorMessage(response.errors.email || "");
			setPasswordErrorMessage(response.errors.password || "");
			return setShowSpinner(false);
		}

		if(result.status === 201) {
			cleanStates(true);
			setShowSpinner(false);
			return setShowModal(true);
		}
	}

	return(
		<>
			<div>
				<h1 className="text-indigo-600 font-black text-6xl text-center lg:text-start">Create your Account and Manage <span className={"text-neutral-900"}>your Patients</span></h1>
			</div>

			<div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
				<form onSubmit={handleSubmit} noValidate={true}>
					<div className="my-5">
						<label htmlFor="firstName" className="uppercase text-gray-600 block text-xl font-bold">First Name:</label>
						<input type="text" id="firstName" value={firstName} placeholder="John" className={(firstNameErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setFirstName(event.target.value)} disabled={showSpinner} />
						<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{firstNameErrorMessage}</p>
					</div>

					<div className="my-5">
						<label htmlFor="lastName" className="uppercase text-gray-600 block text-xl font-bold">Last Name:</label>
						<input type="text" id="lastName" value={lastName} placeholder="Doe" className={(lastNameErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setLastName(event.target.value)} disabled={showSpinner} />
						<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{lastNameErrorMessage}</p>
					</div>

					<div className="my-5">
						<label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email:</label>
						<input type="email" id="email" value={email} placeholder="example@mail.com" className={(emailErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setEmail(event.target.value)} disabled={showSpinner} />
						<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{emailErrorMessage}</p>
					</div>

					<div className="my-5">
						<label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password:</label>
						<input type="password" id="password" value={password} placeholder="password" className={(passwordErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setPassword(event.target.value)} disabled={showSpinner} />
						<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{passwordErrorMessage}</p>
					</div>

					<div className="my-5">
						<label htmlFor="repeatPassword" className="uppercase text-gray-600 block text-xl font-bold">Repeat Password:</label>
						<input type="password" id="repeatPassword" value={repeatPassword} placeholder="password" className={(RPasswordErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setRepeatPassword(event.target.value)} disabled={showSpinner} />
						<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{RPasswordErrorMessage}</p>
					</div>

					{showSpinner ?
						<Spinner /> :
						(<input type="submit" value="Create Account" className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 lg:w-auto" />)
					}
				</form>

				<div className="mt-10 lg:flex lg:justify-between">
					<Link className="block text-center lg:text-start my-5 text-gray-500 hover:text-indigo-600" to="/">Do you already have an account? Log in</Link>
					<Link className="block text-center lg:text-end my-5 text-gray-500 hover:text-indigo-600" to="/recover-account">Forget your password? Recover account</Link>
				</div>
			</div>

			{showModal && <Alert setShowModal={setShowModal} text1={"Your account has been registered"} text2={"check your email to confirm it!"} redirect={null} /> }
		</>
	)
}

export default Register;

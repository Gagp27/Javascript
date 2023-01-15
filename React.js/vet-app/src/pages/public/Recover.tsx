import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import FieldValidators from "../../components/FieldValidators";
import Request from "../../components/Request";

interface RequestBody {
	email: string;
}

interface Response400 {
	data: {
		email: string
	}
	errors: {
		email: string
	}
	message: string
}

const Recover: React.FunctionComponent = () => {

	const [showModal, setShowModal] = useState(false);
	const [showSpinner, setShowSpinner] = useState(false);
	const [email, setEmail] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault();
		setShowSpinner(true);
		setEmailErrorMessage("");

		const emailHasError: boolean = FieldValidators.validEmail(email, setEmailErrorMessage);
		if(emailHasError) {
			return setShowSpinner(false);
		}

		const body: RequestBody = {email };
		const result = await Request.requestHandler("api/veterinary/recover-account","post", body, null);

		if(result.status === 400) {
			const response: Response400 = await result.json();
			setEmailErrorMessage(response.errors.email || "");
			return setShowSpinner(false);
		}

		if(result.status === 200) {
			setEmail("");
			setEmailErrorMessage("");
			setShowSpinner(false);
			return setShowModal(true);
		}
	}

	return(
		<>
			<div>
				<h1 className="text-indigo-600 font-black text-6xl text-center lg:text-start">Recover your Account and don't Lose <span className={"text-neutral-900"}>your Patients</span></h1>
			</div>

			<div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
				<form onSubmit={handleSubmit} noValidate={true}>
					<div className="my-5">
						<label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email:</label>
						<input type="email" id="email" value={email} placeholder="example@mail.com" className={(emailErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setEmail(event.target.value)} disabled={showSpinner} />
						<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{emailErrorMessage}</p>
					</div>

					{showSpinner ?
						<Spinner /> :
						(<input type="submit" value="Recover Account" className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 lg:w-auto" />)
					}
				</form>

				<div className="mt-10 lg:flex lg:justify-between">
					<Link className="block text-center lg:text-start my-5 text-gray-500 hover:text-indigo-600" to="/register">You do not have an account? Sign up</Link>
					<Link className="block text-center lg:text-start my-5 text-gray-500 hover:text-indigo-600" to="/">Do you already have an account? Log in</Link>
				</div>
			</div>

			{showModal && <Alert setShowModal={setShowModal} text1={"You have requested to reset your password"} text2={"Now check your email to continue!"} redirect={null} /> }
		</>
	)
}

export default Recover;

import React, {useState} from 'react';
import {Link} from "react-router-dom";
import FieldValidators from "../../components/FieldValidators";
import Spinner from "../../components/Spinner";
import Request from "../../components/Request";


interface RequestBody {
	email: string;
	password: string;
}

interface Response400 {
	data: {
		email: string | null,
		password: string | null,
	}
	errors: {
		email: string | null,
		password: string | null
	}
	message: string
}

interface Response200 {
	data: {
		authenticate: boolean,
		jws: string
	}
	error: null,
	message: string
}

const Login: React.FunctionComponent = () => {

	const [showSpinner, setShowSpinner] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");


	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault();
		setShowSpinner(true);
		setEmailErrorMessage("");
		setPasswordErrorMessage("");

		const emailHasError: boolean = FieldValidators.validEmail(email, setEmailErrorMessage);
		const passwordHasError: boolean = FieldValidators.validPassword(password, setPasswordErrorMessage);

		if([emailHasError, passwordHasError].includes(true)) {
			return setShowSpinner(false);
		}

		const body: RequestBody = { email, password };

		const result = await Request.requestHandler("api/veterinary/authenticate", "post", body, null);

		if(result.status === 400) {
			const response: Response400 = await result.json();
			setEmailErrorMessage(response.errors.email || "");
			setPasswordErrorMessage(response.errors.password || "");
			setShowSpinner(false);
		}

		if(result.status === 200) {
			const response: Response200 = await result.json();
			sessionStorage.setItem("jws", response.data.jws);
			setTimeout(() => { window.location.href = "/admin" }, 5000);
		}
	}

	return (
		<>
			<div>
				<h1 className="text-indigo-600 font-black text-6xl text-center lg:text-start">LogIn and Manage <span className={"text-neutral-900"}>your Patients</span></h1>
			</div>

			<div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
				<form onSubmit={handleSubmit} noValidate={true}>
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

					{showSpinner ?
						<Spinner /> :
						(<input type="submit" value="Login" className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 lg:w-auto" />)
					}
				</form>

				<div className="mt-10 lg:flex lg:justify-between">
					<Link className="block text-center lg:text-start my-5 text-gray-500 hover:text-indigo-600" to="/register">You do not have an account? Sign up</Link>
					<Link className="block text-center lg:text-end my-5 text-gray-500 hover:text-indigo-600" to="/recover-account">Forget your password? Recover account</Link>
				</div>
			</div>
		</>
	)
}

export default Login;

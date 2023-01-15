import React, {useEffect, useState} from 'react';
import Alert from "../../components/Alert";
import Spinner from "../../components/Spinner";
import FieldValidators from "../../components/FieldValidators";
import Request from "../../components/Request";
import {useParams} from "react-router-dom";


interface RequestBody {
	password: string;
}

interface Response400 {
	data: {
		password: string | null;
	}
	errors: {
		password: string | null;
	}
	message: string;
}

const Reset: React.FunctionComponent = () => {

	const { token } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [showSpinner, setShowSpinner] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const [rPasswordErrorMessage, setRPasswordErrorMessage] = useState("");

	useEffect(() => {
		const requestHandler = async () => {
			setShowForm(false);
			const result = await Request.requestNoBodyHandler(`api/veterinary/recover-account/${token}`, "get", null);
			const response = await result.json();
			console.log(response);

			if(result.status === 200) {
				setIsLoading(false);
				return setShowForm(true);
			}

			return setIsLoading(false);
		}

		requestHandler().then();
	}, [token]);

	const cleanState = (cleanAll: boolean) => {
		if(cleanAll) {
			setPassword("");
			setRepeatPassword("");
		}

		setPasswordErrorMessage("");
		setRPasswordErrorMessage("");
	}

	const handlerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setShowSpinner(true);
		cleanState(false);

		const passwordHasError: boolean = FieldValidators.valid2SPassword(password, repeatPassword, setPasswordErrorMessage, setRPasswordErrorMessage);

		if(passwordHasError) {
			return setShowSpinner(false);
		}

		const body: RequestBody = { password };
		const result = await Request.requestHandler(`api/veterinary/recover-account/${token}`, "post", body, null);

		if(result.status === 400) {
			const response: Response400 = await result.json();
			setPasswordErrorMessage(response.errors.password || "");
			return setShowSpinner(false);
		}

		if(result.status === 200) {
			cleanState(true);
			setShowSpinner(false);
			return setShowModal(true);
		}
	}

	return(
		<>
			<div>
				<h1 className="text-indigo-600 font-black text-6xl text-center lg:text-start">Reset your password, don't lose access to <span className={"text-neutral-900"}>your Patients</span></h1>
			</div>

			<div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
				{ (!isLoading && !showForm) && <p className="text-center text-gray-500 text-3xl">The token is invalid or has already expired</p> }
				{ (!isLoading && showForm) &&
					<form onSubmit={handlerSubmit} noValidate={true}>
						<div className="my-5">
							<label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password:</label>
							<input type="password" id="password" value={password} placeholder="password" className={(passwordErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setPassword(event.target.value)} disabled={showSpinner} />
							<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{passwordErrorMessage}</p>
						</div>

						<div className="my-5">
							<label htmlFor="repeatPassword" className="uppercase text-gray-600 block text-xl font-bold">Repeat Password:</label>
							<input type="password" id="repeatPassword" value={repeatPassword} placeholder="password" className={(rPasswordErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setRepeatPassword(event.target.value)} disabled={showSpinner} />
							<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{rPasswordErrorMessage}</p>
						</div>

						{showSpinner ?
							<Spinner /> :
							(<input type="submit" value="Create Account" className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 lg:w-auto" />)
						}
					</form>
				}
			</div>

			{showModal && <Alert setShowModal={setShowModal} text1={"Your password has been changed"} text2={"now you can login!"} redirect={"/"} /> }

		</>
	)
}

export default Reset;

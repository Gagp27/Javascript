import React, {useEffect, useState} from 'react';
import DashboardLayout from "../../layout/DashboardLayout";
import FieldValidators from "../../components/FieldValidators";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import useAuth from "../../hooks/useAuth";

interface RequestBody {
	firstName: string,
	lastName: string,
	email: string
}

interface Response400 {
	data: {
		firstName: string | null,
		lastName: string | null,
		email: string | null
	};
	errors: {
		firstName: string | null,
		lastName: string | null,
		email: string | null
	};
	message: string;
}

interface Response200 {
	data: {
		id: string,
		firstName: string,
		lastName: string,
		email: string
	};
	errors: null;
	message: string;
}

const Profile: React.FunctionComponent = () => {

	//@ts-ignore
	const { auth, editProfile, setAuth } = useAuth();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {

		setFirstName(auth.firstName);
		setLastName(auth.lastName);
		setEmail(auth.email);

	}, [auth.email, auth.firstName, auth.lastName]);


	const [showModal, setShowModal] = useState(false);
	const [showSpinner, setShowSpinner] = useState(false);

	const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
	const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault();
		setShowSpinner(true);
		setFirstNameErrorMessage("");
		setLastNameErrorMessage("");
		setEmailErrorMessage("");

		const fNameHasError: boolean = FieldValidators.validFirstName(firstName, setFirstNameErrorMessage);
		const lNameHasError: boolean = FieldValidators.validLastName(lastName, setLastNameErrorMessage);
		const emailHasError: boolean = FieldValidators.validEmail(email, setEmailErrorMessage);

		if([fNameHasError, lNameHasError, emailHasError].includes(true)) {
			return setShowSpinner(false);
		}

		const body: RequestBody = { firstName, lastName, email };

		const result = await editProfile(body);
		if(!result) {
			return console.log("wtf where is the token");
		}

		if(result.status === 400) {
			const response: Response400 = await result.json();
			setFirstNameErrorMessage(response.errors.firstName || "");
			setLastNameErrorMessage(response.errors.lastName || "");
			setEmailErrorMessage(response.errors.email || "");
			return setShowSpinner(false);
		}

		if(result.status === 200) {
			const response: Response200 = await result.json();
			const { id, firstName, lastName, email } = response.data;
			setAuth({ auth: true, id, firstName, lastName, email });
			setShowSpinner(false);
			setShowModal(true);
		}
	}

	return (
		<DashboardLayout>
			<>
				<h2 className={"font-black text-3xl text-center mt-10"}>Edit Profile</h2>
				<p className={"text-xl mt-5 mb-10 text-center"}>Modify your {" "} <span className={"text-indigo-600 font-bold"}>Information here</span></p>

				<div className={"flex justify-center"}>
					<div className={"w-full md:w-1/2 bg-white shadow rounded-lg p-5"}>

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

							{showSpinner ?
								<Spinner /> :
								(<input type="submit" value="Edit Profile" className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 lg:w-auto" />)
							}
						</form>
					</div>
				</div>

				{showModal && <Alert setShowModal={setShowModal} text1={"Your profile"} text2={"has been updated!"} redirect={null} /> }
			</>
		</DashboardLayout>
	);
}

export default Profile;

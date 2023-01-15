import React, {useEffect, useState} from 'react';
import Spinner from "./Spinner";
import Alert from "./Alert";
import FieldValidators from "./FieldValidators";
import useDashboard from "../hooks/useDashboard";

interface RequestBody {
	name: string;
	owner: string;
	email: string;
	phone: string;
	symptoms: string;
	date: string;
}

interface Response400 {
	data: {
		name: string | null,
		owner: string | null,
		email: string | null,
		phone: string | null,
		symptoms: string | null,
		date: string | null
	};

	errors: {
		name: string | null,
		owner: string | null,
		email: string | null,
		phone: string | null,
		symptoms: string | null,
		date: string | null
	};

	message: string;
}

interface PatientObject {
	id: string;
	name: string;
	owner: string;
	email: string;
	phone: string;
	date: string;
	symptoms: string;
}


const PatientForm = () => {

	//@ts-ignore
	const { createPatient, updatePatient, isUpdate, formData } = useDashboard();

	const [showSpinner, setShowSpinner] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [modalText1, setModalText1] = useState("");
	const [modalText2, setModalText2] = useState("");

	const [name, setName] = useState(formData.name);
	const [owner, setOwner] = useState(formData.owner);
	const [email, setEmail] = useState(formData.email)
	const [phone, setPhone] = useState(formData.phone);
	const [symptoms, setSymptoms] = useState(formData.symptoms);
	const [date, setDate] = useState(formData.date);

	const [nameErrorMessage, setNameErrorMessage] = useState("");
	const [ownerErrorMessage, setOwnerErrorMessage] = useState("");
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
	const [symptomsErrorMessage, setSymptomsErrorMessage] = useState("");
	const [dateErrorMessage, setDateErrorMessage] = useState("");

	useEffect(() => {
		setName(formData.name);
		setOwner(formData.owner);
		setEmail(formData.email);
		setPhone(formData.phone);
		setSymptoms(formData.symptoms);
		setDate(formData.date);
	}, [formData]);


	const cleanStates = (cleanAll: boolean) => {
		if(cleanAll) {
			setName("");
			setOwner("");
			setEmail("");
			setPhone("");
			setSymptoms("");
			setDate("");
		}

		setNameErrorMessage("");
		setOwnerErrorMessage("");
		setEmailErrorMessage("");
		setPhoneErrorMessage("");
		setSymptomsErrorMessage("");
		setDateErrorMessage("");
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setShowSpinner(true);
		cleanStates(false);

		const nameHasError: boolean = FieldValidators.validName(name, setNameErrorMessage);
		const ownerHasError: boolean = FieldValidators.validOwner(owner, setOwnerErrorMessage);
		const emailHasError: boolean = FieldValidators.validEmail(email, setEmailErrorMessage);
		const phoneHasError: boolean = FieldValidators.validPhone(phone, setPhoneErrorMessage);
		const symptomsHasError: boolean = FieldValidators.validSymptoms(symptoms, setSymptomsErrorMessage);
		const dateHasError: boolean = FieldValidators.validDate(date, setDateErrorMessage);

		if([nameHasError, ownerHasError, emailHasError, phoneHasError, symptomsHasError, dateHasError].includes(true)) {
			return setShowSpinner(false);
		}

		const body: RequestBody = { name, owner, email, phone, symptoms, date };
		let result;

		if(isUpdate) {
			result = await updatePatient(body, formData.id);

		} else {
			result = await createPatient(body);
		}

		if(result === null) {
			console.log("wtf where is my token");
		}

		if(result.status === 400) {
			const response: Response400 = await result.json();
			setNameErrorMessage(response.errors.name || "");
			setOwnerErrorMessage(response.errors.owner || "");
			setEmailErrorMessage(response.errors.email || "");
			setPhoneErrorMessage(response.errors.phone || "");
			setSymptomsErrorMessage(response.errors.symptoms || "");
			setDateErrorMessage(response.errors.date || "");
			return setShowSpinner(false);
		}

		if(result.status === 200 || result.status === 201) {
			cleanStates(true);
			setShowSpinner(false);
			setModalText1("Your Patient");
		}

		if(result.status === 201 ) {
			setModalText2("has been registered!");
			return setShowModal(true);
		}

		if(result.status === 200) {
			setModalText2("has been updated!");
			return setShowModal(true);
		}
	}

	return (
		<>
			<h2 className="font-black text-3xl text-center">Patients Form</h2>
			<p className="text-xl mt-5 text-center mb-10">Add your patients and {""}
				<span className="text-indigo-600 font-bold">manage them</span>
			</p>

			<form className="bg-white py-10 px-5 mb-10 lg:mb-0 shadow-md rounded-md" onSubmit={handleSubmit} noValidate={true}>
				<div className="my-5">
					<label htmlFor="name" className="uppercase text-gray-600 block text-xl font-bold">Patient Name:</label>
					<input type="text" id="name" value={name} placeholder="Hook Jr." className={(nameErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setName(event.target.value)} disabled={showSpinner} />
					<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{nameErrorMessage}</p>
				</div>

				<div className="my-5">
					<label htmlFor="owner" className="uppercase text-gray-600 block text-xl font-bold">Owner Name:</label>
					<input type="text" id="owner" value={owner} placeholder="John Doe" className={(ownerErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setOwner(event.target.value)} disabled={showSpinner} />
					<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{ownerErrorMessage}</p>
				</div>

				<div className="my-5">
					<label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Owner Email:</label>
					<input type="email" id="email" value={email} placeholder="example@mail.com" className={(emailErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setEmail(event.target.value)} disabled={showSpinner} />
					<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{emailErrorMessage}</p>
				</div>

				<div className="my-5">
					<label htmlFor="phone" className="uppercase text-gray-600 block text-xl font-bold">Owner Phone:</label>
					<input type="text" id="phone" value={phone} placeholder="+507-6000-0000" className={(phoneErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setPhone(event.target.value)} disabled={showSpinner} />
					<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{phoneErrorMessage}</p>
				</div>

				<div className="my-5">
					<label htmlFor="symptoms" className="uppercase text-gray-600 block text-xl font-bold">Patient Symptoms:</label>
					<textarea id="symptoms" value={symptoms} placeholder="Hook Jr. don't sleep" className={(symptomsErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setSymptoms(event.target.value)} disabled={showSpinner} />
					<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{symptomsErrorMessage}</p>
				</div>

				<div className="my-5">
					<label htmlFor="date" className="uppercase text-gray-600 block text-xl font-bold">Appointment Date:</label>
					<input type="date" id="date" value={date} placeholder="John" className={(dateErrorMessage !== "") ? "border w-full p-3 mt-3 rounded-xl border-red-700 bg-red-50" : "border w-full p-3 mt-3 bg-gray-50 rounded-xl"} onChange={event => setDate(event.target.value)} disabled={showSpinner} />
					<p className="text-end mt-1 text-red-700 font-bold uppercase text-">{dateErrorMessage}</p>
				</div>

				{showSpinner ?
					<Spinner /> :
					(<input type="submit" value={isUpdate ? "Update Patient" : "Register Patient"} className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 lg:w-auto" />)
				}
			</form>

			{showModal && <Alert setShowModal={setShowModal} text1={modalText1} text2={modalText2} redirect={"/admin"} /> }
		</>
	);
}

export default PatientForm;

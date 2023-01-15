import React, {useState} from 'react';
import Alert from "./Alert";
import DeleteAlert from "./DeleteAlert";
import useDashboard from "../hooks/useDashboard";

interface PatientObject {
	id: string;
	name: string;
	owner: string;
	email: string;
	phone: string;
	date: string;
	symptoms: string;
}

type Props = {
	patient: PatientObject,
}

const Patient: React.FC<Props> = ({patient}) => {
	//@ts-ignore
	const { setIsUpdate, setFormData } = useDashboard();
	const { name, email, id, owner, symptoms, date, phone } = patient;
	const [showModal, setShowModal] = useState(false);

	const updateHandler = () => {
		setIsUpdate(true);
		return setFormData(patient);
	}

	const deleteHandler = () => {
		setShowModal(true);
	}

	return (
		<>
			<div className="mx-5 my-10 bg-white shadow-md py-10 px-5 rounded-lg">
				<p className="font-bold uppercase text-indigo-600 mb-3">Patient Name:{" "}
					<span className="text-black font-normal normal-case">{name}</span>
				</p>

				<p className="font-bold uppercase text-indigo-600 mb-3">Owner:{" "}
					<span className="text-black font-normal normal-case">{owner}</span>
				</p>

				<p className="font-bold uppercase text-indigo-600 mb-3">Owner Email:{" "}
					<span className="text-black font-normal normal-case">{email}</span>
				</p>

				<p className="font-bold uppercase text-indigo-600 mb-3">Owner Phone:{" "}
					<span className="text-black font-normal normal-case">{phone}</span>
				</p>

				<p className="font-bold uppercase text-indigo-600 mb-3">Appointment Date:{" "}
					<span className="text-black font-normal normal-case">{date}</span>
				</p>

				<p className="font-bold uppercase text-indigo-600">Symptoms:{" "}
					<span className="text-black font-normal normal-case">{symptoms}</span>
				</p>

				<div className="flex justify-between my-5">
					<button type="button" className="py-2 px-10 bg-indigo-600 hover:bg-indigo-800 text-white rounded-lg font-bold" onClick={updateHandler}>Update</button>
					<button type="button" className="py-2 px-10 bg-red-600 hover:bg-red-800 text-white rounded-lg font-bold" onClick={deleteHandler}>Delete</button>
				</div>
			</div>

			{showModal && <DeleteAlert setShowModal={setShowModal} patient={patient} /> }
		</>
	);
}

export default Patient;

import React from 'react';
import Request from "./Request";
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
	setShowModal: Function;
	patient: PatientObject;
}



const DeleteAlert: React.FC<Props> = ({setShowModal, patient}) => {

	//@ts-ignore
	const { deletePatient } = useDashboard();

	const deleteHandler = async (response: boolean) => {

		if(response) {
			console.log(patient.id);
			await deletePatient(patient.id);
		}

		setShowModal(false);
		window.location.reload();
	}

	return (
		<div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-90 flex">
			<div className="bg-white w-11/12 md:w-auto mx-auto my-auto py-20 px-2 md:px-20 pb-14 rounded-3xl flex flex-col">

				<p className="text-center font-bold text-xl mb-5">Are you sure you want to delete this record?</p>

				<div>
					<p className="font-bold uppercase text-indigo-600 mb-3">Patient Name:{" "}
						<span className="text-black font-normal normal-case">{patient.name}</span>
					</p>

					<p className="font-bold uppercase text-indigo-600 mb-3">Owner:{" "}
						<span className="text-black font-normal normal-case">{patient.owner}</span>
					</p>

					<p className="font-bold uppercase text-indigo-600 mb-3">Appointment Date:{" "}
						<span className="text-black font-normal normal-case">{patient.date}</span>
					</p>
				</div>

				<div className="flex gap-10 justify-center">
					<button className="bg-indigo-700 py-2 px-12 rounded-lg w-full md:w-auto text-white font-bold uppercase mt-12" type="button" onClick={() => deleteHandler(true)}>Yes</button>
					<button className="bg-indigo-700 py-2 px-12 rounded-lg w-full md:w-auto text-white font-bold uppercase mt-12" type="button" onClick={() => deleteHandler(false)}>No</button>
				</div>
			</div>
		</div>
	);
}

export default DeleteAlert;

import React, {useEffect, useState} from 'react';
import useDashboard from "../hooks/useDashboard";
import Patient from "./Patient";

interface PatientObject {
	id: string;
	name: string;
	owner: string;
	email: string;
	phone: string;
	date: string;
	symptoms: string;
}

interface Response {
	data: PatientObject[];

	errors: null;

	message: string;
}

const PatientList = () => {
	//@ts-ignore
	const { getPatients } = useDashboard();
	const [patients, setPatients] = useState([]);

	useEffect(() => {
		const requestHandler = async () => {
			const result = await getPatients();
			if(result.status === 200) {
				const { data }: Response = await result.json();

				//@ts-ignore
				return setPatients(data);
			}

			return setPatients([]);
		}

		requestHandler().then();
	}, [getPatients]);


	return (
		<>
			{patients.length ? (
				<>
					<h2 className="font-black text-3xl text-center">Patient List</h2>
					<p className="text-xl mt-5 mb-10 text-center">Manage your {''}
						<span className="text-indigo-600 font-bold">Patients and Appointments</span>
					</p>

					{patients.map(patient => (
						//@ts-ignore
						<Patient key={patient.id} patient={patient} />
					))}
				</>
			) : (
				<>
					<h2 className="mt-5 font-black text-3xl text-center">No Patients</h2>
					<p className="text-xl mt-5 mb-10 text-center">Start by adding patients {''}
						<span className="text-indigo-600 font-bold">and they will appear in this place</span>
					</p>
				</>
			)}
		</>
	);
}

export default PatientList;

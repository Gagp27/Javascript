import React, {useState} from 'react';
import DashboardLayout from "../../layout/DashboardLayout";
import PatientForm from "../../components/PatientForm";
import PatientList from "../../components/PatientList";

const Admin = () => {

	const [showForm, setShowForm] = useState(false);

	return (

		<DashboardLayout>
			<div className="flex flex-col md:flex-row md:gap-12">
				<button type="button" className="bg-indigo-600 text-white font-bold uppercase rounded-md mx-10 p-3 mb-5 md:hidden" onClick={() => setShowForm(!showForm)}>
					{showForm ? "Show PatientForm" : "Hide PatientForm"}
				</button>
				<div className={`${showForm ? "block" : "hidden"} md:block md:w-1/2 lg:w-3/7`}>
					<PatientForm />
				</div>
				<div className="md:w-1/2 lg:w-4/7">
					<PatientList />
				</div>
			</div>
		</DashboardLayout>
	);
}

export default Admin;

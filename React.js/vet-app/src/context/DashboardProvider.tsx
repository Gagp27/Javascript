import React, {createContext, ReactElement, useEffect, useState} from "react";
import Request from "../components/Request";

type Props = {
	children: ReactElement;
}

const DashboardContext: React.Context<Object> = createContext({})

const DashboardProvider: React.FC<Props> = ({children}) => {

	const data = {
		id: "",
		name: "",
		email: "",
		owner: "",
		symptoms: "",
		date: "",
		phone: ""
	}
	const [formData, setFormData] = useState(data);
	const [isUpdate, setIsUpdate] = useState(false);

	const getPatients = async () => {
		const token = sessionStorage.getItem("jws");
		if(!token) return null;

		return await Request.requestNoBodyHandler("api/patient/", "get", token);
	}

	const getPatient = async (id: string) => {
		const token = sessionStorage.getItem("jws");
		if(!token) return null;

		return await Request.requestNoBodyHandler(`api/patient/${id}`, "get", token);
	}

	const createPatient = async (body: Object) => {
		const token = sessionStorage.getItem("jws");
		if(!token) return null;

		return await Request.requestHandler("api/patient/", "post", body, token);
	}

	const updatePatient = async (body: Object, id: string) => {
		const token = sessionStorage.getItem("jws");
		if(!token) return null;

		return await Request.requestHandler(`api/patient/${id}`, "put", body, token)
	}

	const deletePatient = async (id: string) => {
		const token = sessionStorage.getItem("jws");
		if(!token) return null;

		return await Request.requestNoBodyHandler(`api/patient/${id}`, "delete", token);
	}

	return (
		<DashboardContext.Provider value={{
			isUpdate,
			setIsUpdate,
			formData,
			setFormData,
			getPatients,
			getPatient,
			createPatient,
			updatePatient,
			deletePatient
		}}>
			{children}
		</DashboardContext.Provider>
	)
}


export { DashboardProvider };
export default DashboardContext;

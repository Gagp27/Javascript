import React, {createContext, ReactElement, useEffect, useState} from "react";
import Request from "../components/Request";

type Props = {
	children: ReactElement;
}
interface Response {
	data: {
		id: string,
		firstName: string,
		lastName: string,
		email: string
	}
	errors: null,
	message: string
}

interface Profile {
	id: string,
	firstName: string,
	lastName: string,
	email: string
}

const AuthContext: React.Context<Object> = createContext({})

const AuthProvider: React.FC<Props> = ({children}) => {

	const [auth, setAuth] = useState({ auth: false, id: "", firstName: "", lastName: "", email: "" });
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = sessionStorage.getItem("jws");
		if(!token) return setIsLoading(false);

		const requestHandler = async () => {
			const result = await Request.requestNoBodyHandler("api/veterinary/profile","get", token);
			const response: Response = await result.json();
			const { id, lastName, firstName, email } = response.data;
			setAuth({ auth: true, id, firstName, lastName, email });
			return setIsLoading(false);
		}

		requestHandler().then();
	}, []);

	const logOut = () => {
		sessionStorage.removeItem("jws");
		setAuth({ auth: false, id: "", firstName: "", lastName: "", email: "" });
		window.location.href = "/";
	}

	const editProfile = async (body: Profile) => {
		const token = sessionStorage.getItem("jws");
		if(!token) return null;

		return await Request.requestHandler("api/veterinary/profile/edit", "put", body, token);
	}

	return (
		<AuthContext.Provider value={{
			auth,
			setAuth,
			isLoading,
			logOut,
			editProfile,
		}}>
			{children}
		</AuthContext.Provider>
	)
}


export { AuthProvider };
export default AuthContext;

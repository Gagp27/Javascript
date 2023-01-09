import React, {createContext, ReactElement, useEffect, useState} from "react";

type Props = {
	children: ReactElement
}

const AuthContext = createContext({});

const AuthProvider: React.FC<Props> = ({children}) => {

	const [auth, setAuth] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = sessionStorage.getItem('up_task_jws');
		if(!token) {
			return setIsLoading(false);
		}
		const authenticateHandler = async () => {
			try {
				const result = await fetch('http://localhost/api/users/profile', {
					method: 'get',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
						'Access-Control-Allow-Origin': 'http://localhost:3000'
					}
				});

				const response = await result.json();

				setAuth(response.data);
				return setIsLoading(false);

			} catch (e) {
				setAuth({});
				return console.log(e);
			}
		}

		authenticateHandler();
	}, []);

	const logOut = () => {
		sessionStorage.removeItem('up_task_jws');
		setAuth({userId: null, userName: null, lastName: null, firstName: null, email: null});
		window.location.href = '/';
	}

	const updateProfile = async (data: Object) => {
		const token = sessionStorage.getItem('up_task_jws');
		if(!token) {
			return setIsLoading(false);
		}

		try {
			return await fetch('http://localhost/api/users/profile/edit', {
				method: 'put',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'Access-Control-Allow-Origin': 'http://localhost:3000'
				},
				body: JSON.stringify(data)
			});

		} catch (e) {
			console.log(e);
		}
	}

	const changePassword = async (data: Object) => {
		const token = sessionStorage.getItem('up_task_jws');
		if(!token) {
			return setIsLoading(false);
		}

		try {
			return  await fetch('http://localhost/api/users/profile/change-password', {
				method: 'put',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify(data)
			});

		} catch (e) {
			console.log(e);
		}
	}

	return(
		<AuthContext.Provider value={{
			isLoading,
			auth,
			setAuth,
			logOut,
			updateProfile,
			changePassword,
		}}>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthProvider };
export default AuthContext;

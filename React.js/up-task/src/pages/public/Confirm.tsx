import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";

import './../../styles/Confirm.css';

import Title from "../../components/Title";
import Alerts from "../../components/Alerts";

interface DataResponse {
	data: null;
	errors: string;
	message: string;
}

const Confirm = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [alert, setAlert] = useState({error: true, message: ''});
	const { token, userId } = useParams();


	useEffect(() => {
		const handleRequestServer = async () => {
			const result = await fetch(`http://localhost/api/users/confirm/${token}/${userId}`, {
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
			});
			const response: DataResponse = await result.json();
			const { errors, message, data } = response;

			if(result.status === 400) {
				setAlert({error: true, message: message});
				setIsConfirmed(false);
				return setIsLoading(false);
			}

			if(result.status === 200) {
				setAlert({error: false, message: message});
				setIsConfirmed(true);
				return setIsLoading(false);
			}
		}

		handleRequestServer().then(r => console.log('success'));

	}, [token, userId]);

	return(
		<div className='confirm'>
			<Title />

			<div className='container-sm'>
				<p className='page-description'>Confirm your account</p>
				{(!isLoading && !isConfirmed) && <Alerts alerts={alert} />}
				{(!isLoading && isConfirmed) && <>
			<Alerts alerts={alert} />
			<Link to='/' className='button'>Login</Link>
		</>}
			</div>

		</div>
	);
}

export default Confirm;

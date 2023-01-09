import React, {useEffect, useState} from "react";

import '../../styles/Form.css';
import './../../styles/ResetPass.css'

import Title from '../../components/Title';
import Loader from "../../components/Loader";
import {useParams} from "react-router-dom";
import Alerts from "../../components/Alerts";
import RecoveredMessage from "../../components/RecoveredMessage";


interface Data {
	password: string | null;
}

interface Errors {
	password: string | null;
}

interface DataResponse {
	data: Data;

	errors: Errors;

	message: string;
}


const ResetPass = () => {

	const data: Data = {
		password: null
	}

	const [isLoading, setIsLoading] = useState(true);

	const [load, setLoad] = useState(false);
	const [success, setSuccess] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [alert, setAlert] = useState({error: false, message: ''});

	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState('');

	const { token, userId } = useParams();


	useEffect(() => {
		const validTokenToReset = async () => {
		  const result = await fetch(`http://localhost/api/users/recover-account/${token}/${userId}`);
			const response: DataResponse = await result.json();

			if(result.status === 400 || result.status === 404) {
				setIsValid(false);
				setIsLoading(false);
				return setAlert({error: true, message: response.message});
			}

			if(result.status === 200) {
				setIsLoading(false);
				return setIsValid(true);
			}
		}
		validTokenToReset();
	}, []);


	const formValidation = async () => {
		let fieldErrors = false;

		if(password.trim() === '' || repeatPassword.trim() === '') {
			fieldErrors = true;
			setPasswordErrorMessage('The password can\'t be empty');
			setRepeatPasswordErrorMessage('The password can\'t be empty');
		}

		else if(password.trim().length < 8) {
			fieldErrors = true;
			setPasswordErrorMessage('Password min length 8 characters');
		}

		else if(password.trim() !== repeatPassword.trim()) {
			fieldErrors = true;
			setPasswordErrorMessage('The passwords must be equals');
			setRepeatPasswordErrorMessage('The passwords must be equals');
		}

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoad(true);

		setPasswordErrorMessage('');
		setRepeatPasswordErrorMessage('');

		const fieldErrors: boolean = await formValidation();
		if(fieldErrors) return setLoad(false);

		data.password = password;

		try {
			const result = await fetch(`http://localhost/api/users/recover-account/${token}/${userId}`, {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify(data)
			});

			const response: DataResponse = await result.json();

			if(result.status === 401) {
				setIsValid(false);
				setAlert({error: true, message: response.message});
			}

			if(result.status === 400 || result.status === 404) {
				setPasswordErrorMessage(response.errors.password || '');
				return setLoad(false);
			}

			if(result.status === 200) {
				return setSuccess(true);
			}

		} catch (e) {
			console.error(e);
		}
	}

	return(
		<>
			{ !success &&  <div className='container'>
		  <div className='reset'>
			  <Title />
			  <div className='container-sm'>
				  <p className='page-description'>Reset your password</p>
								{ (!isValid && !isLoading) && <Alerts alerts={alert} /> }
								{ isValid &&  <form className='form' noValidate={true} onSubmit={handleSubmit}>
					<div className='d-fields'>
						<div className={(passwordErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							<label htmlFor='password'>Password:</label>
							<div className='inputs'>
								<input
									id='password'
									type='password'
									placeholder='Type your password'
									className={(passwordErrorMessage.trim() !== '') ? 'field-error' : ''}
									onChange={event => setPassword(event.target.value)}
									disabled={load}
								/>
							</div>
						</div>
											{(passwordErrorMessage.trim() !== '') && <p className={'field-error-message'}>{passwordErrorMessage}</p>}
					</div>

					<div className='d-fields'>
						<div className={(repeatPasswordErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							<label htmlFor='repeatPassword'>Repeat Password:</label>
							<div className='inputs'>
								<input
									id='repeatPassword'
									type='password'
									placeholder='Repeat your password'
									className={(repeatPasswordErrorMessage.trim() !== '') ? 'field-error' : ''}
									onChange={event => setRepeatPassword(event.target.value)}
									disabled={load}
								/>
							</div>
						</div>
											{(repeatPasswordErrorMessage.trim() !== '') && <p className={'field-error-message'}>{repeatPasswordErrorMessage}</p>}
					</div>

					<div className='input-and-loader'>
						<input type={'submit'} value={'Register Account'} disabled={load} />
											{load && <Loader />}
					</div>
				</form>}
			  </div>
		  </div>
	  </div>}
			{ success && <RecoveredMessage /> }
		</>
	);
}


export default ResetPass;

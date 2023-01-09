import React, { useState } from "react";
import {Link} from "react-router-dom";

import './../../styles/Form.css'
import './../../styles/Recover.css'

import Title from "../../components/Title";
import Loader from "../../components/Loader";
import RecoverMessage from "../../components/RecoverMessage";


interface Data {
	email: string | null,
}

interface Errors {
	email: string | null,
}

interface DataResponse {
	data: Data;
	errors: Errors;
	message: string;
}

const Recover = () => {
	const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const data: Data = {
		email: null,
	}

	const [load, setLoad] = useState(false);
	const [success, setSuccess] = useState(false);
	const [email, setEmail] = useState('');
	const [emailErrorMessage, setEmailErrorMessage] = useState('');

	const formValidation = async () => {
		let fieldErrors: boolean = false;

		if(email.trim() === '') {
			fieldErrors = true;
			setEmailErrorMessage('The email can\'t be empty');
		}

		else if(!emailRE.test(email.trim())) {
			fieldErrors = true;
			setEmailErrorMessage('Invalid email format');
		}

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoad(true);

		setEmailErrorMessage('');

		const fieldErrors: boolean = await formValidation();

		if(fieldErrors) return setLoad(false);

		data.email = email;

		try {
			const result = await fetch('http://localhost/api/users/recover-account', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify(data)
			});

			const response: DataResponse = await  result.json();

			if(result.status === 400) {
				setEmailErrorMessage(response.errors.email || '');
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
			{ success && <RecoverMessage /> }
			{ !success && <div className='container'>
		  <div className='recover'>
			  <Title />
			  <div className='container-sm'>
				  <p className='page-description'>Recover your account</p>

				  <form className='form' noValidate={true} onSubmit={handleSubmit}>
					  <div className='d-fields'>
						  <div className={(emailErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							  <label htmlFor='email'>Email:</label>
							  <div className='inputs'>
								  <input
									  id='email'
									  type='email'
									  placeholder='Type your email'
									  value={email}
									  className={(emailErrorMessage.trim() !== '') ? 'field-error' : ''}
									  onChange={event => setEmail(event.target.value)}
									  disabled={load}
								  />
							  </div>
						  </div>
												{(emailErrorMessage.trim() !== '') && <p className={'field-error-message'}>{emailErrorMessage}</p>}
					  </div>

					  <div className='input-and-loader'>
						  <input type="submit" value='Recover Account' disabled={load} />
												{load && <Loader />}
					  </div>
				  </form>

				  <div className='actions'>
					  <Link to={'/'} className='text-start'>Do you already have an account? LogIn</Link>
					  <Link to={'/register'} className='text-end'>You do not have an account? Sign up</Link>
				  </div>
			  </div>
		  </div>
	  </div> }
		</>
	);
}


export default Recover;

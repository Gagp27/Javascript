import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import '../../styles/Form.css';
import '../../styles/Login.css';

import Title from "../../components/Title";
import Loader from "../../components/Loader";


interface Data {
	email: string | null,
	password: string | null,
}

const Login = () => {
	const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const data: Data = {
		email: null,
		password: null
	}

	const [load, setLoad] = useState(false);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [emailErrorMessage, setEmailErrorMessage] = useState('');
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

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

		if(password.trim() === '') {
			fieldErrors = true;
			setPasswordErrorMessage('The password can\'t be empty');
		}

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoad(true);

		setEmailErrorMessage('');
		setPasswordErrorMessage('');

		const fieldErrors: boolean = await  formValidation();

		if(fieldErrors) return setLoad(false);

		data.email = email;
		data.password = password;

		try {
			const result = await fetch('http://localhost/api/users', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': 'http://localhost:3000'
				},
				body: JSON.stringify(data)
			});
			const response = await result.json();

			if(result.status === 400) {
				setEmailErrorMessage(response.errors.email || '');
				setPasswordErrorMessage(response.errors.password || '');
				return setLoad(false);
			}

			if(result.status === 200 && response.data.authenticate) {
				sessionStorage.setItem('up_task_jws', String(response.data.jwt));
				setTimeout(() => {
					window.location.href = '/projects';
				}, 3000);
			}
		} catch (e) {
			console.log(e)
		}
	}

	return(
		<div className='container'>
			<div className='login'>
				<Title />
				<div className='container-sm'>
					<p className='page-description'>Log in into your account</p>

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

						<div className='input-and-loader'>
							<input type="submit" value='Recover Account' disabled={load} />
							{load && <Loader />}
						</div>
					</form>

					<div className='actions'>
						<Link to={'/register'} className='text-start'>You do not have an account? Sign up</Link>
						<Link to={'/recover-account'} className='text-end'>Forgot your password? Recover account</Link>
					</div>
				</div>
			</div>
		</div>
	);
}


export default Login;

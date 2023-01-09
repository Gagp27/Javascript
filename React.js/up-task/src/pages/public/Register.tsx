import React, { useState } from 'react';
import {Link} from "react-router-dom";

import './../../styles/Form.css'
import './../../styles/Register.css'

import Title from '../../components/Title';
import Loader from "../../components/Loader";
import RegisterMessage from "../../components/RegisterMessage";

interface Entity {
	userId: number | null,
	firstName: string | null,
	lastName: string | null,
	userName: string | null,
	email: string | null,
	password: string | null,
	token: string | null,
	confirm: boolean,
	createdAt: Date | null,
	updatedAt: Date | null
}

interface Errors {
	firstName: string | null,
	lastName: string | null,
	userName: string | null,
	email: string | null,
	password: string | null,
}

interface DataResponse {
	data: Entity;
	errors: Errors;
	message: string;
}

const Register = () => {
	const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const user: Entity = {
		userId: null,
		firstName: null,
		lastName: null,
		userName: null,
		email: null,
		password: null,
		token: null,
		confirm: false,
		createdAt: null,
		updatedAt: null,
	}

	const [load, setLoad] = useState(false);
	const [success, setSuccess] = useState(false);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
	const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
	const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
	const [emailErrorMessage, setEmailErrorMessage] = useState('');
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState('');

	const formValidation = async () => {
		let fieldErrors: boolean = false;

		if(firstName.trim() === '') {
			fieldErrors = true;
			setFirstNameErrorMessage('The firstName can\'t be empty');
		}

		if(lastName.trim() === '') {
			fieldErrors = true;
			setLastNameErrorMessage('The lastName can\'t be empty');
		}

		if(userName.trim() === '') {
			fieldErrors = true;
			setUserNameErrorMessage('The userName can\'t be empty');
		}

		if(email.trim() === '') {
			fieldErrors = true;
			setEmailErrorMessage('The email can\'t be empty');
		}

		else if(!emailRE.test(email.trim())) {
			fieldErrors = true;
			setEmailErrorMessage('Invalid email format');
		}

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

		setFirstNameErrorMessage('');
		setLastNameErrorMessage('');
		setUserNameErrorMessage('');
		setEmailErrorMessage('');
		setPasswordErrorMessage('');
		setRepeatPasswordErrorMessage('');

		const fieldErrors: boolean = await formValidation();

		if (fieldErrors) return setLoad(false);

		user.firstName = firstName;
		user.lastName = lastName;
		user.userName = userName;
		user.email = email;
		user.password = password;

		try {
			const result = await fetch('http://localhost/api/users/register', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify(user)
			});
			const response: DataResponse = await result.json();
			const { errors } = response;

			if(result.status === 400) {
				setFirstNameErrorMessage(errors.firstName || '');
				setLastNameErrorMessage(errors.lastName || '');
				setUserNameErrorMessage(errors.userName || '');
				setEmailErrorMessage(errors.email || '');
				setPasswordErrorMessage(errors.password || '');
				return setLoad(false);
			}

			if(result.status === 201) {
				setLoad(false);
				return setSuccess(true);
			}

		} catch (e) {
			console.error(e);
		}
	}

	return (
		<>
			{ !success && <div className='container'>
		  <div className='register'>
			  <Title />
			  <div className='container-sm'>
				  <p className='page-description'>Create an account</p>
				  <form className='form' noValidate={true} onSubmit={handleSubmit}>
					  <div className='d-fields'>
						  <div className={(firstNameErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							  <label htmlFor='firstName'>First Name:</label>
							  <input
								  id='firstName'
								  type='text'
								  placeholder='Type your first name'
								  value={firstName}
								  className={(firstNameErrorMessage.trim() !== '') ? 'field-error' : ''}
								  onChange={event => setFirstName(event.target.value)}
								  disabled={load}
							  />
						  </div>
												{(firstNameErrorMessage.trim() !== '') && <p className={'field-error-message'}>{firstNameErrorMessage}</p>}
					  </div>

					  <div className='d-fields'>
						  <div className={(lastNameErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							  <label htmlFor='lastName'>Last Name:</label>
							  <div className='inputs'>
								  <input
									  id='lastName'
									  type='text'
									  placeholder='Type your last name'
									  value={lastName}
									  className={(lastNameErrorMessage.trim() !== '') ? 'field-error' : ''}
									  onChange={event => setLastName(event.target.value)}
									  disabled={load}
								  />
							  </div>
						  </div>
						{(lastNameErrorMessage.trim() !== '') && <p className={'field-error-message'}>{lastNameErrorMessage}</p>}
					  </div>

					  <div className='d-fields'>
						  <div className={(userNameErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							  <label htmlFor='userName'>User Name:</label>
							  <div className='inputs'>
								  <input
									  id='userName'
									  type='text'
									  placeholder='Type your user name'
									  value={userName}
									  className={(userNameErrorMessage.trim() !== '') ? 'field-error' : ''}
									  onChange={event => setUserName(event.target.value)}
									  disabled={load}
								  />
							  </div>
						  </div>
							{(userNameErrorMessage.trim() !== '') && <p className={'field-error-message'}>{userNameErrorMessage}</p>}
					  </div>

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
				  </form>

				  <div className='actions'>
					  <Link to={'/'} className='text-start'>Do you already have an account? LogIn</Link>
					  <Link to={'/recover-account'} className='text-end'>Forgot your password? Recover account</Link>
				  </div>
			  </div>
		  </div>
	  </div> }
			{ success && <RegisterMessage /> }
		</>
	);
}

export default Register;

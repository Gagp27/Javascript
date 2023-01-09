import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Alerts from "../../components/Alerts";

type Props = {
	page: string,
}

interface Data {
	firstName: string | null;
	lastName: string | null;
	userName: string | null;
	email: string | null;
}

interface Errors {
	firstName: string | null;
	lastName: string | null;
	userName: string | null;
	email: string | null;
}

interface DataResponse {
	data: Data | null;
	errors: Errors;
	message: string;
}

const Profile: React.FC<Props> = ({page}) => {

	const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	//@ts-ignore
	const { auth, setAuth, updateProfile, isLoading } = useAuth();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
		if(isLoading) return;

		setFirstName(auth.firstName);
		setLastName(auth.lastName);
		setUserName(auth.userName);
		setEmail(auth.email);

	}, [isLoading, auth]);


	const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
	const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
	const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
	const [emailErrorMessage, setEmailErrorMessage] = useState('');

	const [load, setLoad] = useState(false);

	const [showAlert, setShowAlert] = useState(false);
	const [alert, setAlert] = useState({error: false, message: ''});

	const data: Data = {
		email: null,
		firstName: null,
		lastName: null,
		userName: null
	}

	const formValidation = async () => {
		let fieldErrors = false;

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

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoad(true);

		setFirstNameErrorMessage('');
		setLastNameErrorMessage('');
		setUserNameErrorMessage('');
		setEmailErrorMessage('');

		const fieldErrors = await formValidation();

		if(fieldErrors) return setLoad(false);

		data.firstName = firstName;
		data.lastName = lastName;
		data.userName = userName;
		data.email = email;

		const result = await updateProfile(data);
		const response: DataResponse = await result.json();

		if(result.status === 400) {
			setFirstNameErrorMessage(response.errors.firstName || '');
			setLastNameErrorMessage(response.errors.lastName || '');
			setUserNameErrorMessage(response.errors.userName || '');
			setEmailErrorMessage(response.errors.email || '');
			return setLoad(false);
		}

		if(result.status === 200) {
			setAuth(response.data);
			setAlert({error: false, message: response.message});
			setLoad(false);
			return setShowAlert(true);
		}
	}

	return(
		<DashboardLayout page={page}>
			<>
				<h2 className='page-name'>My Profile</h2>
				<div className='container-sm'>
					<form className='form' noValidate={true} onSubmit={handleSubmit}>

						{ showAlert && <Alerts alerts={alert} /> }

						<div className='d-fields'>
							<div className={(firstNameErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
								<label htmlFor='firstName'>First Name:</label>
								<div className='inputs'>
									<input
										id='firstName'
										type='text'
										placeholder='Type your firstName name'
										value={firstName}
										className={(firstNameErrorMessage.trim() !== '') ? 'field-error' : ''}
										onChange={event => setFirstName(event.target.value)}
										disabled={load}
									/>
								</div>
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
										placeholder='Type your lastName name'
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
										placeholder='Type your userName name'
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
										placeholder='Type your email name'
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
							<input type="submit" value='Update Profile' disabled={load} />
							{load && <Loader />}
						</div>
					</form>
				</div>
			</>
		</DashboardLayout>
	);
}

export default Profile;

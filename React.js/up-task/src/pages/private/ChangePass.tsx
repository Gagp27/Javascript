import React, {useState} from 'react';
import DashboardLayout from "../../layout/DashboardLayout";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Alerts from "../../components/Alerts";

type Props = {
	page: string;
}

interface Data {
	currentPassword: string | null;
	newPassword: string | null;
}

interface Errors {
	currentPassword: string | null;
	newPassword: string | null;
}

interface DataResponse {
	data: Object;
	errors: Errors;
	message: string;
}

const ChangePass: React.FC<Props> = ({page}) => {

	//@ts-ignore
	const { changePassword } = useAuth();

	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] = useState('');
	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
	const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState('');

	const [load, setLoad] = useState(false);

	const [showAlert, setShowAlert] = useState(false);
	const [alert, setAlert] = useState({error: false, message: ''});


	const data: Data = {
		currentPassword: null,
		newPassword: null
	}

	const formValidate = async () => {
		let fieldErrors = false;

		if(currentPassword.trim() === '') {
			fieldErrors = true;
			setCurrentPasswordErrorMessage('The password can\'t be empty');
		}

		if(newPassword.trim() === '') {
			fieldErrors = true;
			setNewPasswordErrorMessage('The password can\'t be empty');
		}

		if(repeatPassword.trim() === '') {
			fieldErrors = true;
			setRepeatPasswordErrorMessage('The password can\'t be empty');
		}

		else if(newPassword.trim().length < 8) {
			fieldErrors = true;
			setNewPasswordErrorMessage('Password min length 8 characters');
		}

		else if(newPassword.trim() !== repeatPassword.trim()) {
			fieldErrors = true;
			setNewPasswordErrorMessage('The passwords must be equals');
			setRepeatPasswordErrorMessage('The passwords must be equals');
		}

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoad(true);

		setCurrentPasswordErrorMessage('');
		setNewPasswordErrorMessage('');
		setRepeatPasswordErrorMessage('');

		const fieldErrors = await formValidate();

		if(fieldErrors) return setLoad(false);

		data.currentPassword = currentPassword;
		data.newPassword = newPassword;

		const result = await changePassword(data);
		const response: DataResponse = await result.json();

		if(result.status === 400) {
			setCurrentPasswordErrorMessage(response.errors.currentPassword || '');
			setNewPasswordErrorMessage(response.errors.newPassword || '');
			return setLoad(false);
		}

		if(result.status === 200) {
			setCurrentPassword('');
			setNewPassword('');
			setRepeatPassword('');
			setAlert({error: false, message: response.message});
			setLoad(false);
			return setShowAlert(true);
		}
	}

	return(
		<DashboardLayout page={page}>
			<>
				<h2 className='page-name'>Change Password</h2>
				<div className='container-sm'>
					<form className='form' noValidate={true} onSubmit={handleSubmit}>

						{ showAlert && <Alerts alerts={alert} /> }

						<div className='d-fields'>
							<div className={(currentPasswordErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
								<label htmlFor='currentPassword'>Current Password:</label>
								<div className='inputs'>
									<input
										id='currentPassword'
										type='password'
										placeholder='Type your current password'
										value={currentPassword}
										className={(currentPasswordErrorMessage.trim() !== '') ? 'field-error' : ''}
										onChange={event => setCurrentPassword(event.target.value)}
										disabled={load}
									/>
								</div>
							</div>
							{(currentPasswordErrorMessage.trim() !== '') && <p className={'field-error-message'}>{currentPasswordErrorMessage}</p>}
						</div>

						<div className='d-fields'>
							<div className={(newPasswordErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
								<label htmlFor='newPassword'>New Password:</label>
								<div className='inputs'>
									<input
										id='newPassword'
										type='password'
										placeholder='Type your new password'
										value={newPassword}
										className={(newPasswordErrorMessage.trim() !== '') ? 'field-error' : ''}
										onChange={event => setNewPassword(event.target.value)}
										disabled={load}
									/>
								</div>
							</div>
							{(newPasswordErrorMessage.trim() !== '') && <p className={'field-error-message'}>{newPasswordErrorMessage}</p>}
						</div>

						<div className='d-fields'>
							<div className={(repeatPasswordErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
								<label htmlFor='repeatPassword'>Repeat Password:</label>
								<div className='inputs'>
									<input
										id='repeatPassword'
										type='password'
										placeholder='Repeat your new password'
										value={repeatPassword}
										className={(repeatPasswordErrorMessage.trim() !== '') ? 'field-error' : ''}
										onChange={event => setRepeatPassword(event.target.value)}
										disabled={load}
									/>
								</div>
							</div>
							{(repeatPasswordErrorMessage.trim() !== '') && <p className={'field-error-message'}>{repeatPasswordErrorMessage}</p>}
						</div>

						<div className='input-and-loader'>
							<input type={'submit'} value={'Change Password'} disabled={load} />
							{load && <Loader />}
						</div>
					</form>
				</div>
			</>
		</DashboardLayout>
	)
}

export default ChangePass;

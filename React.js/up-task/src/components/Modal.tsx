import React, {useState} from 'react';
import Loader from "./Loader";
import useProjects from "../hooks/useProjects";
import {useParams} from "react-router-dom";
import Alerts from "./Alerts";

type Props = {
	title: string;
	setShowModal: Function;

	data: {
		taskId: number,
		taskName: string
	}
}

const Modal: React.FC<Props> = ({ title, setShowModal, data }) => {
	//@ts-ignore
	const { processToCreateAndUpdate } = useProjects();
	const [taskName, setTaskName] = useState(data.taskName);
	const [taskNameErrorMessage, setTaskNameErrorMessage] = useState('');
	const [load, setLoad] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [alert, setAlert] = useState({error: false, message: ''});
	const { slug } = useParams();

	const formValidation = async () => {
		let fieldErrors: boolean = false;

		if(taskName.trim() === '') {
			fieldErrors = true;
			setTaskNameErrorMessage('The taskName can\'t be empty');
		}

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault();

		setLoad(true);

		setTaskNameErrorMessage('');

		const fieldErrors: boolean = await formValidation();

		if(fieldErrors) return setLoad(false);

		data.taskName = taskName;

		const result = await processToCreateAndUpdate(slug, data);
		const response = await result.json();

		console.log(response);

		if(result.status === 400) {
			setTaskNameErrorMessage(response.errors.taskName || '');
			return setLoad(false);
		}

		if(result.status === 201 || result.status === 200) {
			window.location.reload();
		}

		console.log(result);
		console.log(response);
	}


	return (
		<>
			<div className='modal'>
				<form className='form new-task animate' id='modal' onSubmit={handleSubmit}>
					<legend>{title}</legend>

					{ showAlert && <Alerts alerts={alert} /> }

					<div className='d-fields'>
						<div className={(taskNameErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
							<label htmlFor='projectName'>Project Name:</label>
							<div className='inputs'>
								<input
									id='projectName'
									type='text'
									placeholder='Type your project name'
									value={taskName}
									className={(taskNameErrorMessage.trim() !== '') ? 'field-error' : ''}
									onChange={event => setTaskName(event.target.value)}
									disabled={load}
								/>
							</div>
						</div>
						{(taskNameErrorMessage.trim() !== '') && <p className={'field-error-message'}>{taskNameErrorMessage}</p>}
					</div>

					<div className='options'>
						<div className='input-and-loader'>
							<input type="submit" value='Save' disabled={load} />
							{load && <Loader />}
						</div>
						<button className='close-modal' type='button' onClick={() => setShowModal(false)}>Cancel</button>
					</div>
				</form>
			</div>
		</>
	);
}

export default Modal;

import React, { FormEvent, useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Loader from "../../components/Loader";

import '../../styles/Form.css';
import '../../styles/Dashboard.css';
import useProjects from "../../hooks/useProjects";

type Props = {
	page: string,
}

interface Data {
	projectName: string | null,
}

interface DataResponse {
	data: Object;
	errors: Errors;
	message: string;
}

interface Errors {
	projectName: string | null
}

const Create: React.FC<Props> = ({page}) => {

	//@ts-ignore
	const { createProject } = useProjects();
	const [load, setLoad] = useState(false);
	const [projectName, setProjectName] = useState('');
	const [projectNameErrorMessage, setProjectNameErrorMessage] = useState('');
	const data: Data = {
		projectName: null
	}


	const formValidation = async () => {
	  let fieldErrors: boolean = false;

		if(projectName.trim() === '') {
			fieldErrors = true;
			setProjectNameErrorMessage('The project name can\'t be empty');
		}

		return fieldErrors;
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setLoad(true);

		setProjectNameErrorMessage('');

		const fieldErrors: boolean = await formValidation();

		if(fieldErrors) return setLoad(false);

		data.projectName = projectName;

		const result = await createProject(data);
		const response: DataResponse = await result.json();

		if(result.status === 400) {
			setProjectNameErrorMessage(response.errors.projectName || '');
			return setLoad(false);
		}

		if(result.status === 201) {
			//@ts-ignore
			const { slug } = response.data;
			window.location.href = `/projects/${slug}`;
		}
	}

	return(
		<DashboardLayout page={page} >
			<>
				<h2 className='page-name'>Create Project</h2>
				<div className='container-sm'>
					<form className='form' noValidate={true} onSubmit={handleSubmit}>
						<div className='d-fields'>
							<div className={(projectNameErrorMessage.trim() !== '') ? 'field field-error-label mb-1' : 'field mb-2'}>
								<label htmlFor='projectName'>Project Name:</label>
								<div className='inputs'>
									<input
										id='projectName'
										type='text'
										placeholder='Type your project name'
										value={projectName}
										className={(projectNameErrorMessage.trim() !== '') ? 'field-error' : ''}
										onChange={event => setProjectName(event.target.value)}
										disabled={load}
									/>
								</div>
							</div>
							{(projectNameErrorMessage.trim() !== '') && <p className={'field-error-message'}>{projectNameErrorMessage}</p>}
						</div>
						<div className='input-and-loader'>
							<input type="submit" value='Create Project' disabled={load} />
							{load && <Loader />}
						</div>
					</form>
				</div>
			</>
		</DashboardLayout>
	);
}

export default Create;

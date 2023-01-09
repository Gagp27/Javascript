import React, {createContext, ReactElement, useEffect, useState} from "react";

type Props = {
	children: ReactElement
}

type Data = {
	projectName: string;
}

const ProjectContext = createContext({});

const ProjectProvider: React.FC<Props> = ({children}) => {

	const [projects, setProjects] = useState({});

	useEffect(() => {
		const token = sessionStorage.getItem('up_task_jws');
		if(!token) return;

		console.log(token);

		const getProjects = async () => {
			try {
				const result = await fetch('http://localhost/api/projects', {
					method: 'get',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
						'Access-Control-Allow-Origin': 'http://localhost:3000'
					}
				});
				const response = await result.json();
				setProjects(response.data);

			} catch (e) {
				setProjects({});
				return console.log(e);
			}
		}

		getProjects();
	}, []);

	const createProject = async (data: Data) => {
		const token = sessionStorage.getItem('up_task_jws');

		try {
			return await fetch('http://localhost/api/projects', {
				method: 'post',
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

	const getTasks = async (slug: string) => {
		const token = sessionStorage.getItem('up_task_jws');

		try {
			return await fetch(`http://localhost/api/tasks/${slug}`, {
				method: 'get',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'Access-Control-Allow-Origin': 'http://localhost:3000'
				},
			});
		} catch (e) {
			console.log(e);
		}
	}

	const processToCreateAndUpdate = async (slug: string, data: {taskId: number, taskName: string}) => {
		const token = sessionStorage.getItem('up_task_jws');

		try {
			if(data.taskId === 0) {
				return await fetch(`http://localhost/api/tasks/${slug}`, {
					method: 'post',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
						'Access-Control-Allow-Origin': '*'
					},
					body: JSON.stringify(data)
				});
			}

			return await fetch(`http://localhost/api/tasks/${slug}/${data.taskId}`, {
				method: 'put',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'Access-Control-Allow-Origin': 'http://127.0.0.1:3000'
				},
				body: JSON.stringify(data)
			});

		} catch (e) {
			console.log(e);
		}
	}

	const changeStatus = async (slug: string, taskId: number) => {
		const token = sessionStorage.getItem('up_task_jws');

		try {
			return await fetch(`http://localhost/api/tasks/state/${slug}/${taskId}`, {
				method: 'put',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				},
			});

		} catch (e) {
			console.log(e);
		}
	}

	const deleteTask = async (slug: string, taskId: number) => {
		const token = sessionStorage.getItem('up_task_jws');

		try {
			return await fetch(`http://localhost/api/tasks/${slug}/${taskId}`, {
				method: 'delete',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				},
			});

		} catch (e) {
			console.log(e);
		}
	}

	return(
		<ProjectContext.Provider value={{
			projects,
			createProject,
			getTasks,
			processToCreateAndUpdate,
			changeStatus,
			deleteTask
		}}>
			{children}
		</ProjectContext.Provider>
	);
}


export { ProjectProvider };
export default ProjectContext;

import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import DashboardLayout from "../../layout/DashboardLayout";
import Modal from "../../components/Modal";
import Task from "../../components/Task";

const Tasks = () => {

	const { slug } = useParams();

	//@ts-ignore
	const { getTasks } = useProjects();
	const [projectName, setProjectName] = useState('');
	const [projectId, setProjectId] = useState('');
	const [tasks, setTasks] = useState([]);
	const [listTask, setListTask] = useState([]);
	const [taskId, setTaskId] = useState(0);
	const [taskName, setTaskName] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('');

	useEffect(() => {
		const dataHandler = async () => {
			const result = await getTasks(slug);
			const response = await result.json();
			setProjectName(response.data.project.projectName);
			setProjectId(response.data.project.projectId);
			setTasks(response.data.tasks);
			setListTask(response.data.tasks);
		}
		dataHandler().then(r => {});
	}, [getTasks, slug]);

	const createHandler = () => {
		setTaskId(0);
		setTaskName('');
		setModalTitle('Create Task');
		setShowModal(true);
	}

	const updateHandler = (taskId: number, taskName: string) => {
		setTaskId(taskId);
		setTaskName(taskName);
		setModalTitle('Update Task');
		setShowModal(true);
	}

	const filterHandler = (action: string) => {
		if(action === 'pending') {
			//@ts-ignore
			setListTask([...tasks].filter(task => task.state == 0));
		}

		else if(action === 'completed') {
			//@ts-ignore
			setListTask([...tasks].filter(task => task.state == 1));
		}

		else {
			setListTask([...tasks]);
		}
	}

  return(
		<DashboardLayout page={''}>
			<>
				<h2 className='page-name'>{projectName}</h2>
				<div className='container-sm'>

					<div className='new-task-container'>
						<button className='add-task' id='add-task' type='button' onClick={createHandler}>New Task</button>
					</div>

					<div className='filter' id='filter'>
						<div className='filter-input'>
							<h2>Filters: </h2>
							<div className='field'>
								<label htmlFor="all">All</label>
								<input type="radio" id='all' name='filter' value='' defaultChecked={true} onClick={() => filterHandler('all')} />
							</div>

							<div className='field'>
								<label htmlFor="pending">Pending</label>
								<input type="radio" id='pending' name='filter' value='0' onClick={() => filterHandler('pending')} />
							</div>

							<div className='field'>
								<label htmlFor="completed">Completed</label>
								<input type="radio" id='completed' name='filter' value='1' onClick={() => filterHandler('completed')} />
							</div>
						</div>
					</div>

					<ul className='task-list' id='task-list'>
						{//@ts-ignore
							listTask.length > 0 ? (listTask.map(task => ( <Task key={task.taskId} data={task} updateHandler={updateHandler} /> ))) : (<p className='no-task'>There are no tasks to display</p>)
						}
					</ul>
				</div>

				{ showModal && <Modal title={ modalTitle } data={ { taskId: taskId, taskName: taskName } } setShowModal={ setShowModal } /> }
			</>
		</DashboardLayout>
	);
}

export default Tasks;

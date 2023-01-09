import React from "react";
import useProjects from "../hooks/useProjects";
import {useParams} from "react-router-dom";

type Props = {
	data: {
		taskId: number,
		taskName: string,
		state: boolean,
	},

	updateHandler: Function
}

const Task: React.FC<Props> = ({data, updateHandler}) => {
	//@ts-ignore
	const { deleteTask, changeStatus } = useProjects();
	const { slug } = useParams();

	const processToDelete = async () => {
		const result = await deleteTask(slug, data.taskId);
		if(result.status === 200) {
			window.location.reload();
		}
	}

	const processToChangeStatus = async () => {
		const result = await changeStatus(slug, data.taskId);
		if(result.status === 200) {
			window.location.reload();
		}
	}

	return(
			<li className='task' data-task-id={data.taskId}>
				<p onClick={() => updateHandler(data.taskId, data.taskName)} >{data.taskName}</p>
				<div className="options">
					<button className={data.state ? 'success' : 'pending'} onClick={processToChangeStatus} >{data.state ? 'Completed' : 'Pending'}</button>
					<button className="delete-task" type='button' onClick={processToDelete}>Delete</button>
				</div>
			</li>
	)
}

export default Task;

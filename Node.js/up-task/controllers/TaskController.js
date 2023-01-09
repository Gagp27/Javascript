import Project from "../models/Project.js";
import Task from "../models/Task.js";
import {tasksValidations} from "../helpers/validations/tasksValidations.js";


const getAllTasks = async (req, res) => {
	const { slug } = req.params;

	try {
		const project = await projectAuthorization(req, res, slug);
		if(project.isError) {
			const { status, data, errors, message } = project;
			return res.status(status).json({ data: data, errors: errors, message: message });
		}

		const tasks = await Task.findAll({ where: { projectId: project.projectId } });
		return res.status(200).json({ data: {project, tasks}, errors: null, message: "Find project and tasks successfully" });

	} catch (e) {
		return res.status(500).json({data: null, errors: "Internal server error", message: e.message });
	}
}

const getTask = async (req, res) => {
	const { slug, taskId } = req.params;

	try {
		const project = await projectAuthorization(req, res, slug);
		if(project.isError) {
			const { status, data, errors, message } = project;
			return res.status(status).json({ data: data, errors: errors, message: message });
		}

		const task = await Task.findOne({ where: { taskId } })

		if(!task) {
			return res.status(404).json({ data: null, errors: "Not found", message: `Not found the task with id ${taskId}`});
		}

		if(parseInt(projectId) !== parseInt(task.projectId)) {
			return res.status(401).json({ data: null, errors: "Access denied", message: `The task with id ${taskId} does not belong to project with id ${projectId}` });
		}

		return res.status(200).json({ data: task, errors: null, message: "Find task successfully" });

	} catch (e) {
		return res.status(500).json({ data: null, errors: "Internal server error", message: e.message });
	}
}

const createTask = async (req, res) => {
	const { slug } = req.params;
	const data = { taskName: req.body.taskName };
	const errors = { taskName: null };

	tasksValidations(data, errors);
	if(errors.taskName !== null) {
		return res.status(400).json({ data: data, errors: errors, message: "Failed validation" });
	}

	try {
		const project = await projectAuthorization(req, res, slug);
		if(project.isError) {
			const { status, data, errors, message } = project;
			return res.status(status).json({ data: data, errors: errors, message: message });
		}

		const task = new Task();
		task.taskName = data.taskName;
		task.state = false;
		task.projectId = project.projectId;

		const taskSaved = await task.save();
		return res.status(201).json({ data: taskSaved, errors: null, message: "Task created successfully" });

	} catch (e) {
		return res.status(500).json({ data: null, errors: "Internal server error", message: e.message });
	}
}

const updateTask = async (req, res) => {
	const { slug, taskId } = req.params;
	const data = { taskName: req.body.taskName };
	const errors = { taskName: null };
	let isUpdate = false;

	tasksValidations(data, errors);
	if(errors.taskName !== null) {
		return res.status(400).json({ data: data, errors: errors, message: "Failed validation" });
	}

	try {
		const project = await projectAuthorization(req, res, slug);
		if(project.isError) {
			const { status, data, errors, message } = project;
			return res.status(status).json({ data: data, errors: errors, message: message });
		}

		const task = await Task.findByPk(taskId);

		if(!task) {
			return res.status(404).json({ data: null, errors: "Not found", message: `Not found the task with id ${taskId}`});
		}

		if(task.projectId !== parseInt(project.projectId)) {
			return res.status(401).json({ data: null, errors: "Access denied", message: `The task with id ${taskId} does not belong to project with id ${project.projectId}` });
		}

		if(task.taskName !== data.taskName) {
			task.taskName = data.taskName;
			isUpdate = true;
		}

		if(!isUpdate) {
			return res.status(200).json({ data: task, errors: null, message: "Task updated successfully, no changes" });
		}

		const taskSaved = await task.save();
		return res.status(200).json({ data: taskSaved, errors: null, message: "Task updated successfully" });

	} catch (e) {
		return res.status(500).json({ data: null, errors: "Internal server error", message: e.message });
	}
}

const updateStateTask = async (req, res) => {
	const { slug, taskId } = req.params;

	try {
		const project = await projectAuthorization(req, res, slug);
		if(project.isError) {
			const { status, data, errors, message } = project;
			return res.status(status).json({ data: data, errors: errors, message: message });
		}

		const task = await Task.findByPk(taskId);

		if(!task) {
			return res.status(404).json({ data: null, errors: "Not found", message: `Not found the task with id ${taskId}`});
		}

		if(task.projectId !== parseInt(project.projectId)) {
			return res.status(401).json({ data: null, errors: "Access denied", message: `The task with id ${taskId} does not belong to project with id ${project.projectId}` });
		}

		task.state = !task.state;
		const taskSaved = await task.save();
		return res.status(200).json({ data: taskSaved, errors: null, message: "Task updated successfully" });

	} catch (e) {
		return res.status(500).json({ data: null, errors: "Internal server error", message: e.message });
	}
}

const deleteTask = async (req, res) => {
	const { slug, taskId } = req.params;


	try {
		console.log(taskId, slug);
		const project = await projectAuthorization(req, res, slug);
		if(project.isError) {
			const { status, data, errors, message } = project;
			return res.status(status).json({ data: data, errors: errors, message: message });
		}

		const task = await Task.findByPk(taskId);

		if(!task) {
			return res.status(404).json({ data: null, errors: "Not found", message: `Not found the task with id ${taskId}`});
		}

		if(task.projectId !== parseInt(project.projectId)) {
			return res.status(401).json({ data: null, errors: "Access denied", message: `The task with id ${project.projectId} does not belong to project with id ${project.projectId}` });
		}

		await task.destroy();
		return res.status(200).json({ data: null, errors: null, message: "Task deleted successfully" });

	} catch (e) {
		return res.status(500).json({ data: null, errors: "Internal server errors", message: e.message });
	}

}

const projectAuthorization = async (req, res, slug) => {
	const { userId } = req.user;
	let isError = false;

	try {
		const project = await Project.findOne({ where: {slug } });
		if(!project) {
			const data = null;
			const errors = "Not found";
			const message = `Not found the project with id: ${slug}`;
			const status = 404;
			isError = true;
			return {isError, status, data, errors, message};
		}

		if(project.userId !== userId) {
			const data = null;
			const errors = "Access denied";
			const message = `You are not owner of the project with id ${slug}`;
			const status = 401;
			isError = true;
			return {isError, status, data, errors, message};
		}

		return project;

	} catch (e) {
		const data = null;
		const errors = "Internal server error";
		const message = e.message;
		const status = 500;
		isError = true;
		return {isError, status, data, errors, message};
	}
}

export {
	getAllTasks,
	getTask,
	createTask,
	updateTask,
	updateStateTask,
	deleteTask
}

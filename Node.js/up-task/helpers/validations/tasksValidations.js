export function tasksValidations(data, errors) {

	const { taskName } = data;

	if(taskName === undefined || taskName === null) {
		data.taskName = null;
		errors.taskName = "The taskName can't be empty";
	}

	else if(taskName.trim() === "") {
		errors.taskName = "The taskName can't be empty";
	}
}

export function projectsValidations(data, errors) {

	const { projectName } = data;

	if(projectName === undefined || projectName === null) {
		data.projectName = null;
		errors.projectName = "The projectName can't be empty";
	}

	else if(projectName.trim() === "") {
		errors.projectName = "The projectName can't be empty";
	}
}

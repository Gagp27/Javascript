const validUpdateAndReplace = (actualValue: string, newValue: string) => {
	if(actualValue !== newValue) {
		return {isUpdate: true, value: newValue};
	}

	return {isUpdate: false, value: actualValue};
}

export default validUpdateAndReplace;

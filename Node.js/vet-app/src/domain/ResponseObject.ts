class ResponseObject {
	protected data: Object | null;
	protected errors: Object | null;
	protected message: string;

	constructor(data: Object | null, errors: Object | null, message: string) {
		this.data = data;
		this.errors = errors;
		this.message = message;
	}
}

export default ResponseObject;

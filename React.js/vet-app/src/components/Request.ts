class Request {
	protected static backend: String = "http://localhost:8080";
	protected static contentType: String = "application/json";

	static requestHandler = async (path: string, method: string, body: Object, jwt: string | null) => {
		return await fetch(`${(this.backend)}/${path}`, {
			method: method,
			mode: "cors",
			headers: {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Content-Type": "application/json",
				"Authorization": `Bearer ${jwt}`
			},
			body: JSON.stringify(body)
		});
	}

	static requestNoBodyHandler = async (path: string, method: string, jwt: string | null) => {
		return await fetch(`${(this.backend)}/${path}`, {
			method: method,
				mode: "cors",
				headers: {
					"Access-Control-Allow-Origin": "http://localhost:3000",
					"Content-Type": "application/json",
					"Authorization": `Bearer ${jwt}`
			}
		});
	}
}

export default Request;

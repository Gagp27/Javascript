export interface IVeterinary {
	id: string,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	confirm: boolean,
	token: string | null,
	createdAt: Date,
	updatedAt: Date
}

export interface RegisterRequestObject {
	firstName: string,
	lastName: string,
	email: string,
	password: string,
}

export interface AuthenticateRequestObject {
	email: string,
	password: string,
}

export interface ProfileRequestObject {
	firstName: string,
	lastName: string,
	email: string,
}

export interface AuthenticateResponseObject {

}

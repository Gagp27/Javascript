export interface IPatient {
	id: string,
	name: string,
	owner: string,
	email: string,
	phone: string,
	date: string,
	symptoms: string,
	veterinaryId: string
	createdAt: Date,
	updatedAt: Date
}

export interface PatientRequestObject {
	name: string,
	owner: string,
	email: string,
	phone: string,
	date: string,
	symptoms: string,
}

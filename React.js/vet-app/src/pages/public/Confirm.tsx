import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import Request from "../../components/Request";

const Confirm = () => {

	const { token } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [isConfirmed, setIsConfirmed] = useState(false);


	useEffect(() => {
		const handler = async () => {
			const result = await Request.requestNoBodyHandler(`api/veterinary/confirm/${token}`, "get", null);
			const response = await result.json();
			console.log(response);

			if(result.status === 404) {
				setIsConfirmed(false);
				return setIsLoading(false);
			}

			if(result.status === 200) {
				setIsConfirmed(true);
				return setIsLoading(false);
			}
		}

		handler().then();
	}, [token]);


	return(
		<>
			<div>
				<h1 className="text-indigo-600 text-center md:text-start font-black text-6xl">Confirm your Account and Start Managing {""} <span className={"text-neutral-900"}>your patients</span></h1>
			</div>

			<div className={"mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white"}>
				{
					(!isConfirmed) ?
						(
							<p className="text-center text-gray-500 text-3xl">The token is invalid or has already expired</p>
						) : (
						<>
							<p className="text-center text-gray-500 text-3xl mb-14">Your account has been confirmed, now you can login</p>
							<Link to="/" className="uppercase bg-indigo-700 px-16 py-4 text-white font-bold text-lg rounded-lg w-full block text-center lg:w-auto lg:inline-block">LogIn</Link>
						</>
					)
				}
			</div>
		</>
	);
};

export default Confirm;

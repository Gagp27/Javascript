import React from 'react';
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Header = () => {

	//@ts-ignore
	const { logOut } = useAuth();


	return (
		<header className="py-10 px-10 bg-indigo-600">
			<div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
				<h1 className="font-bold text-2xl text-indigo-200 text-center">
					Veterinary Patient {""}{" "}
					<span className="text-white">Manager</span>
				</h1>

				<nav className="flex flex-col lg:flex-row gap-4 mt-5 lg:mt-0 text-center">
					<Link to="/admin" className="text-white uppercase font-bold text-sm">Patients</Link>
					<Link to="/profile" className="text-white uppercase font-bold text-sm">Profile</Link>

					<button
						type="button"
						className="text-white text-sm uppercase font-bold"
						onClick={logOut}>LogOut</button>
				</nav>
			</div>
		</header>
	);
}

export default Header;

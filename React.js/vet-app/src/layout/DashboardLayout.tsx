import React, {ReactElement} from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import {Navigate} from "react-router-dom";

type Props = {
	children: ReactElement
}

//@ts-ignore
const DashboardLayout: React.FC<Props> = ({children}) => {

	//@ts-ignore
	const { auth, isLoading } = useAuth();
	if(isLoading) return;

	return (
		<> { (!isLoading && auth.auth) ? (
			<>
				<Header/>
				<main className="container px-2 lg:px-10 mx-auto mt-20">
					{children}
				</main>
				<Footer/>
			</>
		) :
			<Navigate to="/" />
		}</>
	);
}

export default DashboardLayout;

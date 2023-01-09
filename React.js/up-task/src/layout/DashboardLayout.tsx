import React, {ReactElement, useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";
import Bar from "../components/Bar";
import useAuth from "../hooks/useAuth";
import {Navigate} from "react-router-dom";

type Props = {
	children: ReactElement,
	page: string,
}

interface Profile {
	userId: number | null,
	firstName: string | null,
	lastName: string | null,
	userName: string | null,
	email: string | null
}

// @ts-ignore
const DashboardLayout: React.FC<Props> = ({children, page}) => {

	// @ts-ignore
	const { auth, isLoading } = useAuth();
	if(isLoading) return;

	return(
		<>{ (!isLoading && auth.userId) ? (
			<div className='dashboard'>
				<Sidebar page={page} />
				<div className='principal'>
					<Bar authData={'Gabriel Alejandro'} />
					<div className='content'>
						{children}
					</div>
				</div>
			</div>
		) :
			<Navigate to='/' />
		}</>
	)
}


export default DashboardLayout;

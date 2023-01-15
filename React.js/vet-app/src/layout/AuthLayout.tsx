import React from 'react';
import {Outlet} from "react-router-dom";

const AuthLayout: React.FunctionComponent = () => (
	<main className='container p-5 lg:p-20 mx-auto md:grid md:grid-cols-2 gap-12 items-center'>
		<Outlet />
	</main>
);

export default AuthLayout;

import React from "react";
import {Link} from "react-router-dom";

import Title from "./Title";


const RecoveredMessage = () => {
	return(
		<div className='container'>
			<div className={'messages'}>
				<Title />
				<div className={'container-sm'}>
					<p className={'page-description'}>Your password has been changed, now you can LogIn</p>
					<Link to='/' className='button'>Login</Link>
				</div>
			</div>
		</div>
	);
}


export default RecoveredMessage;

import React, {ReactElement} from "react";
import useAuth from "../hooks/useAuth";

type Props = {
	authData: string,
}

const Bar: React.FC<Props> = ({authData}) => {

	//@ts-ignore
	const { logOut } = useAuth();

	const show = () => {
		const sidebar = document.getElementById('sidebar');
		//@ts-ignore
		sidebar.classList.add('show');
	}

	return(
		<>
			<div className='mobile-bar'>
				<h1>UpTask</h1>

				<div className='menu'>
					<img src="/menu.svg" alt="menu icon" onClick={show}/>
				</div>
			</div>

			<div className='bar'>
				<p>Hola: {authData}</p>
				<button type='button' className='logOut' onClick={logOut}>LogOut</button>
			</div>
		</>
	);
}


export default Bar;

import { Link } from 'react-router-dom';
import React from 'react';
import useAuth from "../hooks/useAuth";

type Props = {
	page: string
}
const Sidebar: React.FC<Props> = ({page}) => {

	//@ts-ignore
	const { logOut } = useAuth();

	const closeMenu = () => {
	  const sidebar = document.getElementById('sidebar');
		//@ts-ignore
		sidebar.classList.remove('show');
	}

	return(
		<aside className='sidebar' id='sidebar'>
			<div className='sidebar-container'>
				<h2>UpTask</h2>
				<div className='close-menu'>
					<img src="/close.svg" alt="close menu icon" id="close-menu" onClick={closeMenu}/>
				</div>
			</div>

			<nav className='sidebar-nav'>
				<Link to='/projects' className={(page === 'index') ? 'enabled' : ''}>Projects</Link>
				<Link to='/projects/new' className={(page === 'create') ? 'enabled' : ''}>Create Project</Link>
				<Link to='/profile' className={(page === 'profile') ? 'enabled' : ''}>My Profile</Link>
				<Link to='/change-password' className={(page === 'change') ? 'enabled' : ''}>Change Password</Link>
			</nav>

			<div className='logOut-mobile'>
				<button type='button' className='logOut' onClick={logOut}>LogOut</button>
			</div>
		</aside>
	)
}

export default Sidebar;

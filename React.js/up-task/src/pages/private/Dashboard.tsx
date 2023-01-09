import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import useProjects from "../../hooks/useProjects";
import {Link} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type Props = {
	page: string,
}

type Project = {
	projectId: number,
	projectName: string,
	slug: Date
	userId: number
}

const Dashboard: React.FC<Props> = ({page}) => {

	// @ts-ignore
	const { auth } = useAuth();

	// @ts-ignore
	const { projects } = useProjects();

	return(
		<DashboardLayout page={page} >
			<>
				<h2 className='page-name'>Projects</h2>
				{projects.length ?
					(
						<div className='project-list'>
							{
								// @ts-ignore
								projects.map(project => (
									<Link key={project.projectId} className='project' to={`/projects/${project.slug}`}>{project.projectName}</Link>
								))
							}
						</div>
					) :
					(
						<p className="no-projects">You don't have projects yet, <Link to="/projects/new">start by creating one</Link></p>
					)
				}
			</>
	  </DashboardLayout>
	);
}


export default Dashboard;

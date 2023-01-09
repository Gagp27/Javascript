import { useContext } from "react";
import ProjectContext from "../context/ProjectProvider";


const useProjects = () => {
	return useContext(ProjectContext);
}

export default useProjects;

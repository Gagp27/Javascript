import { v4 as uuid }from "uuid";
import Project from "../models/Project.js";
import {projectsValidations} from "../helpers/validations/projectsValidations.js";


const getProjects = async (req, res) => {
    const { userId } = req.user;

    try {
        const projects = await Project.findAll({ where: { userId } });
        console.log(projects);

        return res.status(200).json({data: projects, errors: null, message: "Find projects successfully"});

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const createProject = async (req, res) => {
    const data = { projectName: req.body.projectName };
    const errors = { projectName: null };
    const { userId } = req.user;

    projectsValidations(data, errors);
    if(errors.projectName !== null) {
        return res.status(400).json({data: data, errors: errors, message: "Failed validation"});
    }

    try {
        const project = new Project(data);
        project.slug = uuid();
        project.userId = userId;
        const projectSaved = await project.save();
        return res.status(201).json({data: projectSaved, errors: null, message: "Project created successfully"})

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message})
    }
}

const updateProject = async (req, res) => {
    const data = { projectName: req.body.projectName };
    const errors = { projectName: null };
    const { projectId } = req.params;
    const { userId } = req.user;
    let isUpdate = false;

    projectsValidations(data, errors);
    if(errors.projectName !== null) {
        return res.status(400).json({data: data, errors: errors, message: "Failed validation"});
    }

    try {
        const projectForUpdate = await Project.findByPk(projectId);
        if(!projectForUpdate) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the project with id: ${projectId}`});
        }

        if(parseInt(projectForUpdate.userId) !== parseInt(userId)) {
            return res.status(401).json({data: null, error: "Access denied", message: `You are not owner of the project with id ${projectId}`});
        }

        if(projectForUpdate.projectName !== data.projectName) {
            projectForUpdate.projectName = data.projectName;
            isUpdate = true;
        }

        if(!isUpdate) {
            return res.status(200).json({data: projectForUpdate, errors: null, message: "Project updated successfully"});
        }

        const projectSaved = await projectForUpdate.save();
        return res.status(200).json({data: projectSaved, errors: null, message: "Project updated successfully"})

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message})
    }
}

const deleteProject = async (req, res) => {
    const { userId } = req.user;
    const { projectId } = req.params;

    try {
        const projectForDelete = await Project.findByPk(projectId);
        if(!projectForDelete) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the project with id: ${projectId}`});
        }

        if(parseInt(projectForDelete.userId) !== parseInt(userId)) {
            return res.status(401).json({data: null, error: "Access denied", message: `You are not owner of the project with id ${projectId}`});
        }

        await projectForDelete.destroy();
        return res.status(200).json({data: null, errors: null, message: "Project deleted successfully"});

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}


export {
    getProjects,
    createProject,
    updateProject,
    deleteProject
}

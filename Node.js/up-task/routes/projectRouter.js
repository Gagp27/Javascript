import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {getProjects, createProject, deleteProject, updateProject} from "../controllers/ProjectController.js";


const router = express.Router();


router.get('/', checkAuth, getProjects);
router.post('/', checkAuth, createProject);
router.put('/:projectId', checkAuth, updateProject);
router.delete('/:projectId', checkAuth, deleteProject);


export default router;

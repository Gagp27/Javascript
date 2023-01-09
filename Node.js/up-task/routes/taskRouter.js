import express from "express";
import {getTask, createTask, deleteTask, getAllTasks, updateTask, updateStateTask} from "../controllers/TaskController.js";
import checkAuth from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/:slug', checkAuth, createTask);
router.get('/:slug', checkAuth, getAllTasks);
router.get('/:slug/:taskId', checkAuth, getTask);
router.put('/:slug/:taskId', checkAuth, updateTask);
router.put('/state/:slug/:taskId', checkAuth, updateStateTask);
router.delete('/:slug/:taskId', checkAuth, deleteTask);

export default router;

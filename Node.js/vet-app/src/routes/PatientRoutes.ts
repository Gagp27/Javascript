import express, { Router } from "express";
import MiddleWare from "../middleware/MiddleWare";
import PatientController from "./PatientController";


const router: Router = express.Router();


router.get("/", MiddleWare.checkAuth, PatientController.getPatients);
router.get("/:id", MiddleWare.checkAuth, PatientController.getPatient);
router.post("/", MiddleWare.checkAuth, PatientController.create);
router.put("/:id", MiddleWare.checkAuth, PatientController.update);
router.delete("/:id", MiddleWare.checkAuth, PatientController.delete);

export default router;

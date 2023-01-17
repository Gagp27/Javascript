import express, { Router } from "express";
import veterinaryController from "./VeterinaryController";
import VeterinaryController from "./VeterinaryController";
import MiddleWare from "../middleware/MiddleWare";

const router: Router = express.Router();

router.post("/register", veterinaryController.register);
router.get(`/confirm/:token`, VeterinaryController.confirm);
router.post("/recover-account", VeterinaryController.recover);
router.get("/recover-account/:token", VeterinaryController.validToken);
router.post("/recover-account/:token", VeterinaryController.resetPassword);
router.post("/authenticate", VeterinaryController.authenticate);
router.get("/profile", MiddleWare.checkAuth, VeterinaryController.getProfile);
router.put("/profile/edit", MiddleWare.checkAuth, VeterinaryController.updateProfile);

export default router;

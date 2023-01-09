import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
	register,
	confirm,
	recoverAccount,
	recoverAccountTokenVerify,
	recoverAccountChangePassword,
	authenticate,
	getProfile,
	editProfile,
	editProfileChangePassword
} from "../controllers/UserController.js"


const router = express.Router();

router.post('/', authenticate);
router.post('/register', register);
router.get('/confirm/:token/:userId', confirm);
router.post('/recover-account', recoverAccount);
router.get('/recover-account/:token/:userId', recoverAccountTokenVerify);
router.post('/recover-account/:token/:userId', recoverAccountChangePassword);

router.get('/profile', checkAuth, getProfile);
router.put('/profile/edit', checkAuth, editProfile);
router.put('/profile/change-password', checkAuth, editProfileChangePassword);

export default router;

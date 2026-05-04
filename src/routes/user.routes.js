import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route('/register').upload.fields([{name: 'avatar', maxCount: 1}, {name: 'coverImage', maxCount: 1}]).post(registerUser);
// router.route('/login').post(loginUser);

export default router; 
import { Router } from "express"
import {register, login, logout, refreshAccessToken, getCurrentUser} from "../controllers/user.controllers.js";
import {verifyJWT} from '../middleware/auth.middleware.js'

const router = Router();

// Register a new user
router.route('/signup').post(register)

router.route("/refresh-token").post(refreshAccessToken)

// Login user
router.route('/login').post(login)

// Logout user
router.route('/logout').post(verifyJWT, logout)


router.route("/current-user").get(verifyJWT, getCurrentUser)

export default router;


import express from "express"
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import { register, login, getme, logout } from "../controllers/auth.controller.js";
import { Identifyuser } from "../middlewares/auth.middleware.js";

const authroute = express.Router();
/**
 * @description register user
 * @route POST /api/auth/register
 * @access public
 */
authroute.post("/register", registerValidator, register);
/**
 * @description login user
 * @route POST /api/auth/login
 * @access public
 */
authroute.post("/login", loginValidator, login);

/**
 * @description get me
 * @route GET /api/auth/get-me
 * @access private
 */

authroute.get("/get-me", Identifyuser, getme);



/**
 * @description logout user
 * @route GET /api/auth/logout
 * @access private
 */

authroute.get("/logout", Identifyuser, logout);

export default authroute
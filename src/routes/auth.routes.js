const {Router} = require('express');
authcontroller = require('../controllers/auth.controller');

const authRouter  = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', authcontroller.registerUserController);

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authcontroller.loginUserController)

module.exports = authRouter;
const {Router} = require('express');
authcontroller = require('../controllers/auth.controller');

const authRouter  = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', authcontroller.registerUserController);

module.exports = authRouter;
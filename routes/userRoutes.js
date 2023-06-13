const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();
const {body} = require("express-validator")
router.post('/register',
[body('username').notEmpty().withMessage("The username field is required!")],
[body('password').notEmpty().withMessage("The password field is required!")],
registerUser);
router.post('/login', loginUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const {register,login,contact} = require('../controller/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/contact').post(contact);

module.exports = router;
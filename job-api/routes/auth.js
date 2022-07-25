const router = require('express').Router();

const authMiddleware = require('../middleware/authentication');

const { login, register, updateUser } = require('../controllers/auth')



router.route('/register').post(register)
router.route('/login').post(login)
router.route('/updateUser').patch(authMiddleware, updateUser)

module.exports = router 

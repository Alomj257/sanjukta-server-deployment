const express = require('express');
const register = require('../controllers/authController/register');
const login = require('../controllers/authController/login');
const forgetPassword = require('../controllers/authController/forgetPassword');
const verifyOtp = require('../controllers/authController/verifyOtp');
const getOtpTime = require('../controllers/authController/getOtpTime');
const passwordUpdate = require('../controllers/authController/passwordUpdate');
const getAccess = require('../controllers/authController/getAccess');
const { getAllUsers } = require('../controllers/authController/getAllUsers');
const { getUserById, getUserByEmail } = require('../controllers/authController/getUserById');
const deleteUserById = require('../controllers/authController/deleteUserById');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget/password', forgetPassword);
router.post('/otp/verify', verifyOtp);
router.post('/otp/time', getOtpTime);
router.post('/password/update', passwordUpdate);
router.post('/get/access', getAccess);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.get('/', getAllUsers);
router.delete('/:id', deleteUserById); // Add DELETE route

module.exports = router;

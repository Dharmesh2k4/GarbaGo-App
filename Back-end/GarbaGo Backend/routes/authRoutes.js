import express from 'express'
import { sendLoginOTP,sendRegisterOTP,verifyLoginOTP, verifyRegisterOTP } from '../controller/authController.js'

const router = express.Router();

router.post('/send-login-otp',sendLoginOTP);
router.post('/send-register-otp',sendRegisterOTP);
router.post('/verify-register-otp',verifyRegisterOTP)
router.post('/verify-login-otp',verifyLoginOTP)

export default router;
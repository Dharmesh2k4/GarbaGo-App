import express from "express";
import { savePaymentDetails, getPaymentDetails,getPaymentByEvent } from "../controller/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/getPaymentByEvent", getPaymentByEvent);
router.post("/savePayment", savePaymentDetails);
router.post("/getPaymentDetails", getPaymentDetails);

export default router;

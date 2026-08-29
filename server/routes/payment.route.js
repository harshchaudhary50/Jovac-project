import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", isAuth, createOrder);
paymentRouter.post("/verify-payment", isAuth, verifyPayment);

export default paymentRouter;

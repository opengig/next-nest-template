import Razorpay from "razorpay";
import { RazorpayCheckout } from "./services";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const razorpayCheckout = new RazorpayCheckout(razorpay);

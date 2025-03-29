import Razorpay from "razorpay";
import crypto from "crypto";

export class RazorpayCheckout {
  private razorpay: Razorpay;

  constructor(razorpay: Razorpay) {
    this.razorpay = razorpay;
  }

  async createOrder({
    amount,
    currency = "INR",
    receipt,
    notes = {},
  }: {
    amount: number;
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
  }) {
    return await this.razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt,
      notes,
      payment_capture: true,
    });
  }

  async createSubscription({
    planId,
    customerId,
    totalCount,
    notes = {},
  }: {
    planId: string;
    customerId: string;
    totalCount?: number;
    notes?: Record<string, string>;
  }) {
    return await this.razorpay.subscriptions.create({
      plan_id: planId,
      total_count: totalCount ?? 1,
      notes,
    });
  }

  verifyPayment({
    orderId,
    paymentId,
    signature,
  }: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  }

  async fetchPaymentById(paymentId: string) {
    return await this.razorpay.payments.fetch(paymentId);
  }

  async fetchOrderById(orderId: string) {
    return await this.razorpay.orders.fetch(orderId);
  }

  async refundPayment({
    paymentId,
    amount,
    notes = {},
  }: {
    paymentId: string;
    amount?: number;
    notes?: Record<string, string>;
  }) {
    return await this.razorpay.payments.refund(paymentId, {
      amount,
      notes,
    });
  }
}

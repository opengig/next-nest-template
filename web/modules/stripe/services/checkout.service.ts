import Stripe from 'stripe';

export class StripeCheckout {
  private stripe: Stripe;
  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }
  async createPaymentSession({
    priceId,
    customerId,
    successUrl,
    cancelUrl,
    mode = 'subscription',
    quantity = 1,
    metadata = {},
  }: {
    priceId: string;
    customerId?: string;
    successUrl: string;
    cancelUrl: string;
    mode?: 'subscription' | 'payment';
    quantity?: number;
    metadata?: Record<string, string>;
  }) {
    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });
  }

  async createOneTimePaymentSession({
    amount,
    currency = 'usd',
    successUrl,
    cancelUrl,
    metadata = {},
  }: {
    amount: number;
    currency?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'One-time payment',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
    });
  }
}

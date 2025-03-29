import Stripe from 'stripe';

export class StripePaymentIntent {
  private stripe: Stripe;
  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }
  async create({
    amount,
    currency = 'usd',
    customerId,
    metadata = {},
    paymentMethodTypes = ['card'],
  }: {
    amount: number;
    currency?: string;
    customerId?: string;
    metadata?: Record<string, string>;
    paymentMethodTypes?: string[];
  }) {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  async confirm(paymentIntentId: string, paymentMethodId?: string) {
    return await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }

  async retrieve(paymentIntentId: string) {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async update(paymentIntentId: string, data: any) {
    return await this.stripe.paymentIntents.update(paymentIntentId, data);
  }

  async cancel(paymentIntentId: string) {
    return await this.stripe.paymentIntents.cancel(paymentIntentId);
  }
}

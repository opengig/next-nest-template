import twilio from 'twilio';
import type { Twilio } from 'twilio';

export interface TwilioConfig {
    accountSid: string;
    authToken: string;
    from: string;
}

export class TwilioSMS {
    private client: Twilio;
    private from: string;

    constructor(config: TwilioConfig) {
        this.from = config.from;
        this.client = twilio(config.accountSid, config.authToken);
    }

    async sendSMS(to: string, message: string): Promise<any> {
        try {
            const response = await this.client.messages.create({
                body: message,
                from: this.from,
                to,
            });
            console.log('Message sent:', response.sid);
            return response;
        } catch (error) {
            console.error('Failed to send SMS:', error);
            throw error;
        }
    }
}
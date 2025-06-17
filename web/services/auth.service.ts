import { ApiClient } from '@/lib/api-client';
import { LoginResponse } from '@/types/auth.type';

export class AuthService {
  static async handleGoogleAuth(idToken: string) {
    return await ApiClient.post<LoginResponse>('/api/auth/google', { idToken });
  }
  static async verifyOtp(email: string, otp: string) {
    return await ApiClient.post<LoginResponse>('/api/auth/otp/verify', { email, otp });
  }
  static async sendOtp(email: string) {
    return await ApiClient.post<boolean>('/api/auth/otp', { email });
  }
}

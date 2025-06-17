import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GoogleAuthDto, OtpAuthDto, VerifyOtpDto } from './dto/auth.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @Public()
  async googleAuth(@Body() body: GoogleAuthDto) {
    return this.authService.handleGoogleAuth(body.idToken);
  }

  @Post('otp')
  @Public()
  async otpAuth(@Body() body: OtpAuthDto) {
    return this.authService.handleOtpAuth(body.email);
  }

  @Post('otp/verify')
  @Public()
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.email, body.otp);
  }
}

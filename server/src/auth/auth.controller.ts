import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateOtpDto } from "./dto/create-otp.request";
import { CreateUserDto } from "src/users/dto/create-user.request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // This endpoint initiates Google OAuth flow
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Post("otps")
  createOtp(@Body() createOtp: CreateOtpDto) {
    return this.authService.getOtp(createOtp);
  }

  @Post("users")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.getUser(createUserDto);
  }
}

import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateOtpDto } from "./dto/create-otp.request";
import { CreateUserDto } from "src/users/dto/create-user.request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("otps")
  createOtp(@Body() createOtp: CreateOtpDto) {
    return this.authService.getOtp(createOtp);
  }

  @Post("users")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.getUser(createUserDto);
  }
}

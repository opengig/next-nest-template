import { Injectable, Logger } from "@nestjs/common";
import { CreateOtpDto } from "./dto/create-otp.request";
import * as crypto from "crypto";
import { PrismaService } from "src/prisma/prisma.service";
import { ResponseUtil } from "src/common/utils/response.util";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.request";

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getOtp(createOtpDto: CreateOtpDto) {
    try {
      const generateOtp = this.generateOtp();
      const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
      const { email, mobileNumber } = createOtpDto;
      const newOtp = await this.prismaService.otps.create({
        data: {
          email: email ?? null,
          mobileNumber: mobileNumber ?? null,
          otp: generateOtp,
          expiresAt: otpExpiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (!newOtp) {
        this.logger.error(
          `error occured while creating otp: ${email ?? ""} ${mobileNumber ?? ""}`,
        );
        return ResponseUtil.error("Error occured while creating otp", 400);
      }

      switch (createOtpDto.method) {
        case "email":
          this.logger.log(`Sending OTP to ${createOtpDto.email}`);
          break;
        case "mobile":
          this.logger.log(`Sending OTP to ${createOtpDto.mobileNumber}`);
          break;
        default:
          this.logger.error(
            `Invalid method of OTP login: ${createOtpDto.method}`,
          );
          return ResponseUtil.error(
            "Invalid method of OTP login, allowed method is email or mobile",
            400,
          );
      }

      return ResponseUtil.success(
        { otp: generateOtp, expiresAt: otpExpiresAt },
        "OTP created successfully",
        201,
      );
    } catch (error) {
      if (error.code === "P2002") {
        return ResponseUtil.error("User already exists", 400, error);
      }

      this.logger.error(
        `error occured while creating and sending otp/email to user ${createOtpDto.email} ${createOtpDto.mobileNumber} ${error}`,
      );
      return ResponseUtil.error(
        "Error occured while creating and sending otp to user",
        400,
        error,
      );
    }
  }

  generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async getUser(createUserDto: CreateUserDto) {
    const { email, mobileNumber, otp, role } = createUserDto;

    try {
      const isValidOtp = this.isValidOtp(email, mobileNumber, otp);

      if (!isValidOtp) {
        return ResponseUtil.error("Invalid OTP", 400);
      }

      let user = await this.prismaService.users.findFirst({
        where: {
          OR: [
            {
              email: email,
            },
            {
              mobileNumber: mobileNumber,
            },
          ],
        },
      });

      if (!user) {
        user = await this.prismaService.users.create({
          data: {
            email: email ?? null,
            mobileNumber: mobileNumber ?? null,
            // created_at: new Date(),
            // updated_at: new Date(),
            role: role,
          },
        });
        this.logger.log(
          `New user created successfully: ${email} ${mobileNumber}`,
        );
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken: any = await this.jwtService.signAsync(tokenPayload);

      return ResponseUtil.success({ user, accessToken });
    } catch (error) {
      this.logger.error(
        `error occured while creating user ${email} ${mobileNumber} ${error}`,
      );
      return ResponseUtil.error(
        "Error occured while creating user",
        400,
        error,
      );
    }
  }

  async isValidOtp(email: string, mobileNumber: string, otp: string) {
    try {
      this.logger.log(
        `Verifying OTP for email or mobile : ${email ?? ""} ${mobileNumber ?? ""}`,
      );

      const validOtp = this.prismaService.otps.findFirst({
        where: {
          OR: [
            {
              email: email,
              otp: otp,
            },
            {
              mobileNumber: mobileNumber,
              otp: otp,
            },
          ],
        },
      });

      if (validOtp) {
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `error occured while verifying otp for email or mobile: ${email ?? ""} ${mobileNumber ?? ""}, ${error}`,
      );
      return false;
    }
  }
}

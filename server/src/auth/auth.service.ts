import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Auth, google } from 'googleapis';
import { UserRole } from 'prisma/client';
import { config } from 'src/common/config';
import { generateOtp } from 'src/common/utils/auth.utils';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private oauth2Client: Auth.OAuth2Client;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.callbackUrl,
    );
  }

  async handleGoogleAuth(idToken: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: config.google.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid google id token');
      }
      const { email, sub: googleId, given_name, family_name, picture } = payload;
      if (!email) {
        throw new UnauthorizedException('Invalid google id token');
      }
      let user = await this.prismaService.users.findFirst({
        where: {
          email,
        },
      });
      if (!user) {
        user = await this.prismaService.users.create({
          data: {
            email,
            name: `${given_name} ${family_name}`,
            avatarUrl: picture,
            role: UserRole.USER,
            isVerified: true, // As it is google auth
          },
        });
      }
      const jwtPayload = {
        id: user.id,
        email,
        avatarUrl: user?.avatarUrl,
        name: user?.name ?? 'Unknown',
        role: user?.role,
        sub: googleId,
      };

      const token = await this.jwtService.signAsync(jwtPayload, {
        expiresIn: config.jwt.expiresIn,
      });
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error(`error occured while verifying google id token: ${idToken}, ${error}`);
      throw new UnauthorizedException('Invalid google id token');
    }
  }

  async handleOtpAuth(email: string) {
    try {
      let user = await this.prismaService.users.findFirst({
        where: {
          email,
        },
      });
      if (!user) {
        user = await this.prismaService.users.create({
          data: {
            email,
            role: UserRole.USER,
            isVerified: false,
          },
        });
      }

      if (user.otp && user.otpExpires && user.otpExpires > new Date()) {
        await this.prismaService.users.update({
          where: { id: user.id },
          data: { otpExpires: new Date(Date.now() + 1000 * 60 * 5) },
        });
        void this.mailService.sendTemplateMail({
          to: email,
          subject: 'Your OTP for Opengig',
          templateName: 'OTP',
          context: {
            otp: user.otp,
            validity: 5,
          },
        });
        return true;
      }
      await this.generateAndSendOtp(user.id, email);
      return true;
    } catch (error) {
      this.logger.error(`[ERROR: handleOtpAuth] ${email}, ${error.message}`);
      throw new UnauthorizedException('Invalid otp');
    }
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.prismaService.users.findFirst({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid otp');
    }
    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid otp');
    }
    if (user.otpExpires && user.otpExpires < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }
    await this.prismaService.users.update({
      where: { id: user.id },
      data: { isVerified: true, otp: null, otpExpires: null },
    });
    const jwtPayload = {
      id: user.id,
      email,
      avatarUrl: user?.avatarUrl,
      name: user?.name ?? 'Unknown',
      role: user?.role,
      sub: user.id,
    };
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: config.jwt.expiresIn,
    });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    };
  }
  private async generateAndSendOtp(userId: string, email: string) {
    const otp = generateOtp();
    await this.prismaService.users.update({
      where: { id: userId },
      data: { otp, otpExpires: new Date(Date.now() + 1000 * 60 * 5) },
    });
    void this.mailService.sendTemplateMail({
      to: email,
      subject: 'Your OTP for Opengig',
      templateName: 'OTP',
      context: {
        otp: otp,
        validity: 5,
      },
    });
  }
}

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Auth, google } from 'googleapis';
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
      let user = await this.prismaService.user.findFirst({
        where: {
          email,
        },
      });
      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            email,
            name: `${given_name} ${family_name}`,
            avatarUrl: picture,
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
      const otp = await this.prismaService.otp.findFirst({
        where: { email },
      });
      if (otp) {
        if (otp.expiresAt && otp.expiresAt > new Date()) {
          void this.mailService.sendTemplateMail({
            to: email,
            subject: 'Your OTP for Heizen',
            templateName: 'OTP',
            context: {
              otp: otp.otp,
              validity: 5,
            },
          });
          return true;
        }
        await this.prismaService.otp.delete({ where: { id: otp.id } });
      }

      await this.generateAndSendOtp(email);
      return true;
    } catch (error) {
      this.logger.error(`[ERROR: handleOtpAuth] ${email}, ${error.message}`);
      throw new UnauthorizedException('Invalid otp');
    }
  }

  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.prismaService.otp.findFirst({
      where: { email },
    });
    if (!otpRecord) {
      throw new UnauthorizedException('Invalid otp');
    }
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }
    if (otpRecord.otp !== otp) {
      throw new UnauthorizedException('Invalid otp');
    }
    await this.prismaService.otp.delete({ where: { id: otpRecord.id } });
    let user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user) {
      user = await this.prismaService.user.create({
        data: { email },
      });
    }
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
  private async generateAndSendOtp(email: string) {
    const otp = generateOtp();
    await this.prismaService.otp.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      },
    });
    void this.mailService.sendTemplateMail({
      to: email,
      subject: 'Your OTP for Heizen',
      templateName: 'OTP',
      context: {
        otp: otp,
        validity: 5,
      },
    });
  }
}

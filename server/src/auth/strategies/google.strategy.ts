import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      clientID: configService.getOrThrow("GOOGLE_CLIENT_ID"),
      clientSecret: configService.getOrThrow("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.getOrThrow("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const email = emails[0].value;

    let user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prismaService.users.create({
        data: {
          email,
          firstName: name.givenName,
          lastName: name.familyName,
          username: email.split("@")[0],
          role: "user",
        },
      });
    }

    done(null, user);
  }
}

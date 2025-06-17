import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'The ID token from Google' })
  @IsString()
  idToken: string;
}

export class OtpAuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  otp: string;
}

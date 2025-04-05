import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateOtpDto {
  @ApiProperty({
    example: "+1234567890",
    description: "The mobile of the user",
  })
  @IsOptional()
  // @IsMobilePhone('en-US')
  mobileNumber?: string;

  @ApiProperty({
    example: "test@example.com",
    description: "The email of the user",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: "1234567",
    description: "The otp",
  })
  @IsOptional()
  // @IsMobilePhone('en-US')
  otp?: string;

  @ApiProperty({
    example: "email | mobile",
    description: "The method of otp login",
  })
  @IsString()
  method: string;
}

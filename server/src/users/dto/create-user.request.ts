import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  username?: string;

  @IsOptional()
  @ApiProperty({ example: "John" })
  firstName?: string | null;

  @IsOptional()
  @ApiProperty({ example: "Doe" })
  lastName?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "+1234567890" })
  // @IsMobilePhone('en-US')
  mobileNumber?: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  otp?: string;

  @ApiProperty({
    example: "test@example.com",
    description: "The email of the user",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @ApiProperty({ example: "vendor" })
  role: UserRole;

  @IsOptional()
  @ApiProperty({ example: "https://example.com/avatar.png" })
  avatarUrl?: string | null;
}

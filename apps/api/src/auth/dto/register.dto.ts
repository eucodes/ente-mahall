import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  phone?: string;

  @IsString()
  @MinLength(10, { message: "Password must be at least 10 characters" })
  @MaxLength(128)
  @Matches(/[a-z]/, { message: "Password must include a lowercase letter" })
  @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  @Matches(/[0-9]/, { message: "Password must include a number" })
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fullName!: string;
}

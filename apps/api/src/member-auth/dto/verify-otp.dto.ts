import { IsString, Length, Matches } from "class-validator";

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  phone!: string;

  @IsString()
  @Length(6, 6, { message: "Enter the 6-digit code" })
  @Matches(/^[0-9]{6}$/, { message: "Enter the 6-digit code" })
  code!: string;
}

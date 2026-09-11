import { IsString, Matches } from "class-validator";

export class RequestOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  phone!: string;
}

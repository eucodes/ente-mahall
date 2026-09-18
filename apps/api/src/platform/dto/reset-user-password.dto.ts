import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetUserPasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword!: string;
}

import { IsEmail, IsEnum } from "class-validator";
import { PlatformRole } from "@mahalle/types";

export class GrantPlatformAccessDto {
  @IsEmail()
  email!: string;

  @IsEnum(PlatformRole)
  role!: PlatformRole;
}

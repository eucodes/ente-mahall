import { IsEnum } from "class-validator";
import { PlatformRole } from "@mahalle/types";

export class UpdatePlatformRoleDto {
  @IsEnum(PlatformRole)
  role!: PlatformRole;
}

import { IsEmail, IsEnum } from "class-validator";
import { TenantRole } from "@mahalle/types";

export class AddAdminDto {
  @IsEmail()
  email!: string;

  @IsEnum(TenantRole)
  roleKey!: TenantRole;
}

export class UpdateAdminRoleDto {
  @IsEnum(TenantRole)
  roleKey!: TenantRole;
}

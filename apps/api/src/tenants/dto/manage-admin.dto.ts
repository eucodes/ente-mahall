import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class AddAdminDto {
  @IsEmail()
  email!: string;

  /**
   * A role *key* within this tenant — either one of the seeded system role
   * keys (OWNER/ADMIN/...) or a custom role's generated key. Validated
   * against the tenant's actual Role rows in AdminsService, not against a
   * fixed enum, since custom roles are now first-class.
   */
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  roleKey!: string;
}

export class UpdateAdminRoleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  roleKey!: string;
}

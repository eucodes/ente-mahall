import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AssignUserTenantDto {
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsOptional()
  roleKey?: string;
}

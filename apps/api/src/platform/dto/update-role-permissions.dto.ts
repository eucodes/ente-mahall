import { ArrayUnique, IsArray, IsIn } from "class-validator";
import { PERMISSIONS } from "@mahalle/types";

export class UpdateRolePermissionsDto {
  @IsArray()
  @ArrayUnique()
  @IsIn(PERMISSIONS, { each: true })
  permissions!: string[];
}

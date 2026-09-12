import { ArrayMinSize, ArrayUnique, IsArray, IsString } from "class-validator";

export class BulkDeleteTenantsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  tenantIds!: string[];
}

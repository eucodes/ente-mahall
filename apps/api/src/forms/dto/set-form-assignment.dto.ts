import { ArrayUnique, IsArray, IsBoolean, IsString } from "class-validator";

export class SetFormAssignmentDto {
  @IsBoolean()
  isPlatformWide!: boolean;

  /** Ignored when isPlatformWide is true. The full replacement set of assigned tenant ids. */
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tenantIds!: string[];
}

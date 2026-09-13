import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class ReorderDivisionsDto {
  /** Division ids in their new display order (index 0 = first). */
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  orderedIds!: string[];
}

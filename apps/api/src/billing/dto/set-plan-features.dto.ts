import { ArrayUnique, IsArray, IsString } from "class-validator";

export class SetPlanFeaturesDto {
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  featureIds!: string[];
}

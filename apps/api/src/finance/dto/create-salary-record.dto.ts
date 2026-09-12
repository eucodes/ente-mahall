import { IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSalaryRecordDto {
  @IsString() @MinLength(1) @MaxLength(255) staffName!: string;
  @IsString() @MaxLength(20) month!: string;
  @IsNumberString() amount!: string;
}

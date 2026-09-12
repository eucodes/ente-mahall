import { IsDateString, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDueDto {
  @IsString() memberId!: string;
  @IsString() @MinLength(1) @MaxLength(255) title!: string;
  @IsNumberString() amount!: string;
  @IsDateString() dueDate!: string;
}

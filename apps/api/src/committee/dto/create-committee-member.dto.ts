import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateCommitteeMemberDto {
  @IsString()
  memberId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  designation!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsDateString()
  termStart?: string;

  @IsOptional()
  @IsDateString()
  termEnd?: string;
}

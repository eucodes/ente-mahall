import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMarriageRecordDto {
  @IsString() @MinLength(1) @MaxLength(255) groomName!: string;
  @IsOptional() @IsString() @MaxLength(255) groomFatherName?: string;
  @IsOptional() @IsString() groomMemberId?: string;

  @IsString() @MinLength(1) @MaxLength(255) brideName!: string;
  @IsOptional() @IsString() @MaxLength(255) brideFatherName?: string;
  @IsOptional() @IsString() brideMemberId?: string;

  @IsDateString() marriageDate!: string;

  @IsOptional() @IsString() @MaxLength(255) place?: string;
  @IsOptional() @IsString() @MaxLength(255) officiantName?: string;
  @IsOptional() @IsString() @MaxLength(255) witness1Name?: string;
  @IsOptional() @IsString() @MaxLength(255) witness2Name?: string;
  @IsOptional() @IsString() @MaxLength(500) mahrDetails?: string;
  @IsOptional() @IsString() @MaxLength(2000) remarks?: string;
}

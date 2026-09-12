import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateServiceRequestDto {
  @IsString() @MinLength(1) @MaxLength(100) requestType!: string;
  @IsOptional() @IsString() memberId?: string;
  @IsString() @MinLength(1) @MaxLength(255) requesterName!: string;
  @IsOptional() @IsString() @MaxLength(50) requesterPhone?: string;
  @IsString() @MinLength(1) @MaxLength(255) subject!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() eventId?: string;
  @IsOptional() @IsString() @MaxLength(50) registerType?: string;
  @IsOptional() @IsString() registerRecordId?: string;
}

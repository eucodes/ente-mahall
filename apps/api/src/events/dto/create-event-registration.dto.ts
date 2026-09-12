import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateEventRegistrationDto {
  @IsOptional() @IsString() memberId?: string;
  @IsString() @MinLength(1) @MaxLength(255) participantName!: string;
  @IsOptional() @IsString() @MaxLength(50) participantPhone?: string;
  @IsOptional() @IsBoolean() attended?: boolean;
}

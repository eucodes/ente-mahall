import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  body!: string;

  @IsOptional()
  @IsBoolean()
  publish?: boolean;
}

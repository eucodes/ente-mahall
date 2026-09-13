import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateTenantProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  // Contact
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  website?: string;

  // Masjid
  @IsOptional()
  @IsString()
  @MaxLength(255)
  masjidName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  masjidPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  masjidAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imamName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  khatheebName?: string;

  // Location
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  localBody?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  place?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9A-Za-z -]{3,12}$/, { message: "Enter a valid PIN/postal code" })
  pinCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  // Committee
  @IsOptional()
  @IsString()
  @MaxLength(255)
  presidentName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  presidentPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  secretaryName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  secretaryPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  treasurerName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  treasurerPhone?: string;
}

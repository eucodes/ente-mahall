import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Max,
  Min,
  MinLength,
  ValidateNested
} from "class-validator";

const RESERVED_SLUGS = new Set(["www", "admin", "control", "api", "app", "mail", "ftp"]);

const LOCAL_BODY_TYPES = ["Grama Panchayat", "Municipality", "Corporation", "Other"] as const;
const HOUSE_NUMBERING_METHODS = ["NUMERIC", "ALPHANUMERIC", "CUSTOM"] as const;

export class DivisionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

/**
 * All fields beyond slug/name/description are optional so the older,
 * minimal "create a Mahalle" flow (apps/web's /new-mahalle page) keeps
 * working exactly as before — only the full onboarding wizard ever sends
 * the location/profile/masjid/structure/management sections.
 */
export class CreateTenantDto {
  @IsString()
  @MinLength(3)
  @MaxLength(63)
  @Matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
    message: "Slug may only contain lowercase letters, numbers, and hyphens"
  })
  slug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  // Branding
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  coverImageUrl?: string;

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
  @IsUrl({ require_protocol: true })
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
  @IsIn(LOCAL_BODY_TYPES)
  localBodyType?: (typeof LOCAL_BODY_TYPES)[number];

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

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  // Structure
  @IsOptional()
  @IsBoolean()
  hasDivisions?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  divisionTerm?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DivisionDto)
  divisions?: DivisionDto[];

  @IsOptional()
  @IsIn(HOUSE_NUMBERING_METHODS)
  houseNumberingMethod?: (typeof HOUSE_NUMBERING_METHODS)[number];

  // Management
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

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

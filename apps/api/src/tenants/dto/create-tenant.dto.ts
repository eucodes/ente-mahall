import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

const RESERVED_SLUGS = new Set(["www", "admin", "control", "api", "app", "mail", "ftp"]);

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
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

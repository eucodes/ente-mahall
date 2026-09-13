import { Transform } from "class-transformer";
import { IsDateString, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCollectionDto {
  @IsString() @MinLength(1) @MaxLength(50) type!: string; // FAMILY_COLLECTION, DAY_COLLECTION, FRIDAY_COLLECTION, DONATION, PROGRAM_COLLECTION, OTHER
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsString() familyId?: string;
  @IsOptional() @IsString() memberId?: string;
  @IsOptional() @IsString() @MaxLength(255) donorName?: string;
  @IsOptional() @IsString() @MaxLength(50) donorPhone?: string;
  @IsOptional() @IsString() @MaxLength(500) donorAddress?: string;
  @IsOptional() @IsString() @MaxLength(255) collectorName?: string;
  @Transform(({ value }) => (value != null ? String(value) : value))
  @IsNumberString() amount!: string;
  @IsOptional() @IsString() paymentMethodId?: string;
  @IsOptional() @IsString() @MaxLength(100) paymentMethod?: string;
  @IsOptional() @IsString() bankAccountId?: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() @MaxLength(255) reference?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}

import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePaymentMethodDto {
  @IsString() @MinLength(1) @MaxLength(255) name!: string;
  @IsString() @MinLength(1) @MaxLength(50) code!: string;
  @IsOptional() @IsString() @MaxLength(50) type?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() requiresReference?: boolean;
  @IsOptional() @IsBoolean() requiresChequeNumber?: boolean;
  @IsOptional() @IsBoolean() requiresBankDetails?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

export class UpdatePaymentMethodDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(255) name?: string;
  @IsOptional() @IsString() @MaxLength(50) code?: string;
  @IsOptional() @IsString() @MaxLength(50) type?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() requiresReference?: boolean;
  @IsOptional() @IsBoolean() requiresChequeNumber?: boolean;
  @IsOptional() @IsBoolean() requiresBankDetails?: boolean;
  @IsOptional() @IsInt() displayOrder?: number;
}

import { VoucherType } from "@mahalle/database";
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateVoucherDto {
  @IsEnum(VoucherType) type!: VoucherType;
  @IsString() accountId!: string;
  @IsOptional() @IsString() memberId?: string;
  @IsOptional() @IsString() eventId?: string;
  @IsDateString() date!: string;
  @IsNumberString() amount!: string;
  @IsOptional() @IsString() @MaxLength(255) partyName?: string;
  @IsOptional() @IsString() @MaxLength(100) paymentMethod?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
}

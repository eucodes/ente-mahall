import { BloodGroup, MovementStatus } from "@mahalle/database";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

function toBoolean(value: unknown): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export class ListMembersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  familyId?: string;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  isYatheem?: boolean;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  isExpatriate?: boolean;

  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsEnum(MovementStatus)
  movementStatus?: MovementStatus;

  @IsOptional()
  @IsString()
  divisionId?: string;
}

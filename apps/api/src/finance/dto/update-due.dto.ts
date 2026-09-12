import { DueStatus } from "@mahalle/database";
import { IsEnum, IsOptional } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateDueDto } from "./create-due.dto";

export class UpdateDueDto extends PartialType(CreateDueDto) {
  @IsOptional()
  @IsEnum(DueStatus)
  status?: DueStatus;
}

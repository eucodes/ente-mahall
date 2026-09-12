import { ServiceRequestStatus } from "@mahalle/database";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceRequestDto } from "./create-service-request.dto";

export class UpdateServiceRequestDto extends PartialType(CreateServiceRequestDto) {
  @IsOptional() @IsEnum(ServiceRequestStatus) status?: ServiceRequestStatus;
  @IsOptional() @IsString() assignedToUserId?: string;
  @IsOptional() @IsString() @MaxLength(2000) resolutionNotes?: string;
}

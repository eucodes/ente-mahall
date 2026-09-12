import { PartialType } from "@nestjs/mapped-types";
import { CreateGraveRecordDto } from "./create-grave-record.dto";

export class UpdateGraveRecordDto extends PartialType(CreateGraveRecordDto) {}

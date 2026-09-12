import { PartialType } from "@nestjs/mapped-types";
import { CreateDeathRecordDto } from "./create-death-record.dto";

export class UpdateDeathRecordDto extends PartialType(CreateDeathRecordDto) {}

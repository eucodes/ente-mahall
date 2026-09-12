import { PartialType } from "@nestjs/mapped-types";
import { CreateDivorceRecordDto } from "./create-divorce-record.dto";

export class UpdateDivorceRecordDto extends PartialType(CreateDivorceRecordDto) {}

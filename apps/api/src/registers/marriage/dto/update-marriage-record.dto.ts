import { PartialType } from "@nestjs/mapped-types";
import { CreateMarriageRecordDto } from "./create-marriage-record.dto";

export class UpdateMarriageRecordDto extends PartialType(CreateMarriageRecordDto) {}

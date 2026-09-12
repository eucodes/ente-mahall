import { PartialType } from "@nestjs/mapped-types";
import { CreatePropertyRecordDto } from "./create-property-record.dto";

export class UpdatePropertyRecordDto extends PartialType(CreatePropertyRecordDto) {}

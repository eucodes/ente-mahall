import { PartialType } from "@nestjs/mapped-types";
import { CreateReleaseRecordDto } from "./create-release-record.dto";

export class UpdateReleaseRecordDto extends PartialType(CreateReleaseRecordDto) {}

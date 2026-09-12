import { PartialType } from "@nestjs/mapped-types";
import { CreateCommitteeMeetingDto } from "./create-committee-meeting.dto";

export class UpdateCommitteeMeetingDto extends PartialType(CreateCommitteeMeetingDto) {}

import { PartialType } from "@nestjs/mapped-types";
import { CreateCommitteeMemberDto } from "./create-committee-member.dto";

export class UpdateCommitteeMemberDto extends PartialType(CreateCommitteeMemberDto) {}

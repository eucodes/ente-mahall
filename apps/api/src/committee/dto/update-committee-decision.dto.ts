import { PartialType } from "@nestjs/mapped-types";
import { CreateCommitteeDecisionDto } from "./create-committee-decision.dto";

export class UpdateCommitteeDecisionDto extends PartialType(CreateCommitteeDecisionDto) {}

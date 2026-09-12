import { PartialType } from "@nestjs/mapped-types";
import { CreateMadrassaEnrollmentDto } from "./create-madrassa-enrollment.dto";

export class UpdateMadrassaEnrollmentDto extends PartialType(CreateMadrassaEnrollmentDto) {}

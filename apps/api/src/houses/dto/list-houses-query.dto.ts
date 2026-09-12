import { IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class ListHousesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  divisionId?: string;
}

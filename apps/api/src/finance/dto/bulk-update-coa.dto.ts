import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class BulkUpdateCoaMappingDto {
  @IsArray()
  @IsString({ each: true })
  categoryIds!: string[];

  @IsString()
  @IsIn(["INCOME", "EXPENSE", "COLLECTION"])
  categoryType!: "INCOME" | "EXPENSE" | "COLLECTION";

  @IsOptional()
  @IsString()
  coaAccountId?: string | null;

  @IsOptional()
  @IsString()
  fundId?: string | null;

  @IsOptional()
  @IsBoolean()
  postPendingTransactions?: boolean;
}

export class BulkUpdateTransactionsDto {
  @IsArray()
  @IsString({ each: true })
  transactionIds!: string[];

  @IsString()
  @IsIn(["COLLECTION", "VOUCHER"])
  transactionType!: "COLLECTION" | "VOUCHER";

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  fundId?: string;

  @IsOptional()
  @IsBoolean()
  postToJournal?: boolean;
}

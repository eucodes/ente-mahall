import { describe, expect, it, vi } from "vitest";
import { AccountingService } from "./accounting.service";
import { BadRequestException } from "@nestjs/common";

describe("AccountingService - Core Validations", () => {
  const mockPrisma: any = {
    financialYear: {
      findFirst: vi.fn(),
      findMany: vi.fn()
    },
    account: {
      findFirst: vi.fn(),
      findMany: vi.fn()
    }
  };
  const mockAudit: any = { record: vi.fn() };
  const mockCertificates: any = { nextNumber: vi.fn() };

  const service = new AccountingService(mockPrisma, mockAudit, mockCertificates);

  it("rejects journal entries where total debit does not equal total credit", async () => {
    mockPrisma.financialYear.findFirst.mockResolvedValue({ id: "fy1", name: "FY 2026-27", status: "OPEN" });

    await expect(
      service.createJournalEntry(
        { userId: "u1", tenantId: "t1" },
        {
          description: "Unbalanced test entry",
          lines: [
            { accountId: "a1", debit: "1000", credit: "0" },
            { accountId: "a2", debit: "0", credit: "900" } // mismatch!
          ]
        },
        {}
      )
    ).rejects.toThrow(BadRequestException);
  });

  it("rejects journal entries with negative amounts", async () => {
    mockPrisma.financialYear.findFirst.mockResolvedValue({ id: "fy1", name: "FY 2026-27", status: "OPEN" });

    await expect(
      service.createJournalEntry(
        { userId: "u1", tenantId: "t1" },
        {
          description: "Negative amount test",
          lines: [
            { accountId: "a1", debit: "-500", credit: "0" },
            { accountId: "a2", debit: "0", credit: "-500" }
          ]
        },
        {}
      )
    ).rejects.toThrow(BadRequestException);
  });

  it("rejects posting into a closed financial year", async () => {
    mockPrisma.financialYear.findFirst.mockResolvedValue({ id: "fy_closed", name: "FY 2024-25", status: "CLOSED" });

    await expect(
      service.createJournalEntry(
        { userId: "u1", tenantId: "t1" },
        {
          financialYearId: "fy_closed",
          description: "Posting to closed year",
          lines: [
            { accountId: "a1", debit: "500", credit: "0" },
            { accountId: "a2", debit: "0", credit: "500" }
          ]
        },
        {}
      )
    ).rejects.toThrow(BadRequestException);
  });
});

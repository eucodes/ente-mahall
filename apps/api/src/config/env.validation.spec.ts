import { describe, it, expect } from "vitest";
import { validateEnv } from "./env.validation";

const validEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  REDIS_URL: "redis://localhost:6379",
  JWT_ACCESS_SECRET: "access-secret",
  JWT_REFRESH_SECRET: "refresh-secret",
  SESSION_SECRET: "session-secret",
  COOKIE_DOMAIN: ".example.com",
  CORS_ORIGINS: "http://localhost:3000"
};

describe("validateEnv", () => {
  it("accepts a fully populated valid environment", () => {
    expect(() => validateEnv(validEnv)).not.toThrow();
  });

  it("applies defaults for optional keys", () => {
    const result = validateEnv(validEnv);
    expect(result.PORT).toBe(4000);
    expect(result.NODE_ENV).toBe("development");
  });

  it("throws when a required variable is missing", () => {
    const { DATABASE_URL: _omit, ...rest } = validEnv;
    expect(() => validateEnv(rest)).toThrow(/DATABASE_URL/);
  });
});

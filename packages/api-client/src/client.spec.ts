import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient, ApiError } from "./client";

describe("ApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("successfully makes a GET request", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: new Headers({ "content-length": "100" }),
      text: async () => JSON.stringify({ success: true, data: { foo: "bar" } })
    });
    vi.stubGlobal("fetch", mockFetch);

    const client = new ApiClient({ baseUrl: "http://api.test" });
    const result = await client.get<{ foo: string }>("/test");

    expect(result).toEqual({ foo: "bar" });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("http://api.test/test", expect.objectContaining({
      method: "GET",
      credentials: "include"
    }));
  });

  it("silently refreshes and retries upon receiving a 401", async () => {
    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      callCount++;
      if (url === "http://api.test/protected") {
        if (callCount === 1) {
          // First call: expired access token
          return {
            status: 401,
            ok: false,
            headers: new Headers(),
            text: async () => JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "Token expired" } })
          };
        }
        // Retried call after refresh
        return {
          status: 200,
          ok: true,
          headers: new Headers({ "content-length": "100" }),
          text: async () => JSON.stringify({ success: true, data: { secret: "123" } })
        };
      }

      if (url === "http://api.test/auth/refresh") {
        return {
          status: 200,
          ok: true,
          headers: new Headers({ "content-length": "100" }),
          text: async () => JSON.stringify({ success: true })
        };
      }

      throw new Error(`Unexpected url: ${url}`);
    });
    vi.stubGlobal("fetch", mockFetch);

    const client = new ApiClient({
      baseUrl: "http://api.test",
      getAppScope: () => "admin"
    });

    const data = await client.get<{ secret: string }>("/protected");
    expect(data).toEqual({ secret: "123" });
    expect(mockFetch).toHaveBeenCalledTimes(3); // 1. protected (401) -> 2. refresh (200) -> 3. protected (200)
    expect(mockFetch).toHaveBeenNthCalledWith(2, "http://api.test/auth/refresh", expect.objectContaining({
      method: "POST",
      credentials: "include"
    }));
  });

  it("deduplicates concurrent 401 refresh calls so /auth/refresh is only called once", async () => {
    let refreshCalls = 0;
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === "http://api.test/auth/refresh") {
        refreshCalls++;
        // slight delay to simulate async network roundtrip
        await new Promise((r) => setTimeout(r, 20));
        return {
          status: 200,
          ok: true,
          headers: new Headers({ "content-length": "100" }),
          text: async () => JSON.stringify({ success: true })
        };
      }

      if (url.startsWith("http://api.test/resource")) {
        // Return 401 first time if refresh hasn't completed
        if (refreshCalls === 0) {
          return {
            status: 401,
            ok: false,
            headers: new Headers(),
            text: async () => JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "Token expired" } })
          };
        }
        return {
          status: 200,
          ok: true,
          headers: new Headers({ "content-length": "100" }),
          text: async () => JSON.stringify({ success: true, data: { url } })
        };
      }

      throw new Error(`Unexpected url: ${url}`);
    });
    vi.stubGlobal("fetch", mockFetch);

    const client = new ApiClient({ baseUrl: "http://api.test" });

    // 3 concurrent requests all hitting 401
    const [res1, res2, res3] = await Promise.all([
      client.get("/resource/1"),
      client.get("/resource/2"),
      client.get("/resource/3")
    ]);

    expect(res1).toEqual({ url: "http://api.test/resource/1" });
    expect(res2).toEqual({ url: "http://api.test/resource/2" });
    expect(res3).toEqual({ url: "http://api.test/resource/3" });

    // /auth/refresh was called EXACTLY once!
    expect(refreshCalls).toBe(1);
  });

  it("calls onSessionExpired and throws ApiError when refresh fails", async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === "http://api.test/resource") {
        return {
          status: 401,
          ok: false,
          headers: new Headers(),
          text: async () => JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "Expired" } })
        };
      }

      if (url === "http://api.test/auth/refresh") {
        return {
          status: 401,
          ok: false,
          headers: new Headers(),
          text: async () => JSON.stringify({ success: false, error: { code: "UNAUTHORIZED", message: "Refresh token invalid" } })
        };
      }

      throw new Error(`Unexpected: ${url}`);
    });
    vi.stubGlobal("fetch", mockFetch);

    const onSessionExpired = vi.fn();
    const client = new ApiClient({
      baseUrl: "http://api.test",
      onSessionExpired
    });

    await expect(client.get("/resource")).rejects.toThrow(ApiError);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("does not attempt refresh or trigger onSessionExpired on /auth/login failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 401,
      ok: false,
      headers: new Headers(),
      text: async () => JSON.stringify({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Bad password" } })
    });
    vi.stubGlobal("fetch", mockFetch);

    const onSessionExpired = vi.fn();
    const client = new ApiClient({
      baseUrl: "http://api.test",
      onSessionExpired
    });

    await expect(client.post("/auth/login", { email: "a@b.com", password: "wrong" })).rejects.toThrow(ApiError);
    expect(onSessionExpired).not.toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("http://api.test/auth/login", expect.anything());
  });
});

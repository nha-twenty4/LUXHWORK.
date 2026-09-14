import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "user" | "admin"): TrpcContext {
  return {
    user: { id: 1, openId: "test-user", email: "test@example.com", name: "Test User", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin authorization", () => {
  it("blocks non-admin users before database access", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.admin.inquiries()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows the admin middleware to run", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const result = await caller.admin.inquiries();
    expect(Array.isArray(result)).toBe(true);
  });
});

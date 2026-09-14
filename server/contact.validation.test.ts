import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("contact.submit validation", () => {
  it("rejects invalid email and short project details", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.contact.submit({
      name: "A",
      email: "not-an-email",
      service: "",
      details: "too short",
    })).rejects.toThrow();
  });
});

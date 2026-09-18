import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("simplified project pages", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("keeps the project gallery focused on full-frame images", () => {
    expect(source).toContain("project-detail-gallery");
    expect(source).toContain("alt={`${project.title} detail ${index + 1}`}");
    expect(source).not.toContain("Material and proportion");
    expect(source).not.toContain("Atmosphere study");
    expect(source).not.toContain("A considered frame");
  });

  it("removes the resource and sharing blocks marked unnecessary in the revision", () => {
    expect(source).not.toContain("project-resources");
    expect(source).not.toContain("project-sharing");
    expect(source).not.toContain("See the thinking");
    expect(source).not.toContain("Pass it on");
  });
});

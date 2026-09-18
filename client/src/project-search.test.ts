import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("portfolio project gallery", () => {
  it("shows the complete portfolio without search, filters, or sorting controls", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).toContain("const visibleProjects = projects;");
    expect(source).toContain("Projects / Portfolio");
    expect(source).not.toContain("Search projects, categories, locations");
    expect(source).not.toContain("Clear filters");
    expect(source).not.toContain("aria-label=\"Filter projects by category\"");
    expect(source).not.toContain("luxh-project-discovery");
    expect(source).not.toContain("project-sort-row");
  });
});

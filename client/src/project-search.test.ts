import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("portfolio project search and filters", () => {
  it("includes searchable project fields and accessible controls", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(source).toContain("Search projects, categories, locations");
    expect(source).toContain("project.title} ${project.category} ${project.location} ${project.client");
    expect(source).toContain("Clear filters");
    expect(source).toContain("aria-label=\"Filter projects by category\"");
    expect(source).toContain("Newest");
    expect(source).toContain("Oldest");
    expect(source).toContain("Location A–Z");
    expect(source).toContain("Client A–Z");
    expect(source).toContain("Project size");
    expect(source).toContain("All years");
    expect(source).toContain("URLSearchParams");
    expect(source).toContain("params.set(\"q\"");
    expect(source).toContain("luxh-project-discovery");
    expect(source).toContain("filter-count");
    expect(source).toContain("const visibleProjects = uniqueProjects;");
    expect(source).not.toContain("slice(0, 4)");
    expect(source).toContain("All selected projects with distinct imagery");
    expect(css).toContain(".project-search");
    expect(css).toContain(".clear-search-filter");
    expect(css).toContain(".filter-count");
    expect(css).toContain(".project-sort-row");
    expect(css).toContain(".load-more-button");
    expect(css).toContain("filterResultsIn");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("project resource links", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("resolves floor plans and PDFs through the storage URL helper", () => {
    expect(source).toContain('href={storageUrl(project.floorPlan)}');
    expect(source).toContain('href={storageUrl(project.pdf)}');
  });

  it("opens cross-origin storage resources safely and prevents empty links", () => {
    expect(source).toContain('target="_blank" rel="noreferrer"');
    expect(source).toContain('aria-disabled={!project.floorPlan}');
    expect(source).toContain('aria-disabled={!project.pdf}');
    expect(source).toContain('if (!project.floorPlan) event.preventDefault()');
    expect(source).toContain('if (!project.pdf) event.preventDefault()');
  });
});

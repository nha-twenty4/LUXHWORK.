import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("LUXHWORK PDF V2 alignment", () => {
  it("includes the revised hero copy, footer strip and process steps", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    // Hero headline and copy
    expect(source).toContain("Commercial spaces");
    expect(source).toContain("designed to perform.");
    expect(source).toContain("Interior consultancy, design, fit-out and post-completion support for offices, retail, hospitality and F&amp;B.");
    expect(source).toContain("Discuss Your Project");
    expect(source).toContain("hero-footer-strip");
    expect(source).toContain("DESIGN TO AFTERCARE");

    // Selected work & labels
    expect(source).toContain("project-status-tag");
    expect(source).toContain("project-label-tag");
    expect(source).toContain("Spaces shaped around");
    expect(source).toContain("business purpose.");

    // Process section
    expect(source).toContain("v2-process-steps");
    expect(source).toContain("BRIEF &amp; CONSULT");
    expect(source).toContain("DESIGN &amp; COST");
    expect(source).toContain("BUILD &amp; MANAGE");
    expect(source).toContain("HANDOVER &amp; CARE");
    expect(source).toContain("MAINTAIN");

    // About stats replaced 01 Accountable Partner with 02 Countries
    expect(source).toContain("Countries");
    expect(source).not.toContain("Accountable partner");

    // CSS styling
    expect(css).toContain(".v2-process-steps");
    expect(css).toContain(".hero-footer-strip");
    expect(css).toContain(".project-status-tag");
  });
});

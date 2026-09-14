import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("LUXHWORK PDF project imagery", () => {
  it("uses uploaded Company Profile project images for hero and galleries", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const media = readFileSync(resolve(process.cwd(), "client/src/projectMedia.ts"), "utf8");

    expect(source).toContain("const profileImage");
    expect(media).toContain("files.manuscdn.com/user_upload_by_module/session_file");
    expect(source).toContain('bar: profileImage("image87.png")');
    expect(source).toContain('residence: profileImage("image137.png")');
    expect(source).toContain("const companyProjectImageSets");
    expect(source).toContain("VISA WORLDWIDE BRANCH OFFICE (PHNOM PENH)");
    expect(source).toContain("PP LINK SECURITY OFFICE (PHNOM PENH)");
    expect(source).toContain("GOLDEN GROUP (PHNOM PENH)");
    expect(source).toContain("RYUKO OMAKASE (PHNOM PENH)");
    expect(source).toContain("LUCKY BURGER TAKMAO");
    expect(source).toContain("COMBI (PHNOM PENH)");
    expect(source).toContain("LUK FOOK JEWELLERY AEON 3");
    expect(source).toContain("ONE OASIS WELLNESS SPA (PHNOM PENH)");
    expect(source).toContain("const companyProjectDetails");
    expect(source).toContain('slug: "davidoff"');
    expect(source).toContain('slug: "the-hynd-hotel"');
    expect(source).toContain('slug: "chj-jewellry-cb1"');
    expect(source).not.toContain("500,000.00 USD");
    expect(source).not.toContain("105,000.00 USD");
    expect(source).not.toContain("<span>Budget</span>");
    expect(source).toContain("project-pagination");
    expect(source).toContain("header-scrolled");
    expect(source).not.toContain('hero: "/home-hero.jpg"');
  });
});

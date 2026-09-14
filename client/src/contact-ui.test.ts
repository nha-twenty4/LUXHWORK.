import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("LUXH contact details", () => {
  it("uses the requested Cambodia contact details and hover states", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(source).toContain("+855 89 900 300");
    expect(source).toContain("ADMIN@LUXHWORK.COM");
    expect(source).toContain("tel:+85589900300");
    expect(source).toContain("contact-details-centered");

    expect(source).not.toContain("hello@luxhworks.com");
    expect(source).not.toContain("+84 28 7304 8890");
    expect(css).toContain(".contact-detail-block>a:hover");
    expect(css).toContain(".contact-detail-block:hover>p");
    expect(css).toContain(".footer-links .footer-contact:hover");
  });

  it("exposes quick contact links in the footer and contact page", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).toContain("https://t.me/+85589900300");
    expect(source).toContain("https://wa.me/85589900300");

    expect((source.match(/Telegram/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect((source.match(/WhatsApp/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("theme-aware portfolio images", () => {
  it("defines dark-mode image correction and interaction states", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(css).toContain(".theme-image");
    expect(css).toContain(".dark .theme-image");
    expect(css).toContain("brightness(.86)");
    expect(css).toContain("saturate(.84)");
    expect(css).toContain(".dark .project-detail-gallery .theme-image");
  });

  it("defines distinct presets for all visual project disciplines", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(css).toContain(".image-preset-architecture");
    expect(css).toContain(".image-preset-interior");
    expect(css).toContain(".image-preset-visualization");
    expect(css).toContain(".image-preset-graphic");
    expect(css).toContain(".image-preset-branding");
    expect(css).toContain(".image-preset-monochrome");
    expect(css).toContain(".image-preset-cinematic");
    expect(css).toContain(".dark .image-preset-architecture");
    expect(css).toContain(".dark .image-preset-interior");
    expect(css).toContain(".dark .image-preset-visualization");
    expect(css).toContain(".dark .image-preset-graphic");
    expect(css).toContain(".dark .image-preset-branding");
    expect(css).toContain(".dark .image-preset-monochrome");
    expect(css).toContain(".dark .image-preset-cinematic");
    expect(css).toContain(".color-preset-controls");
  });
});

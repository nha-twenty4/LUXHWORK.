import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Company Profile slide image matching", () => {
  it("maps each visible website project to the media group from its titled PPT slide", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const expectedMappings = [
      ["house-14", "image37.jpeg", "image41.jpeg"],
      ["mori-residence", "image44.jpeg", "image45.jpeg"],
      ["northpoint", "image51.png", "image55.jpeg"],
      ["seascape-house", "image56.jpeg", "image61.jpeg"],
      ["frame-house", "image66.jpeg", "image69.jpeg"],
      ["field-notes", "image74.png", "image76.png"],
      ["atelier-common", "image81.png", "image86.jpeg"],
      ["courtyard-study", "image96.png", "image100.png"],
      ["davidoff", "image63.jpeg", "image65.jpeg"],
      ["the-hynd-hotel", "image101.png", "image105.png"],
      ["chj-jewellry-cb1", "image106.png", "image111.png"],
    ];
    for (const [slug, first, last] of expectedMappings) {
      expect(source).toContain(slug);
      expect(source).toContain(first);
      expect(source).toContain(last);
    }
  });
});

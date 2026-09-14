import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("LUXHWORK Company Profile image replacement", () => {
  it("uses the 2026 profile asset set for all content imagery", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const media = readFileSync(resolve(process.cwd(), "client/src/projectMedia.ts"), "utf8");
    expect(source).toContain("const profileImage");
    expect(media).toContain("files.manuscdn.com/user_upload_by_module/session_file");
    ["image37.jpeg", "image87.png", "image92.jpeg", "image137.png"].forEach((asset) => expect(source).toContain(asset));
    expect(source).not.toContain("luxhportf-emhvyngn.manus.space/manus-storage/image");
    expect(source).not.toContain("image149_13e97dd5.jpeg");
    expect(source).not.toContain("image60_7266a104.jpeg");
    expect(source).not.toContain("image146_e270e323.jpeg");
    expect(source).not.toContain("image101_d0b6a9f8.png");
  });
});

import { z } from "zod";
import { createContactInquiry } from "../server/db";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(80).optional(),
  service: z.string().trim().min(1).max(120),
  details: z.string().trim().min(20).max(5000),
  budget: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const rawBody =
      typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    const input = inquirySchema.parse(rawBody);
    const result = await createContactInquiry(input);
    res.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: error.issues[0]?.message ?? "Invalid request" });
      return;
    }
    console.error("[Contact API] Failed to save inquiry:", error);
    res
      .status(500)
      .json({ error: "We could not save your inquiry. Please try again." });
  }
}

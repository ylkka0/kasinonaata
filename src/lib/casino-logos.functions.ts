import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ name: z.string().min(1).max(120) });

/**
 * Uses Lovable AI Gateway to guess the casino's official website domain,
 * then returns a Clearbit logo URL for it. Returns null if no logo found.
 */
export const fetchCasinoLogo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY puuttuu");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You return ONLY the primary website domain (e.g. 'example.com') of the online casino the user names. No protocol, no path, no quotes, no extra words. If unsure, return 'unknown'.",
          },
          { role: "user", content: `Casino name: ${data.name}` },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`AI gateway ${res.status}: ${text.slice(0, 200)}`);
    }
    const json: any = await res.json();
    const raw: string = json?.choices?.[0]?.message?.content ?? "";
    const domain = raw
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")
      .replace(/[^a-z0-9.-]/g, "");

    if (!domain || domain === "unknown" || !domain.includes(".")) {
      return { logo_url: null as string | null, domain: null as string | null };
    }
    return {
      logo_url: `https://logo.clearbit.com/${domain}`,
      domain,
    };
  });
// Server-only helper for calling Lovable AI Gateway
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function aiChat(
  messages: Msg[],
  opts: { model?: string; json?: boolean; temperature?: number } = {},
): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const body: Record<string, unknown> = {
    model: opts.model ?? "google/gemini-3-flash-preview",
    messages,
  };
  if (opts.json) body.response_format = { type: "json_object" };
  if (opts.temperature != null) body.temperature = opts.temperature;
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    throw new Error(`AI request failed [${res.status}]: ${text}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export async function aiJson<T>(messages: Msg[], model?: string): Promise<T> {
  const text = await aiChat(messages, { json: true, model });
  // Strip markdown code fences if the model wrapped output
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned) as T;
}

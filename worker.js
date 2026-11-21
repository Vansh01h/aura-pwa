// AURA Cloudflare Worker — OpenRouter free-model router
// Add a Cloudflare Secret named OPENROUTER_API_KEY.
const ALLOWED_ORIGIN = "https://vansh01h.github.io";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (origin !== ALLOWED_ORIGIN) {
      return new Response("Origin not allowed", { status: 403 });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST" || new URL(request.url).pathname !== "/chat") {
      return new Response("Not found", { status: 404, headers: cors });
    }
    if (!env.OPENROUTER_API_KEY) {
      return Response.json({ error: "OpenRouter key is not configured on the backend." }, { status: 500, headers: cors });
    }

    let body;
    try { body = await request.json(); }
    catch {
      return Response.json({ error: "Invalid JSON." }, { status: 400, headers: cors });
    }
    if (typeof body.system !== "string" || !Array.isArray(body.messages) || body.messages.length > 20) {
      return Response.json({ error: "Invalid chat payload." }, { status: 400, headers: cors });
    }

    const messages = [
      { role: "system", content: body.system.slice(0, 12000) },
      ...body.messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 4000)
      }))
    ];

    let upstream;
    try {
      upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": ALLOWED_ORIGIN,
          "X-Title": "AURA AI Companion"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages,
          max_tokens: 500,
          temperature: 0.85
        })
      });
    } catch {
      return Response.json({ error: "Could not reach OpenRouter. Please try again." }, { status: 502, headers: cors });
    }

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = result?.error?.message || `OpenRouter request failed (${upstream.status}).`;
      return Response.json({ error: message }, { status: upstream.status, headers: cors });
    }

    const reply = result?.choices?.[0]?.message?.content;
    return Response.json(
      { reply: typeof reply === "string" && reply.trim() ? reply.trim() : "I'm here. Want to tell me a little more?" },
      { headers: cors }
    );
  }
};

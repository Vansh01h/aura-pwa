// Cloudflare Worker for AURA. Store OPENAI_API_KEY with: npx wrangler secret put OPENAI_API_KEY
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
    if (origin !== ALLOWED_ORIGIN) return new Response("Origin not allowed", {status: 403});
    if (request.method === "OPTIONS") return new Response(null, {headers: cors});
    if (request.method !== "POST" || new URL(request.url).pathname !== "/chat") return new Response("Not found", {status: 404, headers: cors});
    if (!env.OPENAI_API_KEY) return Response.json({error:"OpenAI key is not configured on the backend."},{status:500,headers:cors});
    let body;
    try { body = await request.json(); } catch { return Response.json({error:"Invalid JSON."},{status:400,headers:cors}); }
    if (typeof body.system !== "string" || !Array.isArray(body.messages) || body.messages.length > 20) return Response.json({error:"Invalid chat payload."},{status:400,headers:cors});
    const input = body.messages.map(m => ({role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0,4000)}));
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method:"POST", headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},
      body:JSON.stringify({model:"gpt-4.1-mini", instructions:body.system.slice(0,12000), input, max_output_tokens:500})
    });
    const result = await upstream.json().catch(()=>({}));
    if (!upstream.ok) return Response.json({error:result.error?.message || "OpenAI request failed."},{status:upstream.status,headers:cors});
    const reply = (result.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text).join("\n").trim();
    return Response.json({reply: reply || "I'm here. Want to tell me a little more?"},{headers:cors});
  }
};

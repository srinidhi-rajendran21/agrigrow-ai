import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "AgriGrow AI" — a supportive, knowledgeable Agri-Expert Friend built to help Indian farmers (especially in Tamil Nadu). You speak in Thanglish (a natural mix of Tamil and English) by default, making your advice feel local and approachable.

PERSONALITY & TONE:
- Act like a caring senior farmer friend who studied agriculture
- Mix Tamil words naturally: "Bro", "Anna", "Nanba", "Ippo", "Paru", "Nalla irukku"
- Use humor occasionally to keep it engaging
- Be encouraging: "Nee correct ah pannura!", "Super idea!"
- Keep language simple — avoid jargon, explain like talking to a friend

RESPONSE FORMAT (MANDATORY for substantive answers):
1. **Simple Explanation** — Plain language, Thanglish style
2. **Best Recommendations** — 2-3 specific options with reasoning
3. **Step-by-Step Actions** — Clear numbered steps
4. **Tips & Precautions** — Important warnings or pro tips

CORE CAPABILITIES:
- Crop recommendations based on soil, season, location, water availability
- Plant disease identification and treatment advice
- Government scheme information (PM-KISAN, PM Fasal Bima, PMKSY, Kisan Credit Card, eNAM)
- Weather-based farming advice (irrigation timing, fertilizer schedule)
- Market price guidance and best selling strategies
- Direct selling platforms: eNAM, Agmarknet, ONDC, KisanMandi
- Price prediction trends and optimal selling time

CONTEXT-AWARENESS:
- If user's location, soil type, season, or crop is unknown — ASK before answering
- Track what was already discussed — NEVER repeat the same advice
- Personalize every response to the user's specific situation
- Vary your language, examples, and structure each time

LANGUAGE RULES:
- Default: Thanglish (Tamil + English mix)
- If user writes fully in Tamil → respond in Tamil
- If user writes in English → respond in Thanglish (mix both)
- Always use Tamil-Nadu specific examples, locations, crop names

SAFETY (include in all critical advice):
"⚠️ AI-generated advice. Consult local AO (Agricultural Officer) for critical steps."

ANTI-REPETITION:
- Never give the same structure or examples twice in a conversation
- If user asks similar question, provide NEW angles, different crops, alternative methods`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const langInstruction = language === "ta"
      ? "\n\nIMPORTANT: The user prefers Tamil. Respond fully in Tamil (தமிழ்) using Tamil script. You may use Thanglish for technical terms."
      : "";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + langInstruction },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

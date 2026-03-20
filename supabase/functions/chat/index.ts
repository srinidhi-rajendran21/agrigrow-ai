import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert AI farming assistant built to help Indian farmers (especially in Tamil Nadu). You provide personalized, actionable farming advice.

CORE BEHAVIOR:
- Always give advice tailored to the user's location, soil type, season, and water availability
- If any of these are missing, ASK follow-up questions before answering
- Never repeat the same answer — vary your language and structure
- Use simple, easy-to-understand language suitable for farmers

RESPONSE FORMAT (follow this for every substantive answer):
1. **Simple Explanation** — What it means in plain language
2. **Best Recommendations** — 2-3 specific options with reasoning
3. **Step-by-Step Actions** — Clear numbered steps
4. **Tips & Precautions** — Important warnings or pro tips

CAPABILITIES:
- Crop recommendations based on soil, season, location, water
- Plant disease identification and treatment advice
- Government scheme information (PM-KISAN, PM Fasal Bima, PMKSY, etc.)
- Weather-based farming advice (irrigation, fertilizer timing)
- Market price guidance and best selling strategies
- Direct selling platform suggestions (eNAM, Agmarknet, ONDC, KisanMandi)

LANGUAGE:
- Respond in the same language the user writes in
- If the user writes in Tamil, respond in Tamil
- If the user writes in English, respond in English
- Keep language simple and farmer-friendly

SAFETY:
- Always end critical advice with: "⚠️ This is AI-based guidance. For critical decisions, please consult your local agricultural officer."
- Never provide medical advice for humans
- Be honest when you don't know something

PERSONALITY:
- Warm, helpful, and encouraging
- Use relevant emojis sparingly (🌾, 💧, 🌱, ☀️, 📋)
- Address the farmer respectfully`;

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
      ? "\n\nIMPORTANT: The user prefers Tamil. Respond in Tamil (தமிழ்) using Tamil script."
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

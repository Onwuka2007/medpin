import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * @param {string} userInput
 * @param {Array<{ id: string, name: string, genericName: string, brandNames?: string[] }>} drugCatalog
 * @returns {Promise<{
 *   correctedQuery: string | null,
 *   isAvailable: boolean,
 *   suggestions: Array<{ id: string, name: string, reason: string }>,
 *   disclaimer: string
 * } | null>}
 */
export async function getSmartSuggestions(userInput, drugCatalog) {
  if (!import.meta.env.VITE_GROQ_API_KEY?.trim()) {
    console.warn("VITE_GROQ_API_KEY is not set");
    return null;
  }

  try {
    const catalogJson = JSON.stringify(drugCatalog);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the "Core AI Pharmacist" for a Nigerian pharmacy finder app.

          AUTHORITATIVE DRUG CATALOG (JSON array). Each item has "id", "name", "genericName", "brandNames".
          You MUST ONLY suggest drugs that appear in this catalog. Copy "id" EXACTLY — never invent ids.
          ${catalogJson}

          RULES:
          1. NIGERIAN CONTEXT: Prefer locally relevant brands when they appear in brandNames (e.g. Emzor, Fidson, Shalina).
          2. GENERIC MAPPING: Map common brand queries to the correct catalog entry.
          3. TYPO CORRECTION: Fix phonetic spellings (e.g. "Amoxilin" → match catalog entry for Amoxicillin if present).
          4. NO HALLUCINATION: If nothing in the catalog fits, return an empty "suggestions" array and set isAvailable false.
          5. Order "suggestions" by best match first (max 5 items).

          RETURN ONLY JSON:
          {
            "correctedQuery": "string or null if the user query is fine as-is",
            "isAvailable": boolean,
            "suggestions": [{"id": "exact catalog id", "name": "display name from catalog", "reason": "one short line"}],
            "disclaimer": "Consult a licensed clinician or pharmacist for medical advice."
          }`,
        },
        {
          role: "user",
          content: `User search: ${userInput}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const raw = chatCompletion.choices[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const allowedIds = new Set(drugCatalog.map((d) => d.id));

    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter(
        (s) => s && typeof s.id === "string" && allowedIds.has(s.id),
      )
      : [];

    return {
      correctedQuery: parsed.correctedQuery ?? null,
      isAvailable: Boolean(parsed.isAvailable),
      suggestions,
      disclaimer:
        typeof parsed.disclaimer === "string"
          ? parsed.disclaimer
          : "Consult a licensed clinician or pharmacist for medical advice.",
    };
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}

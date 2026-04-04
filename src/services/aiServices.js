import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getSmartSuggestions = async (userInput, mockInventory) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the "Core AI Pharmacist" for a Nigerian Pharmacy Finder app. 
          Use this stock list: ${JSON.stringify(mockInventory)}.
          
          RULES:
          1. NIGERIAN CONTEXT: Prioritize local brands like Emzor, Fidson, and Shalina.
          2. GENERIC MAPPING: Match brands to their generic compounds.
          3. TYPO CORRECTION: Fix phonetic spellings (e.g., "Amoxilin").
          4. NO HALLUCINATION: Only suggest drugs from the provided list.
          
          RETURN ONLY JSON:
          {
            "correctedQuery": "string",
            "isAvailable": boolean,
            "suggestions": [{"id": "mock_id", "name": "Brand", "reason": "why"}],
            "disclaimer": "Consult a doctor."
          }`
        },
        {
          role: "user",
          content: `Searching for: ${userInput}`
        }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};
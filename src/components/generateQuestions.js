import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const sanitizeOptionsArray = (options) => {
  if (!Array.isArray(options)) return [];
  const sanitized = options
    .filter((opt) => typeof opt === "string")
    .slice(0, 4);
  while (sanitized.length < 4) {
    sanitized.push(`Option ${String.fromCharCode(65 + sanitized.length)}`);
  }
  return sanitized;
};

const sanitizeAndValidate = (rawArrayText) => {
  const results = [];
  try {
    let text = rawArrayText.trim();
    if (text.startsWith("```")) {
      text = text
        .replace(/^```(?:json)?/, "")
        .replace(/```$/, "")
        .trim();
    }

    const jsonLike = JSON.parse(text);
    if (!Array.isArray(jsonLike))
      throw new Error("Top-level JSON is not array");

    for (const item of jsonLike) {
      try {
        const { subtopic, question, options, correctAnswer, explanation } =
          item;

        if (!subtopic || !question || !options || !correctAnswer) continue;

        const clean = {
          subtopic: String(subtopic),
          question: String(question),
          options: sanitizeOptionsArray(options),
          correctAnswer: String(correctAnswer),
          explanation: explanation?.trim()
            ? String(explanation)
            : "Explanation not provided.",
        };

        results.push(clean);
      } catch (err) {
        console.warn("⚠️ Skipped malformed item:", err.message);
      }
    }

    return results;
  } catch (e) {
    console.error("❌ Entire response is not valid JSON array:", e.message);
    return [];
  }
};

const generateQuestions = async (unit, subtopics = []) => {
  const prompt = `
Generate one multiple choice question for each of the following 10 Python subtopics (Intermediate level), under the unit '${unit}'.

Each question must include:
- "subtopic": the subtopic name
- "question": the question text
- "options": an array of 4 strings
- "correctAnswer": one of the options
- "explanation": short explanation (required), with example if possible

Subtopics:
${subtopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return ONLY a valid JSON array of 10 objects. No markdown, no formatting, no extra text.
IMPORTANT:
- All keys must be double-quoted
- No trailing commas
- If any code appears in the question, wrap it in backticks (\\\`)`;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful Python tutor." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const raw = result.choices[0].message.content.trim();
    console.log("🧾 Raw GPT response:", raw.slice(0, 1000), "...");

    const sanitized = sanitizeAndValidate(raw);
    console.log("✅ Valid questions parsed:", sanitized.length);

    return sanitized;
  } catch (error) {
    console.error("❌ Failed to generate questions:", error);
    return [];
  }
};

export default generateQuestions;

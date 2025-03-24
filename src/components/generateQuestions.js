import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const generateQuestions = async (unit, subtopics = []) => {
  const prompt = `
Generate one multiple choice question for each of the following 10 Python subtopics (Intermediate level), under the unit '${unit}'.

Each question should include:
- "subtopic": the subtopic name
- "question": the question text
- "options": array of 4 strings
- "correctAnswer": the correct answer from options
- "explanation": short explanation why that answer is correct

Here are the 10 subtopics:
${subtopics.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Return as a JSON array of 10 objects.
`;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a Python tutor and quiz generator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const response = result.choices[0].message.content;
    const clean = response.trim().replace(/^```json/, "").replace(/```$/, "");
    const parsed = JSON.parse(clean);
    console.log(parsed)
    return parsed;
  } catch (error) {
    console.error("❌ Failed to generate questions:", error);
    return [];
  }
};

export default generateQuestions;

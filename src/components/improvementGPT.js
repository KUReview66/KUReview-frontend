import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getImprovementSuggestion = async (wrongAnswers, unitName) => {
  const formattedMistakes = wrongAnswers.map((entry, i) => {
    return `${i + 1}. Subtopic: ${entry.subtopic}\nQ: ${entry.question}\nYour Answer: ${entry.userAnswer}\nCorrect Answer: ${entry.correctAnswer}`;
  }).join("\n\n");

  const prompt = `
This is a quiz report from a Python student in the unit '${unitName}'. They made the following mistakes:

${formattedMistakes}

Please write a short and helpful improvement suggestion (2-3 sentences) that tells them what topics they should review or practice more.
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful Python tutor." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ Failed to get suggestion from OpenAI:", err);
    return "⚠️ Unable to generate suggestion at this time.";
  }
};

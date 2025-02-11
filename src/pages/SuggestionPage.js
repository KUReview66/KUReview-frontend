import React, { useState } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import Navbar from "../components/navBar"; // Ensure Navbar is correctly imported
import styles from "../styles/Suggestion.module.css";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config";

// 📌 Unit-specific videos (update video paths here)
const unitVideos = {
  Loop: "path_to_loop_video.mp4",
  Condition: "path_to_condition_video.mp4",
  List: "path_to_list_video.mp4",
  Function: "path_to_function_video.mp4",
};

export default function SuggestionPage() {
  const [selectedTab, setSelectedTab] = useState("content"); // Tracks active section
  const [selectedUnit, setSelectedUnit] = useState(null); // Stores selected unit
  const [suggestion, setSuggestion] = useState("Select a unit to see the learning content.");
  const [loading, setLoading] = useState(false);

  // Fetch OpenAI-generated content based on the selected unit
  const fetchSuggestion = async (unit) => {
    setLoading(true);
    setSelectedUnit(unit); // Keep track of the selected unit
    setSuggestion("⏳ Generating content...");

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI tutor creating structured learning materials for Python learners." },
          { 
            role: "user", 
            content: `Create a complete learning module for '${unit}' in Python. 
            The module should include:
            1. **Concept Explanation**: Explain the topic in simple terms.
            2. **Code Example**: A properly formatted and readable code example.
            3. **Common Mistake**: A mistake that beginners often make, along with a correction.
            4. **Try It Online**: Provide a link to an online Python practice exercise.

            Use Markdown formatting, and format code blocks inside triple backticks (\`\`\`python ... \`\`\`).`
          }
        ],
        max_tokens: 500,
      });

      // Format the response for better readability
      const formattedText = response.choices[0].message.content
        .replace(/```python/g, "<pre><code class='python'>")  // Start code block
        .replace(/```/g, "</code></pre>")  // End code block
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
        .replace(/\n/g, "<br />"); // Line breaks

      setSuggestion(formattedText);
      console.log(response.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching content:", error);
      setSuggestion("⚠️ Error: Unable to generate learning content. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div>
      {/* 🔹 Navbar (Always Visible) */}
      <Navbar />

      <div className={styles.container}>
        {/* 🔹 Unit Section (Title + Buttons) */}
        <div className={styles.unitSection}>
          <Typography className={styles.unitTitle}>Units</Typography>
          <div className={styles.unitButtonsContainer}>
            {['Loop', 'Condition', 'List', 'Function'].map((unit) => (
              <Button
                key={unit}
                onClick={() => fetchSuggestion(unit)}
                className={`${styles.unitButton} ${selectedUnit === unit ? styles.activeUnit : ""}`}
              >
                {`Unit ${['Loop', 'Condition', 'List', 'Function'].indexOf(unit) + 1}: ${unit}`}
              </Button>
            ))}
          </div>
        </div>

        {/* 🔹 Tab Navigation */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${selectedTab === "content" ? styles.activeTab : ""}`} 
            onClick={() => setSelectedTab("content")}
            disabled={!selectedUnit} // Prevent switching without selecting a unit
          >
            Content Suggestion
          </button>
          <button 
            className={`${styles.tab} ${selectedTab === "video" ? styles.activeTab : ""}`} 
            onClick={() => setSelectedTab("video")}
            disabled={!selectedUnit} // Prevent switching without selecting a unit
          >
            KU Video
          </button>
        </div>

        {/* 🔹 Content Wrapper */}
{/* 🔹 Content Wrapper */}
<div className={styles.contentWrapper}>
  {!selectedUnit && (
    <Box className={styles.suggestionBox}>
      <Typography variant="body1">
        Please select a unit to view content.
      </Typography>
    </Box>
  )}

  {selectedUnit && selectedTab === "content" && (
    <Box className={styles.suggestionBox}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: suggestion }} />
      )}
    </Box>
  )}

  {selectedUnit && selectedTab === "video" && (
    <div className={styles.videoContainer}>
      <Typography variant="h6">{selectedUnit} Video</Typography>
      <video width="80%" controls>
        <source src={unitVideos[selectedUnit]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )}
</div>

      </div>
    </div>
  );
}

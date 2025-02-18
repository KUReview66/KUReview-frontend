import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import Navbar from "../components/navBar"; 
import styles from "../styles/Suggestion.module.css";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// 📌 Unit-specific videos (7 main units)
const unitVideos = {
  "Sequential Program": "path_to_sequential_program_video.mp4",
  "Subroutine": "path_to_subroutine_video.mp4",
  "Selection": "path_to_selection_video.mp4",
  "Repetition": "path_to_repetition_video.mp4",
  "File Input": "path_to_file_input_video.mp4",
  "List": "path_to_list_video.mp4",
  "Numerical Processing": "path_to_numerical_processing_video.mp4",
};

// 📌 Fixed Mock Student Scores
const mockStudentScores = {
  "Sequential Program": 10, 
  "Subroutine": 20,
  "Selection": 30,
  "Repetition": 50,
  "File Input": 50,
  "List": 80,
  "Numerical Processing": 80,
};

// 📌 Units & Subtopics (AI will include them automatically)
const unitSubtopics = {
  "Sequential Program": ["Python Statement", "Arithmetic Expression", "Variable", "Data Types", "Data Type Conversion", "Input Statement", "String Formatting", "Output Statement and Formatting"],
  "Subroutine": ["Subroutine Concept", "Built-in Functions", "Math Module", "User-defined Function", "Parameter Passing", "Function with Default Parameters", "Value-Returning Function", "Function with Returning Multiple Values", "Composition", "Getting Help in Python", "Local and Global Variables", "Positional and Named Arguments"],
  "Selection": ["Boolean Operators and Expression", "Flowchart", "If Statement", "If-Else Statement", "Multiple Selection Concept", "Nested Conditions", "Chained Conditions"],
  "Repetition": ["For Statement", "The range() Function", "While Statement", "Loop and a Half", "Infinite Loop", "Counting Loop", "Sentinel Loop", "Nested Loop"],
  "File Input": ["Reading a Text File", "Function vs. Method", "List Comprehension", "Nested List"],
  "List": ["Introduction to Collection", "List Methods", "Operations on List", "Properties of List vs. String", "List Slicing"],
  "Numerical Processing": ["Numpy with 1D-Array", "Array vs. List", "Reading a Text File using Numpy", "Numpy with 2D-Array"],
};

export default function SuggestionPage() {
  const [selectedTab, setSelectedTab] = useState("content"); 
  const [selectedUnit, setSelectedUnit] = useState(null); 
  const [suggestion, setSuggestion] = useState("Select a unit to see the learning content.");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState([]);
  const [error, setError] = useState(null);
  const studentId = "6410509012";

  useEffect(() => {
      const fetchScores = async () => {
          try {
              const response = await fetch(`http://localhost:3000/student-score/topic-wise/${studentId}`);
              if (!response.ok) {
                  throw new Error("Failed to fetch scores");
              }
              const data = await response.json();
  
              const mergedScores = data.reduce((acc, item) => {
                  const { round, topicName, totalQuestion, topicScore } = item;
  
                  let existingRound = acc.find(entry => entry.round === round);
                  if (!existingRound) {
                      existingRound = { round, total: 0, fullScore: 0, topics: {} }; 
                      acc.push(existingRound);
                  }
  
                  existingRound.topics[topicName] = { topicScore, totalQuestion };
                  existingRound.total += topicScore;
                  existingRound.fullScore += totalQuestion;
                  return acc;
              }, []);
  
              mergedScores.sort((a, b) => a.round - b.round);
  
              setScore(mergedScores);
          } catch (err) {
              setError(err.message);
          } 
      };
  
      fetchScores();
  }, [studentId]);

  const fetchSuggestion = async (unit) => {
    setLoading(true);
    setSelectedUnit(unit);
    const studentScore = mockStudentScores[unit]; // Use fixed mock score
    console.log(`Mock student score for ${unit}:`, studentScore); 
    setSuggestion("⏳ Generating content...");

    let difficultyLevel = studentScore <= 30 ? "easy, medium, and hard" : studentScore <= 60 ? "medium and hard" : "hard";
    let exerciseCount = studentScore <= 30 ? "many" : studentScore <= 60 ? "some" : "few";

    // Get subtopics for the selected unit
    let subtopics = unitSubtopics[unit].join(", ");

    if (!OPENAI_API_KEY) {
      setSuggestion("⚠️ Error: Missing API key. Please check your configuration.");
      setLoading(false);
      return;
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI tutor creating structured learning materials for Python students." },
          { 
            role: "user", 
            content: `The student scored ${studentScore}/100 in '${unit}'.
            Suggest content covering **${difficultyLevel}** difficulty levels. 
            Include all the following subtopics: **${subtopics}**.
            
            The module should include:
            1. **Concept Explanation**: Explain each subtopic step-by-step.
            2. **Multiple Code Examples**: At least 3 Python code snippets covering different subtopics.
            3. **Common Mistakes and Fixes**: Explain 2-3 mistakes students often make and how to fix them.
            4. **Exercises**: Provide ${exerciseCount} practice exercises with solutions.
            5. **Try It Online**: Provide a link to an online Python practice exercise.


            Use Markdown formatting with properly formatted code blocks (\`\`\`python ... \`\`\`).`
          }
        ],
        max_tokens: 2000, 
      });

      setSuggestion(response.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching content:", error);
      setSuggestion("⚠️ Error: Unable to generate learning content. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.unitSection}>
          <Typography className={styles.unitTitle}>Units</Typography>
          <div className={styles.unitButtonsContainer}>
            {Object.keys(unitVideos).map((unit, index) => (
              <Button
                key={unit}
                onClick={() => fetchSuggestion(unit)}
                className={`${styles.unitButton} ${selectedUnit === unit ? styles.activeUnit : ""}`}
              >
                {`Unit ${index + 1}: ${unit}`}
              </Button>
            ))}
          </div>
        </div>

        {/* 🔹 Tabs: Content & Video */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${selectedTab === "content" ? styles.activeTab : ""}`} 
            onClick={() => setSelectedTab("content")}
            disabled={!selectedUnit} 
          >
            Content Suggestion
          </button>
          <button 
            className={`${styles.tab} ${selectedTab === "video" ? styles.activeTab : ""}`} 
            onClick={() => setSelectedTab("video")}
            disabled={!selectedUnit} 
          >
            KU Video
          </button>
        </div>

        <div className={styles.contentWrapper}>
          {loading ? (
            <CircularProgress />
          ) : selectedTab === "content" ? (
            <Box className={styles.suggestionBox}>
              <ReactMarkdown
                children={suggestion}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return !inline ? (
                      <SyntaxHighlighter style={vscDarkPlus} language="python" {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              />
            </Box>
          ) : (
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

import React, { useState, useEffect } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import Navbar from "../components/navBar";
import styles from "../styles/Suggestion.module.css";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import unitVideos from "../data/videodata";
import unitSubtopics from "../data/unitdata";

// 📌 Fixed Mock Student Scores
const mockStudentScores = {
  "Sequential Program": 10,
  Subroutine: 20,
  Selection: 30,
  Repetition: 50,
  "File Input": 50,
  List: 80,
  "Numerical Processing": 80,
};

export default function SuggestionPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("content");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [suggestion, setSuggestion] = useState(
    "Select a unit to see the learning content."
  );
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState([]);
  const [error, setError] = useState(null);
  const studentId = "6410509012";

  useEffect(() => {
    console.log("Updated Video Index:", currentVideoIndex);
    console.log("Now Playing:", unitVideos[selectedUnit]?.[currentVideoIndex]);
  }, [currentVideoIndex]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/student-score/topic-wise/${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();

        const mergedScores = data.reduce((acc, item) => {
          const { round, topicName, totalQuestion, topicScore } = item;

          let existingRound = acc.find((entry) => entry.round === round);
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
    setCurrentVideoIndex(0);
    console.log(`Unit Selected: ${unit}`);
    console.log(`Total Videos for ${unit}:`, unitVideos[unit]?.length);

    let difficultyLevel =
      studentScore <= 30
        ? "easy, medium, and hard"
        : studentScore <= 60
        ? "medium and hard"
        : "hard";
    let exerciseCount =
      studentScore <= 30 ? "many" : studentScore <= 60 ? "some" : "few";

    // Get subtopics for the selected unit
    let subtopics = unitSubtopics[unit].join(", ");

    if (!OPENAI_API_KEY) {
      setSuggestion(
        "⚠️ Error: Missing API key. Please check your configuration."
      );
      setLoading(false);
      return;
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI tutor creating structured learning materials for Python students.",
          },
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


            Use Markdown formatting with properly formatted code blocks (\`\`\`python ... \`\`\`).`,
          },
        ],
        max_tokens: 2000,
      });

      setSuggestion(response.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching content:", error);
      setSuggestion(
        "⚠️ Error: Unable to generate learning content. Please try again later."
      );
    }
    setLoading(false);
  };

  return (
    <div style={{display: 'flex'}}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.unitSection}>
          <Typography className={styles.unitTitle}>Units</Typography>
          <div className={styles.unitButtonsContainer}>
            {Object.keys(unitVideos).map((unit, index) => (
              <Button
                key={unit}
                onClick={() => fetchSuggestion(unit)}
                className={`${styles.unitButton} ${
                  selectedUnit === unit ? styles.activeUnit : ""
                }`}
              >
                {`Unit ${index + 1}: ${unit}`}
              </Button>
            ))}
          </div>
        </div>

        {/* 🔹 Tabs: Content & Video */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${
              selectedTab === "content" ? styles.activeTab : ""
            }`}
            onClick={() => setSelectedTab("content")}
            disabled={!selectedUnit}
          >
            Content Suggestion
          </button>
          <button
            className={`${styles.tab} ${
              selectedTab === "video" ? styles.activeTab : ""
            }`}
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
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language="python"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </Box>
          ) : (
            <div className={styles.videoContainer}>
              <Typography variant="h6">{selectedUnit} Video</Typography>

              {/* 🔹 Get current video object */}
              {unitVideos[selectedUnit] &&
                unitVideos[selectedUnit][currentVideoIndex] && (
                  <>
                    <Typography
                      variant="subtitle1"
                      className={styles.videoTitle}
                    >
                      {unitVideos[selectedUnit][currentVideoIndex].title}
                    </Typography>

                    {/* 🔹 Render YouTube Videos as <iframe> */}
                    {unitVideos[selectedUnit][currentVideoIndex].type ===
                    "youtube" ? (
                      <iframe
                        width="80%"
                        height="400"
                        src={`https://www.youtube.com/embed/${unitVideos[selectedUnit][currentVideoIndex].url}`}
                        title={
                          unitVideos[selectedUnit][currentVideoIndex].title
                        }
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      /* 🔹 Render MP4 Videos as <video> */
                      <video key={currentVideoIndex} width="80%" controls>
                        <source
                          src={unitVideos[selectedUnit][currentVideoIndex].url}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {/* 🔹 Video Navigation */}
                    <div className={styles.videoNavigation}>
                      <Button
                        onClick={() =>
                          setCurrentVideoIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={currentVideoIndex === 0}
                        className={styles.navButton}
                      >
                        ⬅️ Previous
                      </Button>

                      <Button
                        onClick={() =>
                          setCurrentVideoIndex((prev) =>
                            Math.min(
                              prev + 1,
                              unitVideos[selectedUnit]?.length - 1
                            )
                          )
                        }
                        disabled={
                          currentVideoIndex >=
                          unitVideos[selectedUnit]?.length - 1
                        }
                        className={styles.navButton}
                      >
                        Next ➡️
                      </Button>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

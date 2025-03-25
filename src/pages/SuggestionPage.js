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
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import axios from 'axios';


const renderers = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
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
};

export default function SuggestionPage() {
  const { username, round } = useParams(); // Extract username & round from URL
  const [studentScores, setStudentScores] = useState({});
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedSubtopicIndex, setSelectedSubtopicIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("content");
  const [suggestion, setSuggestion] = useState(
    "Select a unit to see the learning content."
  );
  const [quiz, setQuiz] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [fetchingScores, setFetchingScores] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  useEffect(() => {
    console.log("✅ Suggestion updated:", suggestion);
  }, [suggestion]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/student-score/topic-wise/${username}`
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from backend.");
        }

        // Find the specific round
        const roundData = data.find((item) => item.scheduleName === round);

        if (!roundData || !roundData.SectionData) {
          setStudentScores({});
        } else {
          // Extract topics and scores
          const formattedScores = {};
          Object.values(roundData.SectionData).forEach((section) => {
            Object.entries(section.scoreDetail).forEach(([_, topic]) => {
              formattedScores[topic.topicName] = topic.score;
            });
          });

          setStudentScores(formattedScores);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingScores(false);
      }
    };

    fetchScores();
  }, [username, round]);

  const fetchSuggestion = async (unit, subtopicIndex = 0) => {
    setLoading(true);
    setSelectedUnit(unit);
    setSelectedSubtopicIndex(subtopicIndex);
    setCurrentVideoIndex(0);
  
    const subtopic = unitSubtopics[unit]?.[subtopicIndex] || unit;
    const studentScore = studentScores[unit] || 0;
    console.log(studentScore);

    let difficultyLevel;
    if (studentScore < 40) {
      difficultyLevel = "Beginner";
    } else if (studentScore < 75) {
      difficultyLevel = "Intermediate";
    } else {
      difficultyLevel = "Advanced";
    }

    const exerciseCount = studentScore < 50 ? 5 : 3;

    const prompt = `
    The student scored ${studentScore}/100 in '${unit}'.
    Suggest content in the '${subtopic}' covering **${difficultyLevel}** difficulty levels.
    ### Important Rules:
    - Do NOT include greetings like "Certainly!", "Sure!", "Here is your outline...", etc.

    The module should include:
    1. **Concept Explanation**: Explain each subtopic step-by-step.
    2. **Multiple Code Examples**: At least 3 Python code snippets covering different subtopics.
    3. **Common Mistakes and Fixes**: Explain 2-3 mistakes students often make and how to fix them.
    4. **Exercises**: Provide ${exerciseCount} practice exercises with solutions.
    5. **Solution**: Provide solutions with given exercises `;

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
            content: "You are an AI tutor providing structured Python lessons.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
      });
      setSuggestion(response.choices[0].message.content);

      const quizResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI quiz generator for Python lessons.",
          },
          {
            role: "user",
            content: `Generate a multiple-choice quiz with a correct answer for '${subtopic}'. Format as JSON {"question": "...", "options": ["A: ...", "B: ...", "C: ...", "D: ..."], "answer": "A"}`,
          },
        ],
        max_tokens: 500,
      });

      console.log("Quiz Response:", quizResponse.choices[0].message.content);

      const quizData = JSON.parse(quizResponse.choices[0].message.content);
      setQuiz(quizData);
      setCorrectAnswer(quizData.answer.trim().toUpperCase());
    } catch (error) {
      console.error("Error fetching content:", error);
      setSuggestion(
        "⚠️ Error: Unable to generate learning content. Please try again later."
      );
    }
    setLoading(false);
  };
  
  

  const handleAnswerSelection = (answer) => {
    if (answer.toUpperCase() === correctAnswer) {
      setUserAnswers((prev) => ({ ...prev, [selectedSubtopicIndex]: true }));
    } else {
      alert("Incorrect answer! Please try again.");
    }
  };
  const password = localStorage.getItem("password");

  return (
    <>
    {
                  password === '' ? (
                      <NotFound />
                  ) : (
      <div style={{ display: "flex" }}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.unitSection}>
            <Typography className={styles.unitTitle}>Units</Typography>
            <div className={styles.unitButtonsContainer}>
              {Object.keys(unitSubtopics).map((unit, index) => (
                <Button
                  key={unit}
                  onClick={() => fetchSuggestion(unit)}
                  className={`${styles.unitButton} ${
                    selectedUnit === unit ? styles.activeUnit : ""
                  }`}
                >
                  {`${unit}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Tabs: Content & Video */}
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

          {!selectedUnit ? (
            <div className={styles.unitPrompt}>
              Please select a unit to see the learning content.
            </div>
          ) : (
            <div>
              {selectedTab === "content" ? (
                <Box className={styles.suggestionBox}>
                  {loading ? (
                    <div className={styles.loadingContainer}>
                      ⏳ Generating content...
                    </div>
                  ) : (
                    <>
                      <ReactMarkdown components={renderers}>
                        {suggestion}
                      </ReactMarkdown>

                      {quiz && (
                        <Box className={styles.quizBox}>
                          <Typography variant="h6" className={styles.quizTitle}>
                            Quiz
                          </Typography>
                          <Typography className={styles.quizQuestion}>
                            {quiz.question}
                          </Typography>

                          <div className={styles.quizOptions}>
                            {quiz.options.map((option, index) => {
                              const isCorrect =
                                option.charAt(0).toUpperCase() ===
                                correctAnswer;
                              return (
                                <Button
                                  key={index}
                                  className={`${styles.quizButton} ${
                                    userAnswers[selectedSubtopicIndex] ===
                                    option.charAt(0)
                                      ? isCorrect
                                        ? styles.correctAnswer
                                        : styles.incorrectAnswer
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAnswerSelection(option.charAt(0))
                                  }
                                >
                                  {option}
                                </Button>
                              );
                            })}
                          </div>
                        </Box>
                      )}
                    </>
                  )}

                  <div className={styles.subtopicNavContainer}>
                    <button
                      className={`${styles.navButton} ${styles.prevButton}`}
                      disabled={selectedSubtopicIndex === 0}
                      onClick={() =>
                        fetchSuggestion(selectedUnit, selectedSubtopicIndex - 1)
                      }
                    >
                      ◀ Previous
                    </button>
                    <button
                      className={`${styles.navButton} ${styles.nextButton}`}
                      disabled={
                        !userAnswers[selectedSubtopicIndex] ||
                        selectedSubtopicIndex >=
                          unitSubtopics[selectedUnit].length - 1
                      }
                      onClick={() =>
                        fetchSuggestion(selectedUnit, selectedSubtopicIndex + 1)
                      }
                    >
                      Next ▶
                    </button>
                  </div>
                </Box>
              ) : (

                <div className={styles.videoContainer}>
                <Typography variant="h6">{selectedUnit} Video</Typography>
            
                {/* 🔹 Get current video object */}
                {unitVideos[selectedUnit] &&
                  unitVideos[selectedUnit][currentVideoIndex] && (
                    <>
                      <Typography variant="subtitle1" className={styles.videoTitle}>
                        {unitVideos[selectedUnit][currentVideoIndex].title}
                      </Typography>
            
                      {/* 🔹 Render YouTube Videos as <iframe> */}
                      {unitVideos[selectedUnit][currentVideoIndex].type === "youtube" ? (
                        <iframe
                          width="80%"
                          height="400"
                          src={`https://www.youtube.com/embed/${unitVideos[selectedUnit][currentVideoIndex].url}`}
                          title={unitVideos[selectedUnit][currentVideoIndex].title}
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
                          className={`${styles.navButton} ${styles.prevButton}`}
                        >
                      ◀ Previous
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
                          className={`${styles.navButton} ${styles.nextButton}`}
                        >
                      Next ▶
                        </Button>
                      </div>
                    </>
                  )}
              </div>
              )}
            </div>
          )}
        </div>
      </div>)
      }
    </>
  );
}
import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
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
import { FaRedoAlt } from "react-icons/fa";
import axios from "axios";

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
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `https://ku-review-backend-wvt2.vercel.app/student-score/topic-wise/${username}`
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

  const fetchSuggestion = async (
    unit,
    subtopicIndex = 0,
    autoDetect = true
  ) => {
    setLoading(true);
    setSelectedUnit(unit);
    setCurrentVideoIndex(0);

    const studentScore = studentScores[unit] || 0;
    const studentId = username;

    try {
      const suggestionRes = await fetch(
        `https://ku-review-backend-wvt2.vercel.app/suggest/${username}`
      );
      let allData = await suggestionRes.json();

      // 🧠 Handle case: backend returns message instead of array
      if (allData.message === "No records found") {
        console.warn("⚠️ Backend says: No records found. Generating new...");
        allData = []; // fallback to empty array
      } else if (!Array.isArray(allData)) {
        console.warn("⚠️ Unexpected response from /suggest:", allData);
        allData = [];
      }

      const filtered = allData.filter(
        (item) => item.unit === unit && item.round === round
      );

      let selectedRecord = null;
      if (filtered.length > 0) {
        const incomplete = filtered.find(
          (item) => item.status === "incomplete"
        );
        selectedRecord =
          incomplete ||
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
      }

      // ✅ Set subtopic from selectedRecord only if autoDetect is true
      let subtopic = unitSubtopics[unit]?.[subtopicIndex] || unit;
      if (autoDetect && selectedRecord) {
        subtopic = selectedRecord.subtopic;
        const index = unitSubtopics[unit].findIndex((s) => s === subtopic);
        subtopicIndex = index !== -1 ? index : 0;
      }

      setSelectedSubtopicIndex(subtopicIndex);

      const matched = allData.find(
        (item) =>
          item.round === round &&
          item.unit === unit &&
          item.subtopic === subtopic
      );
      if (matched?.status === "complete") {
        setUserAnswers((prev) => ({
          ...prev,
          [subtopicIndex]:
            matched.quiz?.answer?.charAt(0).toUpperCase() || true,
        }));
      }

      if (matched) {
        if (matched?.status === "complete") {
          // ✅ Auto mark as answered so "Next" is enabled
          setUserAnswers((prev) => ({
            ...prev,
            [subtopicIndex]:
              matched.quiz?.answer?.charAt(0).toUpperCase() || true,
          }));
        }
      }

      if (matched) {
        setSuggestion(matched.content);
        setQuiz(matched.quiz);
        setCorrectAnswer(matched.quiz?.answer?.trim().toUpperCase());
      } else {
        // No record found  Generate new content
        setSuggestion("⏳ Generating content...");

        let difficultyLevel;
        if (studentScore < 40) difficultyLevel = "Beginner";
        else if (studentScore < 75) difficultyLevel = "Intermediate";
        else difficultyLevel = "Advanced";

        const exerciseCount = studentScore < 50 ? 5 : 3;

        const prompt = `
  The student scored ${studentScore}/100 in '${unit}'.
  Suggest content in the '${subtopic}' covering **${difficultyLevel}** difficulty levels.
  ### Important Rules:
  - Do NOT include greetings like "Certainly!", "Sure!", etc.
  
  The module should include:
  1. **Concept Explanation**
  2. **Multiple Code Examples**
  3. **Common Mistakes and Fixes**
  4. **Exercises** (${exerciseCount})
  5. **Solution** for those exercises
        `;
        const promt2 = `Generate a multiple-choice quiz with a correct answer for '${subtopic}'. Format as JSON {"question": "...", "options": ["A: ...", "B: ...", "C: ...", "D: ..."], "answer": "A" or "B" or "C" or "D"}`;

        const openai = new OpenAI({
          apiKey: OPENAI_API_KEY,
          dangerouslyAllowBrowser: true,
        });
        const mes = [
          { role: "system", content: "You are an AI tutor for Python." },
          { role: "user", content: prompt },
        ];

        const mes2 = [
          { role: "system", content: "You are an AI quiz generator." },
          {
            role: "user",
            content: promt2,
          },
        ];
        console.time("openai");
        // เรียก GPT ทั้ง content และ quiz พร้อมกัน
        const [contentRes, quizRes] = await Promise.all([
          openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: mes,
            max_tokens: 1500,
          }),
          openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: mes2,
            max_tokens: 500,
          }),
        ]);
        console.timeEnd("openai");
        const generatedContent = contentRes.choices[0].message.content;

        const generatedQuiz = JSON.parse(quizRes.choices[0].message.content);
        const answer = generatedQuiz.answer.trim().toUpperCase();

        setSuggestion(generatedContent);
        setQuiz(generatedQuiz);
        setCorrectAnswer(answer);
        setLoading(false);

// Save suggestion async
setTimeout(async () => {
  try {
    await axios.post(`https://ku-review-backend-wvt2.vercel.app/suggest`, {
      studentId,
      round,
      unit,
      subtopic,
      content: generatedContent,
      quiz: generatedQuiz,
    });
  } catch (err) {
    console.error("❌ Failed to save suggestion:", err);
  }
}, 0);

        // ✅ Confirm it's saved
        const confirmRes = await fetch(
          `https://ku-review-backend-wvt2.vercel.app/suggest/${username}`
        );
        const confirmData = await confirmRes.json();
        const confirmMatch = confirmData.find(
          (item) =>
            item.round === round &&
            item.unit === unit &&
            item.subtopic === subtopic
        );

        if (confirmMatch) {
          setSuggestion(confirmMatch.content);
          setQuiz(confirmMatch.quiz);
          setCorrectAnswer(confirmMatch.quiz?.answer?.trim().toUpperCase());
        } else {
          console.warn("⚠️ Couldn't confirm save, fallback to generated");
          setSuggestion(generatedContent);
          setQuiz(generatedQuiz);
          setCorrectAnswer(answer);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching or generating content:", err);
      setSuggestion("⚠️ Error: Unable to fetch or generate content.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelection = (answer) => {
    if (answer.toUpperCase() === correctAnswer) {
      setUserAnswers((prev) => ({ ...prev, [selectedSubtopicIndex]: true }));
    } else {
      alert("Incorrect answer! Please try again.");
    }
  };
  const handleNextSubtopic = async () => {
    try {
      await fetch(
        `https://ku-review-backend-wvt2.vercel.app/suggest/${username}/${round}/${selectedUnit}/${unitSubtopics[selectedUnit][selectedSubtopicIndex]}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("❌ Failed to update progress status:", err);
    }

    fetchSuggestion(selectedUnit, selectedSubtopicIndex + 1, false); // ✅ use false
  };

  const handleRedoUnit = async () => {
    if (!selectedUnit) return;

    const confirm = window.confirm(
      `Are you sure you want to redo ${selectedUnit}? This will delete existing progress.`
    );

    if (!confirm) return;

    try {
      const res = await fetch(
        `https://ku-review-backend-wvt2.vercel.app/suggest-delete/${username}/${round}/${selectedUnit}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Failed to delete suggestions.");
      }

      alert(`Progress for ${selectedUnit} has been reset.`);
      setSuggestion("Select a unit to see the learning content.");
      setQuiz(null);
      setCorrectAnswer(null);
      setUserAnswers({});
      setSelectedSubtopicIndex(0);
      setSelectedUnit(null);
    } catch (err) {
      console.error("❌ Redo failed:", err);
      alert("An error occurred while trying to redo the unit.");
    }
  };

  const password = localStorage.getItem("password");

  return (
    <>
      {password === "" ? (
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
                    onClick={() => fetchSuggestion(unit, 0, true)}
                    className={`${styles.unitButton} ${
                      selectedUnit === unit ? styles.activeUnit : ""
                    }`}
                  >
                    {`${unit}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tabs: Content & Video + Redo */}
            <div
              className={styles.tabContainer}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
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

              {selectedUnit && (
                <button
                  onClick={handleRedoUnit}
                  style={{
                    backgroundColor: "#b66136",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    marginRight: "16px",
                    marginBottom: "10px",
                  }}
                >
                  <FaRedoAlt />
                  Redo all contents in {selectedUnit}
                </button>
              )}
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography className={styles.pageNumber}>
                            Page {selectedSubtopicIndex + 1} /{" "}
                            {unitSubtopics[selectedUnit]?.length}
                          </Typography>
                        </div>

                        <ReactMarkdown components={renderers}>
                          {suggestion}
                        </ReactMarkdown>

                        {quiz && (
                          <Box className={styles.quizBox}>
                            <Typography
                              variant="h6"
                              className={styles.quizTitle}
                            >
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
                        onClick={
                          () =>
                            fetchSuggestion(
                              selectedUnit,
                              selectedSubtopicIndex - 1,
                              false
                            ) // <- ❌ No auto detect!
                        }
                      >
                        ◀ Previous
                      </button>
                      <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        disabled={
                          (quiz && !userAnswers[selectedSubtopicIndex]) || // ✅ ต้องตอบ quiz ถ้ามี
                          selectedSubtopicIndex >=
                            unitSubtopics[selectedUnit].length - 1
                        }
                        onClick={handleNextSubtopic}
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
                                unitVideos[selectedUnit][currentVideoIndex]
                                  .title
                              }
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            /* 🔹 Render MP4 Videos as <video> */
                            <video key={currentVideoIndex} width="80%" controls>
                              <source
                                src={
                                  unitVideos[selectedUnit][currentVideoIndex]
                                    .url
                                }
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}

                          {/* 🔹 Video Navigation */}
                          <div className={styles.videoNavigation}>
                            <Button
                              onClick={() =>
                                setCurrentVideoIndex((prev) =>
                                  Math.max(prev - 1, 0)
                                )
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
        </div>
      )}
    </>
  );
}

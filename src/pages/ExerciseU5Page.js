import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navBar";
import unitSubtopics from "../data/unitdata";
import styles from "../styles/Suggestion.module.css";
import generateQuestions from "../components/generateQuestions";
import { getImprovementSuggestion } from "../components/improvementGPT";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { FaRedoAlt } from "react-icons/fa";


const ExerciseU5Page = () => {
  const unitKey = "05-Selection";
  const { username } = useParams(); // Extract from URL
  const studentId = username;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(true);
  const [suggestion, setSuggestion] = useState(null);
  const hasFetched = useRef(false);
  const hasSubmitted = useRef(false);
  const [loading, setLoading] = useState(false); // 🆕 new state

  const fetchQuestions = async () => {
    const allTopics = unitSubtopics[unitKey];
    let selectedSubtopics = [];

    if (allTopics.length >= 10) {
      selectedSubtopics = allTopics
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
    } else {
      selectedSubtopics = [...allTopics];
      while (selectedSubtopics.length < 10) {
        const rand = allTopics[Math.floor(Math.random() * allTopics.length)];
        selectedSubtopics.push(rand);
      }
    }

    const result = await generateQuestions(unitKey, selectedSubtopics);
    setQuestions(result);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchInitialData = async () => {
      const res = await fetch(
        `http://localhost:3000/exercise/score/${studentId}`
      );
      const data = await res.json();

      if (data.message === "No records found") {
        fetchQuestions();
      } else {
        const current = await fetch(
          `http://localhost:3000/exercise/current/${studentId}/${unitKey}`
        );
        const currentData = await current.json();

        if (currentData.length > 0) {
          const answerNKey = currentData[0].answerNKey;
          const storedSuggestion = currentData[0].analytic;

          setQuestions(answerNKey);
          setUserAnswers(answerNKey.map((a) => a.userAnswer));
          setSuggestion(storedSuggestion || null);
          setShowResult(true);
        } else {
          fetchQuestions();
        }
      }
    };

    fetchInitialData();
  }, [studentId]);

  useEffect(() => {
    if (!showResult || !questions.length || suggestion !== null) return;

    const wrongAnswers = questions
      .map((q, idx) => ({
        subtopic: q.subtopic,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswers[idx],
      }))
      .filter((entry) => entry.correctAnswer !== entry.userAnswer);

    if (wrongAnswers.length === 0) {
      setSuggestion("🎉 Great job! You got all answers correct.");
      return;
    }

    getImprovementSuggestion(wrongAnswers, unitKey).then((msg) => {
      setSuggestion(msg);
    });
  }, [showResult, questions, userAnswers, suggestion, unitKey]);

  const handleAnswer = (option) => {
    const updated = [...userAnswers];
    updated[currentIndex] = option;
    setUserAnswers(updated);
    setFade(false);

    setTimeout(() => {
      if (currentIndex < 9) {
        setCurrentIndex(currentIndex + 1);
        setFade(true);
      } else {
        // 🔥 Wait a moment to make sure last answer is set before submitting
        setTimeout(() => {
          handleSubmit(updated); // 👈 ส่ง updated ไปแทนการดึงจาก state
        }, 100);
      }
    }, 300);
  };

  const calculateScore = () => {
    return questions.reduce((score, q, idx) => {
      return q.correctAnswer === userAnswers[idx] ? score + 10 : score;
    }, 0);
  };
  const handleSubmit = async (finalAnswers = userAnswers) => {
    if (hasSubmitted.current || !questions || questions.length === 0) return;
    hasSubmitted.current = true;
  
    const score = questions.reduce((acc, q, idx) => {
      return q.correctAnswer === finalAnswers[idx] ? acc + 10 : acc;
    }, 0);
  
    const answerNKey = questions.map((q, idx) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: finalAnswers[idx],
    }));
  
    const wrongAnswers = questions
      .map((q, idx) => ({
        subtopic: q.subtopic,
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: finalAnswers[idx],
      }))
      .filter((entry) => entry.correctAnswer !== entry.userAnswer);
  
    let suggestionText = "🎉 Great job! You got all answers correct.";
    if (wrongAnswers.length > 0) {
      try {
        suggestionText = await getImprovementSuggestion(wrongAnswers, unitKey);
      } catch (e) {
        console.warn("❌ Failed to get suggestion:", e);
      }
    }
  
    setSuggestion(suggestionText);
  
    const unitNumber = parseInt(unitKey.split("-")[0], 10);
    let round = 1;
    let isFirstRound = true;
    let targetDocId = null;
  
    try {
      const scoreRes = await fetch(`http://localhost:3000/exercise/score/${studentId}`);
      const scoreData = await scoreRes.json();
  
      if (scoreData.message === "No records found") {
        // First time for this student → POST new doc
        await fetch("http://localhost:3000/exercise/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            scoreData: [{ round: 1, unit: unitNumber, score }],
          }),
        });
      } else if (Array.isArray(scoreData)) {
        const allScores = scoreData.flatMap((doc) =>
          (doc.scoreData || []).map((entry) => ({
            ...entry,
            _id: doc._id,
          }))
        );
  
        const thisUnitScores = allScores.filter((s) => s.unit === unitNumber);
        const validRounds = thisUnitScores
          .map((s) => s.round)
          .filter((r) => typeof r === "number" && !isNaN(r));
  
        round = validRounds.length > 0 ? Math.max(...validRounds) + 1 : 1;
        isFirstRound = validRounds.length === 0;
  
        // 🔍 Choose doc to update by same studentId
        const found = scoreData.find((doc) =>
          doc.studentId === studentId &&
          doc.scoreData.some((s) => s.unit === unitNumber)
        );
  
        targetDocId = found ? found._id : scoreData[0]._id;
  
        // ⬆️ PUT to existing document
        await fetch(`http://localhost:3000/exercise/score/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newScoreData: { round, unit: unitNumber, score },
          }),
        });
      }
    } catch (err) {
      console.warn("❌ Error saving score:", err);
    }
  
    // 🧠 Save to currentExercise
    const currentPayload = {
      studentId,
      unit: unitKey,
      score,
      answerNKey,
      analytic: suggestionText,
    };
  
    try {
      if (isFirstRound) {
        await fetch("http://localhost:3000/exercise/current", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentPayload),
        });
      } else {
        await fetch(`http://localhost:3000/exercise/current/${studentId}/${unitKey}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentPayload),
        });
      }
    } catch (err) {
      console.warn("❌ Error saving currentExercise:", err);
    }
  
    setShowResult(true);
  };
  
  const handleRedoQuiz = async () => {
    setLoading(true); // ⏳ Start loading
    setCurrentIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setSuggestion(null);
    setFade(true);
    hasSubmitted.current = false;

    await fetchQuestions(); // 🆕 Load new questions for redo
    setLoading(false);
  };

  if (!questions.length) {
    return (
      <div style={{ display: "flex" }}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <div className={styles.container}>
        <Typography variant="h5" className={styles.unitTitle}>
          Unit: {unitKey}
        </Typography>

        {loading ? (
          <div className={styles.loadingContainer}>
            <CircularProgress />
          </div>
        ) : !showResult && questions[currentIndex] ? (
          <Box
            className={`${styles.quizBox} ${
              fade ? styles["fade-active"] : styles["fade-enter"]
            }`}
          >
            <Typography
              variant="body2"
              style={{
                marginTop: "12px",
                fontStyle: "italic",
                color: "#666",
                textAlign: "center",
              }}
            >
              📌 Please note: You can only answer each question once. No changes
              allowed after selection.
            </Typography>
            <div style={{ textAlign: "right", marginBottom: "5px" }}>
              <Typography
                variant="body2"
                style={{ fontStyle: "italic", color: "#888" }}
              >
                Subtopic: {questions[currentIndex].subtopic}
              </Typography>
            </div>
            <Typography variant="h6" className={styles.quizTitle}>
              Question {currentIndex + 1} / 10
            </Typography>

            <Typography className={styles.quizQuestion}>
              {questions[currentIndex].question}
            </Typography>

            <div className={styles.quizOptions}>
              {questions[currentIndex].options.map((option, idx) => (
                <Button
                  key={idx}
                  className={styles.quizButton}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </Box>
        ) : (
          <>
            <Typography
              variant="h6"
              style={{
                fontFamily: "Nunito",
                fontSize: "20px",
                fontWeight: "400",
                marginBottom: "10px",
              }}
            >
              Your score:
            </Typography>
            <Typography
              style={{
                fontFamily: "Nunito",
                fontSize: "80px",
                fontWeight: "900",
                color: "#1b3d1a",
                marginBottom: "20px",
              }}
            >
              {calculateScore()} / 100
            </Typography>
            <div style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  fontFamily: "Nunito",
                  marginBottom: "20px",
                  textTransform: "none",
                  background: "#b66136",
                }}
                onClick={handleRedoQuiz}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "15px",
                  }}
                >
                  <FaRedoAlt />
                  Redo Exercise
                </span>
              </Button>
            </div>

            {suggestion && (
              <Box
                className={styles.suggestionBox1}
                style={{ marginTop: "20px" }}
              >
                <Typography variant="h6">🧠 What to Improve</Typography>
                <Typography>{suggestion}</Typography>
              </Box>
            )}

            {questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctAnswer;
              return (
                <Box
                  key={idx}
                  className={styles.quizBox}
                  style={{
                    borderLeft: `6px solid ${
                      isCorrect ? "#2e7d32" : "#d32f2f"
                    }`,
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      fontStyle: "italic",
                      textAlign: "right",
                      color: "#888",
                      marginBottom: "5px",
                    }}
                  >
                    Subtopic: {q.subtopic}
                  </Typography>
                  <Typography className={styles.quizQuestion}>
                    {idx + 1}. {q.question}
                  </Typography>
                  <Typography>
                    <strong>Your answer:</strong>{" "}
                    <span
                      style={{
                        color: isCorrect ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {userAnswers[idx]}
                    </span>
                  </Typography>
                  <Typography>
                    <strong>Correct answer:</strong> {q.correctAnswer}
                  </Typography>
                  <Typography className="text-sm text-gray-700 mt-1 italic">
                    {q.explanation}
                  </Typography>
                </Box>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ExerciseU5Page;

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/navBar";
import unitSubtopics from "../data/unitdata";
import styles from "../styles/Suggestion.module.css";
import generateQuestions from "../components/generateQuestions";
import { getImprovementSuggestion } from "../components/improvementGPT";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { FaRedoAlt } from "react-icons/fa";


const ExerciseU7Page = () => {
  const unitKey = "07-List";
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(true);
  const [suggestion, setSuggestion] = useState(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

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

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!showResult || !questions.length) return;

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
  }, [showResult, questions, userAnswers, unitKey]);

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
        setShowResult(true);
      }
    }, 300);
  };

  const calculateScore = () => {
    return questions.reduce((score, q, idx) => {
      return q.correctAnswer === userAnswers[idx] ? score + 10 : score;
    }, 0);
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

        {!showResult ? (
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
  📌 Please note: You can only answer each question once. No changes allowed after selection.
</Typography>

            <Typography
              variant="body2"
              style={{
                fontStyle: "italic",
                textAlign: "right",
                alignSelf: "flex-end",
                color: "#888",
                marginBottom: "5px",
              }}
            >
              Subtopic: {questions[currentIndex].subtopic}
            </Typography>

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
    style={{ fontFamily: "Nunito", fontSize: "20px", fontWeight: "400", marginBottom: "10px" }}
  >
    Your score:
  </Typography>

  <Typography
    style={{
      fontFamily: "Nunito",
      fontSize: "80px",
      fontWeight: "900",
      color: "#1b3d1a", // dark green tone
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
      background: "#b66136"
    }}
    // onClick={handleRedoQuiz}
  >
  <span style={{ display: "flex", alignItems: "center", gap: "8px",fontSize: "15px"  }}>
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
                      alignSelf: "flex-end",
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

export default ExerciseU7Page;

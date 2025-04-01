import { useState, useEffect } from "react";
import CountDownPanel from "../components/CountDownPanel";
import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";
import styles from "../styles/Score.module.css";
import { useParams, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import StudyProgress from "../components/StudyProgress";
import { Dropdown } from "rsuite";

export default function ScorePage() {
  const [score, setScore] = useState([]);
  const [currentScore, setCurrentScore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testDate, setTestDate] = useState(null);
  const courseName = "01204111 Computer and Programming";
  const { username } = useParams();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(`/suggest/${username}/comproExamR1`);
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          `https://ku-review-backend-wvt2.vercel.app/student-score/topic-wise/${username}`
        );
        const data = await response.json();

        const processedRounds = data.map((round) => {
          const {
            scheduleName,
            SectionData,
            UserTestStartDate,
            UserTestStartTime,
          } = round;

          let totalScore = 0;
          let totalQuestions = 0;
          const topics = [];

          if (Object.keys(SectionData).length === 0) {
            const combinedDateTimeString = `${UserTestStartDate}T${UserTestStartTime}`;
            setTestDate(combinedDateTimeString);
          } else {
            setTestDate(null);
          }

          Object.values(SectionData).forEach((section) => {
            const { scoreDetail, maxScore } = section;

            totalQuestions += maxScore;

            Object.entries(scoreDetail).forEach(([topicKey, topicValue]) => {
              topics.push({
                topicName: topicValue.topicName,
                topicScore: topicValue.topicScore,
                totalQuestions: topicValue.totalQuestions,
              });

              totalScore += topicValue.topicScore;
            });
          });

          return {
            round: scheduleName,
            totalScore: totalScore,
            totalQuestions: totalQuestions,
            scoreDetails: topics,
          };
        });

        setScore(processedRounds);
        setCurrentScore(score[0]);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error(err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    return;
  }, [username, navigate]);

  const password = localStorage.getItem("password");

  useEffect(() => {
    if (score.length > 0) {
      setCurrentScore(score[0]);
    }
  }, [score]);

  const handleDropdown = (e) => {
    const index = e - 1;
    const selectedScore = score[index];

    if (selectedScore) {
      setCurrentScore(selectedScore);
    }
  };

  return (
    <>
      {password === "" ? (
        <NotFound />
      ) : (
        <div style={{ display: "flex" }}>
          <Navbar />
          <div className={styles["content-container"]}>
            <div className={styles["content-panel"]}>
              {testDate ? (
                <CountDownPanel date={testDate} />
              ) : (
                <div style={{ marginTop: "5rem" }}>
                  <h3 style={{ fontSize: "75px", lineHeight: "normal" }}>
                    Start Strong
                  </h3>
                  <p style={{ textAlign: "left" }}>
                    Key Topics You Should Focus On
                  </p>
                  <button
                    className={styles["btn-pre-suggest"]}
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </button>
                </div>
              )}
              <div className={styles["sec-panel"]}>
                <div className={styles["score-container"]}>
                  <div className={styles["header"]}>
                    <h3>{courseName}</h3>
                  </div>
                  <Dropdown title="Round" trigger={["click"]}>
                    <Dropdown.Item eventKey={1} onSelect={handleDropdown}>
                      Round 1
                    </Dropdown.Item>
                    <Dropdown.Item eventKey={2} onSelect={handleDropdown}>
                      Round 2
                    </Dropdown.Item>
                    <Dropdown.Item eventKey={3} onSelect={handleDropdown}>
                      Round 3
                    </Dropdown.Item>
                  </Dropdown>
                  <div className={styles["score-box"]}>
                    {score.length > 0 && currentScore ? (
                      <ScoreBox
                        round={currentScore.round}
                        score={currentScore}
                        username={username}
                      />
                    ) : (
                      <p>No scores available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles["study-progress"]}>
              <StudyProgress />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

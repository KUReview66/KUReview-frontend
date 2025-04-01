import { useState, useEffect } from "react";
import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Navbar from "../components/navBar";
import styles from "../styles/Profile.module.css";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

export default function ProfilePage() {
  const { username } = useParams();
  const [round, setRound] = useState("");
  const [score, setScore] = useState([]);
  const [unit, setUnit] = useState([]);
  const [unitScore, setUnitScore] = useState([]);
  const [studentInfo, setStudentInfo] = useState("");
  const [avgPerUnit, setAvgPerUnit] = useState([]);
  const [minPerUnit, setMinPerUnit] = useState([]);
  const [maxPerUnit, setMaxPerUnit] = useState([]);
  const [unitLabels, setUnitLabels] = useState([]);
  const [roundStats, setRoundStats] = useState({});
  const [allTopicStats, setAllTopicStats] = useState({});

  const fetchClassStatistics = async () => {
    try {
      const response = await fetch("https://ku-review-backend-wvt2.vercel.app/score/statistic/64");
      const result = await response.json();

      const examData = result.data;

      setAllTopicStats({
        comproExamR1: examData.comproExamR1?.topicStatistics || {},
        comproExamR2: examData.comproExamR2?.topicStatistics || {},
        comproExamR3: examData.comproExamR3?.topicStatistics || {},
      });

      setRoundStats({
        comproExamR1: examData.comproExamR1?.totalScoreStatistics || {},
        comproExamR2: examData.comproExamR2?.totalScoreStatistics || {},
        comproExamR3: examData.comproExamR3?.totalScoreStatistics || {},
      });
    } catch (error) {
      console.error("❌ Error fetching class statistics:", error);
    }
  };

  useEffect(() => {
    if (!round || !allTopicStats) return;

    const examKey = getExamKey(round); // e.g., "comproExamR1"
    const topics = allTopicStats[examKey] || {};

    const unitNames = [
      "02-Basic",
      "03-Subroutine",
      "05-Selection",
      "06-Repetition",
      "07-List",
      "08-File",
      "09-Numpy",
    ];

    const avg = [];
    const min = [];
    const max = [];

    unitNames.forEach((unit) => {
      const stat = topics[unit];
      avg.push(stat ? stat.average.toFixed(2) : 0);
      min.push(stat ? stat.min : 0);
      max.push(stat ? stat.max : 0);
    });

    setAvgPerUnit(avg);
    setMinPerUnit(min);
    setMaxPerUnit(max);
    setUnitLabels(unitNames);
  }, [round, allTopicStats]);

  useEffect(() => {
    if (!username) {
      console.error("Username is missing!");
      return;
    }

    const fetchScores = async () => {
      try {
        const response = await fetch(
          `https://ku-review-backend-wvt2.vercel.app/student-score/topic-wise/${username}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();

        const processedRounds = data.map((round) => {
          const { scheduleName, SectionData } = round;

          let totalScore = 0;
          let totalQuestions = 0;
          const topics = [];

          Object.values(SectionData).forEach((section) => {
            const { scoreDetail, maxScore } = section;
            totalQuestions += maxScore;

            Object.entries(scoreDetail).forEach(([_, topicValue]) => {
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
            totalScore,
            totalQuestions,
            scoreDetails: topics,
          };
        });

        setScore(processedRounds);

        if (!round && processedRounds.length > 0) {
          setRound(processedRounds[0].round);
          updateChart(processedRounds[0]);
        }
      } catch (err) {
        console.error("❌ Error fetching scores:", err);
      }
    };

    const fetchStudentInfo = async () => {
      try {
        const res = await fetch(
          `https://ku-review-backend-wvt2.vercel.app/studentInfo/${username}`
        );
        const data = await res.json();
        const student = data[0]?.data?.user?.student;

        if (student) {
          setStudentInfo({
            firstNameEn: student.firstNameEn,
            lastNameEn: student.lastNameEn,
            facultyNameEn: student.facultyNameEn,
            majorNameEn: student.majorNameEn,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching student info:", err);
      }
    };
    fetchStudentInfo();
    fetchScores();
    fetchClassStatistics();
  }, [username]);
  const updateChart = (roundData) => {
    if (roundData) {
      setUnit(roundData.scoreDetails.map((topic) => topic.topicName));
      setUnitScore(roundData.scoreDetails.map((topic) => topic.topicScore));
    } else {
      setUnit([]);
      setUnitScore([]);
    }
  };

  const handleRoundChange = (event) => {
    const selectedRound = event.target.value;
    setRound(selectedRound);

    const currentRoundData = score.find(
      (entry) => entry.round === selectedRound
    );
    if (currentRoundData) {
      updateChart(currentRoundData);
    } else {
      console.warn("⚠️ No data found for selected round:", selectedRound);
    }
  };

  const password = localStorage.getItem("password");
  const getExamKey = (roundName) => {
    if (!roundName) return null;
    const match = roundName.match(/R\d+/); // ดึงแค่ R1, R2, ...
    return match ? `comproExam${match[0]}` : null;
  };

  return (
    <>
      {password === "" ? (
        <NotFound />
      ) : (
        <div className={styles.container}>
          <Navbar />

          <div className={styles.flexContainer}>
            <div className={styles.leftColumn}>
              <div className={styles.profileImage}>
                <img
                  src="/userprofile.png"
                  alt="User Profile"
                  className={styles.profileImg}
                />
              </div>

              <div className={styles.userInfo}>
                <div className={styles.username}>{username}</div>
                <>
                  <div className={styles.userInfoText}>
                    {studentInfo.firstNameEn} {studentInfo.lastNameEn}
                  </div>
                  <div className={styles.userInfoText}>
                    {studentInfo.facultyNameEn}
                  </div>
                  <div className={styles.userInfoText}>
                    {studentInfo.majorNameEn}
                  </div>
                </>
              </div>

              {/* Round Selector */}
              <div className={styles.roundSelector}>
                <FormControl variant="filled">
                  <InputLabel id="round-select-label">Round</InputLabel>
                  <Select
                    labelId="round-select-label"
                    id="round-select"
                    value={round}
                    onChange={handleRoundChange}
                  >
                    {score.map((entry) => (
                      <MenuItem key={entry.round} value={entry.round}>
                        {entry.round}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.chartSection}>
                <div className={styles.statisticsTitle}>Statistics</div>
                <div className={styles.compareButton}>
                  Score Compare with Average
                </div>

                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <div
                      className={styles.colorBox}
                      style={{ backgroundColor: "#02B2AF" }}
                    ></div>
                    <span>Student score</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div
                      className={styles.colorBox}
                      style={{ backgroundColor: "#2E96FF" }}
                    ></div>
                    <span>Average</span>
                  </div>
                </div>

                {unit.length > 0 && unitScore.length > 0 && (
                  <BarChart
                    series={[
                      {
                        name: "Student Score",
                        data: unitScore,
                        color: "#02B2AF",
                      },
                      {
                        name: "Class Average",
                        data: avgPerUnit,
                        color: "#2E96FF",
                      },
                    ]}
                    height={290}
                    xAxis={[{ data: unit, scaleType: "band" }]}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                  />
                )}
              </div>

              <Paper className={styles.scoreInfo}>
                <div className={styles.scoreText}>
                  <strong>Your score:</strong>{" "}
                  {score.find((entry) => entry.round === round)?.totalScore ||
                    "N/A"}{" "}
                  / 100
                </div>
                <div className={styles.scoreText}>
                  <strong>Mean:</strong>{" "}
                  {roundStats[getExamKey(round)]?.average ?? "N/A"}
                </div>
                <div className={styles.scoreText}>
                  <strong>Max:</strong>{" "}
                  {roundStats[getExamKey(round)]?.max ?? "N/A"}
                </div>
                <div className={styles.scoreText}>
                  <strong>Min:</strong>{" "}
                  {roundStats[getExamKey(round)]?.min ?? "N/A"}
                </div>
                <div className={styles.scoreText}>
                  <strong>SD:</strong>{" "}
                  {roundStats[getExamKey(round)]?.standardDeviation?.toFixed(
                    2
                  ) ?? "N/A"}
                </div>
              </Paper>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

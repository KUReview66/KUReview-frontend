import { useState, useEffect } from "react";
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Navbar from "../components/navBar";
import styles from '../styles/Profile.module.css'; 
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

const fetchClassStatistics = async () => {
  try {
    const response = await fetch('http://localhost:3000/score/statistic/64');
    const result = await response.json();

    const examData = result.data;
    const rounds = ["comproExamR1", "comproExamR2"];
    const unitNames = [
      "02-Basic", "03-Subroutine", "05-Selection",
      "06-Repetition", "07-List", "08-File", "09-Numpy"
    ];

    const unitAverages = [];
    const unitMins = [];
    const unitMaxs = [];

    unitNames.forEach(unit => {
      let avgSum = 0, count = 0;
      let minScores = [], maxScores = [];

      rounds.forEach(round => {
        const unitData = examData[round][unit];
        if (unitData) {
          avgSum += unitData.average;
          count++;
          minScores.push(unitData.min);
          maxScores.push(unitData.max);
        }
      });

      unitAverages.push((avgSum / count).toFixed(2));
      minScores.length > 0 ? unitMins.push(Math.min(...minScores)) : unitMins.push(0);
      maxScores.length > 0 ? unitMaxs.push(Math.max(...maxScores)) : unitMaxs.push(0);
    });

    setAvgPerUnit(unitAverages);
    setMinPerUnit(unitMins);
    setMaxPerUnit(unitMaxs);
    setUnitLabels(unitNames);

  } catch (error) {
    console.error("❌ Error fetching class statistics:", error);
  }
};


  useEffect(() => {
    if (!username) {
      console.error("Username is missing!");
      return;
    }

    const fetchScores = async () => {
      try {
        const response = await fetch(`http://localhost:3000/student-score/topic-wise/${username}`);

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();


        const processedRounds = data.map(round => {
          const { scheduleName, SectionData } = round;

          let totalScore = 0;
          let totalQuestions = 0;
          const topics = [];

          Object.values(SectionData).forEach(section => {
            const { scoreDetail, maxScore } = section;
            totalQuestions += maxScore;

            Object.entries(scoreDetail).forEach(([_, topicValue]) => {
              topics.push({
                topicName: topicValue.topicName,
                topicScore: topicValue.topicScore,
                totalQuestions: topicValue.totalQuestions
              });
              totalScore += topicValue.topicScore;
            });
          });

          return {
            round: scheduleName,  
            totalScore,
            totalQuestions,
            scoreDetails: topics 
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
        const res = await fetch(`http://localhost:3000/studentInfo/${username}`);
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
      setUnit(roundData.scoreDetails.map(topic => topic.topicName));
      setUnitScore(roundData.scoreDetails.map(topic => topic.topicScore));
    } else {
      setUnit([]);
      setUnitScore([]);
    }
  };

  const handleRoundChange = (event) => {
    const selectedRound = event.target.value;
    setRound(selectedRound);

    const currentRoundData = score.find(entry => entry.round === selectedRound);
    if (currentRoundData) {
      updateChart(currentRoundData);
    } else {
      console.warn("⚠️ No data found for selected round:", selectedRound);
    }
  };

  const password = localStorage.getItem('password');

  return (
    <>
    {
        password === '' ? (
                      <NotFound />
                  ) : (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.flexContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.profileImage}>
            <img src="/userprofile.png" alt="User Profile" className={styles.profileImg} />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.username}>{username}</div>
            <>
                <div className={styles.userInfoText}>{studentInfo.firstNameEn} {studentInfo.lastNameEn}</div>
                <div className={styles.userInfoText}>{studentInfo.facultyNameEn}</div>
                <div className={styles.userInfoText}>{studentInfo.majorNameEn}</div>
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
                  <MenuItem key={entry.round} value={entry.round}>{entry.round}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.chartSection}>
            <div className={styles.statisticsTitle}>Statistics</div>
            <div className={styles.compareButton}>Score Compare with Average</div>
            
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.colorBox} style={{ backgroundColor: '#02B2AF' }}></div>
                <span>Student score</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.colorBox} style={{ backgroundColor: '#2E96FF' }}></div>
                <span>Average</span>
              </div>
            </div>

            {unit.length > 0 && unitScore.length > 0 && (
  <BarChart
    series={[
      { name: "Student Score", data: unitScore, color: '#02B2AF' },
      { name: "Class Average", data: avgPerUnit, color: '#2E96FF' }
    ]}
    height={290}
    xAxis={[{ data: unit, scaleType: 'band' }]}
    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
  />
)}

          </div>

          <Paper className={styles.scoreInfo}>
            <div className={styles.scoreText}><strong>Your score:</strong> {score.find(entry => entry.round === round)?.totalScore || "N/A"} / 100</div>
            <div className={styles.scoreText}><strong>Mean:</strong> 44.42</div>
            <div className={styles.scoreText}><strong>Max:</strong> 77</div>
            <div className={styles.scoreText}><strong>Min:</strong> 0</div>
          </Paper>
        </div>
      </div>
    </div>)
    }
    </>
  );
}

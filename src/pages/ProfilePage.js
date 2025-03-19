import { useState, useEffect } from "react";
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Navbar from "../components/navBar";
import styles from '../styles/Profile.module.css'; 

export default function ProfilePage() {
  const [round, setRound] = useState(1);  
  const [score, setScore] = useState([]);
  const [unit, setUnit] = useState([]);
  const [unitScore, setUnitScore] = useState([]);
  const studentId = "6410509012";

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`http://localhost:3000/student-score/topic-wise/b6410545509`);
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();

        const processedRounds = data.map(round => {
          const { scheduleName, SectionData} = round;

        let totalScore = 0;
        let totalQuestions = 0;
        const topics = [];

        Object.values(SectionData).forEach(section => {
            const { scoreDetail, maxScore } = section;

            totalQuestions += maxScore;
            
            Object.entries(scoreDetail).forEach(([topicKey, topicValue]) => {
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
            totalScore: totalScore, 
            totalQuestions: totalQuestions, 
            scoreDetails: topics    
        };
        });

        console.log(processedRounds);
        setScore(processedRounds)

        const currentRoundData = processedRounds.find(entry => entry.round === round);
        console.log(currentRoundData)
      } catch (err) {
        console.error(err);
      }
    };

    fetchScores();
  }, [round, unit, unitScore]);

  const handleRoundChange = (event) => {
    const roundText = event.target.value; 
    const roundNumber = parseInt(roundText); 

    if (isNaN(roundNumber)) {
      setRound(1);
      alert(`Invalid round selected: ${roundText}`);
      return;
    }

    setRound(roundNumber);

    const currentRoundData = score.find(entry => entry.round === roundNumber);
    if (!currentRoundData) {
      alert(`No data available for ${roundText}`);
      return;
    }

    setUnit(Object.keys(currentRoundData.topics));
    setUnitScore(Object.values(currentRoundData.topics).map(topic => topic.topicScore));
  };

  const formatRound = (round) => {
    if (round === 1) return "1st Round";
    if (round === 2) return "2nd Round";
    if (round === 3) return "3rd Round";
    return `${round}th Round`;
  };
  

  return (
    <div className={styles.container}>
      <div>
        <Navbar />
      </div>

      <div className={styles.flexContainer}>
        <div className={styles.leftColumn}>

          <div className={styles.profileImage}>
            <img src="/userprofile.png" alt="User Profile" className={styles.profileImg} />
          </div>

          <div className={styles.userInfo}>
            <div className={styles.username}>Ploy Preme</div>
            <div className={styles.userInfoText}>{studentId}</div>
            <div className={styles.userInfoText}>Joined February 2024</div>
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
                {[1, 2, 3].map((r) => (
                  <MenuItem key={r} value={r}>{formatRound(r)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.rightColumn}>
          {/* Bar Chart */}
          <div className={styles.chartSection}>
          <div className={styles.statisticsTitle}>Statistics</div>
          <div className={styles.compareButton}>
            Score Compare with Average
          </div>
          {/* Color Boxes with Labels for Student score and Average */}
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


            <BarChart
              series={[
                { data: unitScore }, // Student scores
                { data: [3.5, 3, 4, 2, 3, 1, 0] },  // Average scores
              ]}
              height={290}
              xAxis={[{ data: unit, scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </div>



          {/* Score Information in Two Columns */}
          <Paper className={styles.scoreInfo}>
            <div className={styles.scoreText}><strong>Your score:</strong> 42/100</div>
            <div className={styles.scoreText}><strong>Mean:</strong> 44.42</div>
            <div className={styles.scoreText}><strong>S.D.:</strong> 12.72</div>
            <div className={styles.scoreText}><strong>Max:</strong> 77</div>
            <div className={styles.scoreText}><strong>Min:</strong> 0</div>
          </Paper>

        </div>
      </div>
    </div>
  );
}

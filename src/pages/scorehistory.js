import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/navBar";
import styles from "../styles/ScoreHistory.module.css";
import { useParams } from "react-router-dom";

const ScoreHistoryPage = () => {
  const { username } = useParams();
  const [selectedUnit, setSelectedUnit] = useState(2); // default to Unit 2
  const [scoreData, setScoreData] = useState([]);

  const unitRouteMap = {
    2: "exerciseU2",
    3: "exerciseU3",
    5: "exerciseU5",
    6: "exerciseU6",
    7: "exerciseU7",
    8: "exerciseU8",
    9: "exerciseU9",
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/exercise/score/${username}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const merged = data.flatMap((entry) => entry.scoreData);
          setScoreData(merged);
        }
      } catch (err) {
        console.error("Failed to fetch score data:", err);
      }
    };

    fetchScores();
  }, [username]);

  const handleUnitChange = (e) => {
    setSelectedUnit(Number(e.target.value));
  };

  const filteredData = scoreData.filter((item) => item.unit === selectedUnit);

  const highestScoresByUnit = {};
  scoreData.forEach((item) => {
    if (
      !highestScoresByUnit[item.unit] ||
      item.score > highestScoresByUnit[item.unit]
    ) {
      highestScoresByUnit[item.unit] = item.score;
    }
  });

  const unitScoreArray = Object.entries(highestScoresByUnit).map(
    ([unit, score]) => ({
      unit: Number(unit),
      highest: score,
    })
  );

  const allUnits = Object.keys(unitRouteMap).map(Number);
  const unitsWithScores = scoreData.map((item) => item.unit);
  const unitsWithoutScores = allUnits.filter(
    (u) => !unitsWithScores.includes(u)
  );

  return (
    <div style={{ display: "flex" }}>
      <Navbar />

      <div className={styles.chartContainer}>
        <h2 className={styles.scoreHeader}>📈 Exercise Score History</h2>

        <div className={styles.unitSelector}>
          <label>Select Unit:</label>
          <select
            className={styles.selectBox}
            value={selectedUnit}
            onChange={handleUnitChange}
          >
            {allUnits
              .sort((a, b) => a - b)
              .map((unit) => (
                <option key={unit} value={unit}>
                  Unit {unit}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.chartBox}>
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="round"
                  label={{
                    value: "Round",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ value: "Score", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4caf50"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={`Unit ${selectedUnit}`}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noScoreBox}>
              <p>
                No score yet for Unit {selectedUnit}. Let’s go and do it! 🚀
              </p>
              <button
                onClick={() => {
                  const route = unitRouteMap[selectedUnit];
                  if (route) {
                    window.location.href = `/${route}/${username}`;
                  } else {
                    alert("This unit doesn't have an exercise page yet.");
                  }
                }}
                className={styles.goExerciseButton}
              >
                Go to Exercise
              </button>
            </div>
          )}
        </div>

        <div className={styles.unitScoreList}>
          <h3>🔥 Highest Score by Unit</h3>
          <ul>
            {allUnits.map((unit) => {
              const score = highestScoresByUnit[unit];
              return (
                <li key={unit} className={styles.unitScoreItem}>
                  {score ? (
                    <span className={styles.unitScoreText}>
                      <strong>Unit {unit}:</strong>{" "}
                      {score
                        ? `${score} / 100`
                        : "No score yet. Let’s go and do it!"}{" "}
                      &nbsp;
                      {score >= 75
                        ? "🎉 Great job!"
                        : score >= 50
                        ? "💪 Keep going!"
                        : score
                        ? "🚀 You can do it!"
                        : ""}
                    </span>
                  ) : (
<span className={styles.unitScoreText}>
<strong>Unit {unit}:</strong> No score yet. Let’s go and
                      do it! 🚀
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const route = unitRouteMap[unit];
                      if (route) {
                        window.location.href = `/${route}/${username}`;
                      } else {
                        alert("This unit doesn't have an exercise page yet.");
                      }
                    }}
                  >
                    Go to Exercises
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScoreHistoryPage;

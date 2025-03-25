import React, { useState } from "react";
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

const mockScoreData = [
  { round: 1, unit: 2, score: 60 },
  { round: 2, unit: 2, score: 70 },
  { round: 3, unit: 2, score: 80 },
  { round: 4, unit: 2, score: 85 },
  { round: 1, unit: 2, score: 55 },
  { round: 2, unit: 2, score: 65 },
  { round: 3, unit: 2, score: 72 },
  { round: 1, unit: 3, score: 45 },
  { round: 2, unit: 3, score: 50 },
  { round: 3, unit: 3, score: 60 },
  { round: 1, unit: 5, score: 68 },
  { round: 2, unit: 5, score: 70 },
  { round: 1, unit: 5, score: 50 },
  { round: 2, unit: 5, score: 55 },
  { round: 1, unit: 6, score: 40 },
  { round: 2, unit: 6, score: 60 },
  { round: 1, unit: 7, score: 77 },
  { round: 2, unit: 7, score: 80 },
];

const ScoreHistoryPage = () => {
  const { username } = useParams();
  const [selectedUnit, setSelectedUnit] = useState(1);
  const unitRouteMap = {
    2: "exerciseU2",
    3: "exerciseU3",
    5: "exerciseU5",
    6: "exerciseU6",
    7: "exerciseU7",
    8: "exerciseU8",
    9: "exerciseU9",
  };

  const handleUnitChange = (e) => {
    setSelectedUnit(Number(e.target.value));
  };

  const filteredData = mockScoreData.filter(
    (item) => item.unit === selectedUnit
  );

  const highestScoresByUnit = {};
  mockScoreData.forEach((item) => {
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
            {[1, 2, 3, 4, 5, 6, 7].map((unit) => (
              <option key={unit} value={unit}>
                Unit {unit}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.chartBox}>
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
        </div>

        <div className={styles.unitScoreList}>
          <h3>🔥 Highest Score by Unit</h3>
          <ul>
            {unitScoreArray.map((u) => {
              const isTopScore =
                u.highest === Math.max(...unitScoreArray.map((i) => i.highest));
              return (
                <li key={u.unit} className={styles.unitScoreItem}>
                  <span className={styles.unitScoreItem}>
                    <strong>Unit {u.unit}:</strong> {u.highest} / 100 &nbsp;
                    {u.highest >= 75
                      ? "🎉 Great job!"
                      : u.highest >= 50
                      ? "💪 Keep going!"
                      : "🚀 You can do it!"}
                  </span>
                  <button
                    onClick={() => {
                      const route = unitRouteMap[u.unit];
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

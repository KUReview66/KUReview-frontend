import { Progress } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "../styles/StudyProgress.module.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function StudyProgress() {
  const username = localStorage.getItem("username");
  const [progress, setProgress] = useState(null);
  const [averageProgress, setAverageProgress] = useState(0);
  const isFetched = useRef(false);
  const status = averageProgress === 100 ? "success" : null;
  const color = averageProgress === 100 ? "#52c41a" : "#3385ff";
  const statusUnit = (percent) => {
    if (percent === 100) {
      return "success";
    } else {
      return null;
    }
  };

  const calculateAverageProgress = (progressArray) => {
    if (!progressArray || progressArray.length === 0) {
      return 0;
    }

    const totalProgress = progressArray.reduce(
      (acc, item) => acc + item.progress,
      0
    );
    const average = totalProgress / progressArray.length;

    return Math.round(average);
  };

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `https://ku-review-backend-wvt2.vercel.app/progress/${username}`
        );
        const data = await response.json();

        if (data["message"]) {
          const body = { studentId: username };
          const postResponse = await axios.post(
            "https://ku-review-backend-wvt2.vercel.app/progress",
            body
          );

          const progressDataObj = postResponse.data?.progress;
          const progressDataArr = progressDataObj
            ? Object.values(progressDataObj)
            : [];

          setAverageProgress(calculateAverageProgress(progressDataArr));
          setProgress(progressDataArr);
        } else {
          const putResponse = await axios.put(
            `https://ku-review-backend-wvt2.vercel.app/progress/${username}`
          );

          const progressDataObj = putResponse.data?.updatedProgress;
          const progressDataArr = progressDataObj
            ? Object.values(progressDataObj)
            : [];

          setAverageProgress(calculateAverageProgress(progressDataArr));
          setProgress(progressDataArr);
        }
      } catch (err) {
        console.error(err);
        setProgress([]);
      }
    };

    fetchProgress();
  }, [username]);

  const getProgressMessage = (progressPercent) => {
    if (progressPercent >= 0 && progressPercent <= 20) {
      return "You're just getting started! Keep going!";
    } else if (progressPercent > 20 && progressPercent <= 40) {
      return "Good job! You're making steady progress.";
    } else if (progressPercent > 40 && progressPercent <= 60) {
      return "You're halfway there! Keep up the momentum!";
    } else if (progressPercent > 60 && progressPercent <= 80) {
      return "You're doing great! Almost at the finish line!";
    } else if (progressPercent > 80 && progressPercent <= 100) {
      return "Amazing work! You're nearly complete!";
    } else {
      return "Invalid progress percentage.";
    }
  };

  const progressMessage = getProgressMessage(averageProgress);

  return (
    <>
      <div className={styles["overall-panel"]}>
        <h4>Overall Progress</h4>
        <Progress.Circle
          percent={averageProgress}
          strokeColor={color}
          status={status}
          strokeWidth={12}
        />
        <p>{progressMessage}</p>
      </div>

      <div className={styles["unit-progress"]}>
        {progress === null ? (
          <p>Loading progress...</p>
        ) : progress.length === 0 ? (
          <p>No progress found.</p>
        ) : (
          progress.map((item, index) => (
            <div key={index} className={styles["unit-item"]}>
              <p>{item.topicName}</p>
              <Progress.Line
                percent={item.progress}
                status={statusUnit(item.progress)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

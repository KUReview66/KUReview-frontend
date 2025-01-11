import React, { useState, useEffect } from "react";
import styles from '../styles/CountDownPanel.module.css';

const CountdownTimer = () => {
    const data = {
        eventName: "Exam round 3",
        eventDate: "2025-05-15T13:00:00"
    };

    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const eventTime = new Date(data.eventDate).getTime();
            let remainingTime = eventTime - currentTime;

            if (remainingTime <= 0) {
                remainingTime = 0;
                clearInterval(countdownInterval);
            }

            setTimeRemaining(remainingTime);
        }, 1000);

        return () => clearInterval(countdownInterval);
    }); 

    const formatDate = (date) => {
        const options = { month: "long", day: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    function extractTime(dateString) {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const formatTime = (time) => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const days = Math.floor(time / (1000 * 60 * 60 * 24));

        return (
            <div className={styles["countdown-display"]}>
                <div className={styles["countdown-value"]}>
                    <p className={styles["time"]}>{days.toString().padStart(2, "0")} </p>
                    <span>DAYS</span>
                </div>
                <div className={styles["countdown-value"]}>
                    <p className={styles["time"]}>{hours.toString().padStart(2, "0")} </p>
                    <span>HOURS</span>
                </div>
                <div className={styles["countdown-value"]}>
                    <p className={styles["time"]}>{minutes.toString().padStart(2, "0")} </p>
                    <span>MINUTES</span>
                </div>
                <div className={styles["countdown-value"]}>
                    <p className={styles["time"]}>{seconds.toString().padStart(2, "0")} </p>
                    <span>SECONDS</span>
                </div>
            </div>
        );
    };

    return (
        <div className={styles["countdown-timer-container"]}>
            <h2 className={styles["countdown-name"]}>
                {data.eventName}
            </h2>
            <p className={styles["countdown-date"]}>
                {formatDate(data.eventDate)} | {extractTime(data.eventDate)}
            </p>
            <div className={styles["line-container"]}>
                <div className={styles["line-center"]}></div>
            </div>

            {timeRemaining > 0 ? (
                <div className={styles["time-display-container"]}>
                    {formatTime(timeRemaining)}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CountdownTimer;

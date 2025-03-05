import React, { useState, useEffect } from "react";
import ReactLoading from 'react-loading';
import { BlinkBlur } from "react-loading-indicators";
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
            <div className={styles['countdown-display-ctn']}>
                <div className={styles["countdown-display"]}>
                    <div className={styles["countdown-value"]}>
                        <p className={styles["time"]} style={{fontWeight: '1000'}}>{days.toString().padStart(2, "0")} </p>
                        <span style={{color: '#838383', fontWeight: '800'}}>DAYS</span>
                    </div>
                    <div className={styles["countdown-value"]}>
                        <p className={styles["time"]} style={{fontWeight: '1000'}}>{hours.toString().padStart(2, "0")} </p>
                        <span style={{color: '#838383', fontWeight: '800'}}>HOURS</span>
                    </div>
                    <div className={styles["countdown-value"]}>
                        <p className={styles["time"]} style={{fontWeight: '1000'}}>{minutes.toString().padStart(2, "0")} </p>
                        <span style={{color: '#838383', fontWeight: '800'}}>MINUTES</span>
                    </div>
                    <div className={styles["countdown-value"]}>
                        <p className={styles["time"]} style={{fontWeight: '1000'}}>{seconds.toString().padStart(2, "0")} </p>
                        <span style={{color: '#838383', fontWeight: '800'}}>SECONDS</span>
                    </div>
                </div>
                <p className={styles["countdown-date"]}>
                {formatDate(data.eventDate)}  {extractTime(data.eventDate)}
            </p>
            </div>
        );
    };

    return (
        <div className={styles["countdown-timer-container"]}>
            {timeRemaining > 0 ? (
                <>
                    <p style={{marginBottom: '0', fontWeight: 'normal'}}>Your next exam round is in</p>
                    <div className={styles["time-display-container"]}>
                        {formatTime(timeRemaining)}
                    </div>
                </>
            ) : (
                <div className={styles["loading"]}>
                    <BlinkBlur color="#09451B" size="large" text="" textColor="" />
                </div>
            )}
        </div>
    );
};

export default CountdownTimer;

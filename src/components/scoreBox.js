import ProgressBar from "./progressBar"; 
import style from "../styles/ScoreBox.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Popup from "./Popup";
import VerticalProgressBar from "./VerticalProgressBar";

function ScoreBox({ round, score: scores, username }) {
    const [btnPopup, setBtnPopup] = useState(false);

    // Convert scheduleName to readable text
    const textRound =
        round === "comproExamR1" ? "1st" :
        round === "comproExamR2" ? "2nd" :
        round === "comproExamR3" ? "3rd" : `${round}th`;

    // Check if student took the exam
    const hasTakenExam =
        scores?.Percentage !== null &&
        scores?.ResultStatus !== null &&
        scores?.scoreDetails?.length > 0;

    const predictGrade = () => {
        const lectureTestScore = (scores.totalScore / scores.totalQuestions) * 100; // percentage
    
        const hwLabCombinations = [
            { hw: 100, lab: 95 },
            { hw: 100, lab: 90 },
            { hw: 80, lab: 90 },
            { hw: 80, lab: 85 },
            { hw: 60, lab: 85 },
            { hw: 60, lab: 70 },
            { hw: 50, lab: 65 },
            { hw: 40, lab: 55 },
        ];
    
        const gradeFromScore = (finalScore) => {
            if (finalScore >= 80) return "A";
            if (finalScore >= 75) return "B+";
            if (finalScore >= 70) return "B";
            if (finalScore >= 65) return "C+";
            if (finalScore >= 60) return "C";
            if (finalScore >= 55) return "D+";
            if (finalScore >= 50) return "D";
            return "F";
        };
    
        const predictions = hwLabCombinations.map(({ hw, lab }) => {
            const finalScore = (hw * 0.2) + (lectureTestScore * 0.4) + (lab * 0.4);
            const grade = gradeFromScore(finalScore);
    
            return {
                grade,
                hw,
                lab,
                finalScore: finalScore.toFixed(2)
            };
        });
        

        return predictions;
    };
        

    return (
        <div className={style["container"]}>
            <div className={style["score-header"]}>
                <h5>{textRound} Round</h5>
                {hasTakenExam ? (
                    <p>{scores.totalScore} / {scores.totalQuestions}</p>
                ) : (
                    <p style={{ color: "gray" }}>Student has not taken the exam for this round</p>
                )}
                <div className={style["action"]}>

                    <button disabled={!hasTakenExam} onClick={() => setBtnPopup(true)} style={{marginRight: '15px'}}>Predict Grade</button> 

                    <Popup trigger={btnPopup} setTrigger={setBtnPopup}>
                        <div className={style['popup-container']}>
                            <h3 className={style['popup-title']}>Predict Grade</h3>

                            <div className={style['lecture-score-container']}>
                                <p className={style['lecture-score-label']}>
                                    <strong>Lecture Test Score:</strong>
                                </p>
                                <p className={style['lecture-score-value']}>
                                    {((scores.totalScore / scores.totalQuestions) * 100).toFixed(2)}%
                                </p>
                            </div>

                            <div className={style['predictions-container']}>
                                {predictGrade().map((prediction, index) => (
                                    <div key={index} className={style['prediction-card']}>
                                        <div className={style['prediction-grade']}>
                                            {prediction.grade}
                                        </div>
                                        <div className={style['prediction-details']}>
                                            <p>If you have:</p>
                                            <ul>
                                                <li><strong>Homework:</strong> {prediction.hw}%</li>
                                                <li><strong>Lab:</strong> {prediction.lab}%</li>
                                            </ul>
                                            <p className={style['final-score-text']}>
                                                ➜ Your final score will be <strong>{prediction.finalScore}</strong>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Popup>

                    
                    <Link
                        to={hasTakenExam ? `/suggest/${username}/${round}` : "#"}
                        className={style.suggest}
                    >
                        <button
                            disabled={!hasTakenExam}
                            className={!hasTakenExam ? style.disabledButton : ""}
                        >
                            Suggestion
                        </button>
                    </Link>
                </div>
            </div>

            {hasTakenExam && scores && (
                <div className={style["score"]}>
                    {scores.scoreDetails.map(({ topicName, topicScore, totalQuestions }) => (
                        <div key={topicName} className={style["score-item"]}>
                            <p>{topicScore} / {totalQuestions}</p>
                            <VerticalProgressBar progress={topicScore} totalPoints={totalQuestions}/>
                            <div className={style["score-topic"]}>
                                <p>{topicName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScoreBox;

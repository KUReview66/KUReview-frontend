import ProgressBar from "./progressBar"; 
import style from "../styles/ScoreBox.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function ScoreBox({ round, score: scores, username }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

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
                    <button
                        onClick={toggleDropdown}
                        style={{
                            background: "transparent",
                            color: "black",
                            margin: "5px",
                        }}
                        disabled={!hasTakenExam}
                    >
                        {isOpen ? (
                            <i className="bi bi-chevron-up"></i>
                        ) : (
                            <i className="bi bi-chevron-down"></i>
                        )}
                    </button>
                </div>
            </div>

            {isOpen && hasTakenExam && scores && (
                <div className={style["score"]}>
                    {scores.scoreDetails.map(({ topicName, topicScore, totalQuestions }) => (
                        <div key={topicName} className={style["score-item"]}>
                            <div className={style["score-topic"]}>
                                <p>{topicName}</p>
                                <p>{topicScore} / {totalQuestions}</p>
                            </div>
                            <ProgressBar progress={topicScore} totalPoints={totalQuestions} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScoreBox;

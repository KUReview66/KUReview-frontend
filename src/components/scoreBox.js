import ProgressBar from "./progressBar";
import style from "../styles/ScoreBox.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from 'react-router-dom'

function ScoreBox({ round, score: scores, username}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const textRound = round === 'comproExamR1' ? "1st" : round === 'comproExamR2' ? "2nd" : round === 'comproExamR3' ? "3rd" : `${round}th`;

    return (
        <div className={style["container"]}>
            <div className={style["score-header"]}>
                <h5>{textRound} Round</h5>
                <p>{scores?.totalScore ?? "No score available"} / {scores.totalQuestions}</p>
                <div className={style["action"]}>
                <Link to={`/suggest/${username}/${round}`} className={style.suggest}>
                <button>Suggestion</button>
                </Link>
                    <button
                        onClick={toggleDropdown}
                        style={{ background: "transparent", color: "black", margin: "5px" }}
                    >
                        {isOpen ? (
                            <i className="bi bi-chevron-up"></i>
                        ) : (
                            <i className="bi bi-chevron-down"></i>
                        )}
                    </button>
                </div>
            </div>

            {isOpen && scores && (
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

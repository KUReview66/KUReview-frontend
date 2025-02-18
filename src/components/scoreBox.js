import ProgressBar from "./progressBar";
import style from "../styles/ScoreBox.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from 'react-router-dom'

function ScoreBox({ round, score: scores }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const textRound = round === 1 ? "1st" : round === 2 ? "2nd" : round === 3 ? "3rd" : `${round}th`;

    return (
        <div className={style["container"]}>
            <div className={style["score-header"]}>
                <h5>{textRound} Round</h5>
                <p>{scores?.total ?? "No score available"} / {scores.fullScore}</p>
                <div className={style["action"]}>
                <Link to="/suggest" className={style.suggest}>
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
                    {Object.entries(scores.topics).map(([topic, { topicScore, totalQuestion }]) => (
                        <div key={topic} className={style["score-item"]}>
                            <div className={style["score-topic"]}>
                                <p>{topic}</p>
                                <p>{topicScore} / {totalQuestion}</p>
                            </div>
                            <ProgressBar progress={topicScore} totalPoints={totalQuestion} />
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default ScoreBox;

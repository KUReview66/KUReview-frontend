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

    const textRound = round === 1 ? "1st" : round === 2 ? "2nd" : `${round}th`;

    return (
        <div className={style["container"]}>
            <div className={style["score-header"]}>
                <h5>{textRound} Round</h5>
                <p>{scores?.total ?? "No score available"} / 100</p>
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
                    {Object.entries(scores)
                        .filter(([key]) => key !== "round" && key !== "total")
                        .map(([key, value]) => (
                            <div key={key} className={style["score-item"]}>
                                <div className={style["score-topic"]}>
                                    <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                                    <p>{value}%</p>
                                </div>
                                <ProgressBar progress={value} totalPoints={100} />
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default ScoreBox;

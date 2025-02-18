import { useState, useEffect } from "react";
import CountDownPanel from "../components/CountDownPanel";
import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";

export default function ScorePage() {

    const [score, setScore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const courseName = "012XXXXX Computer Programming";
    const studentId = "6410509012";

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`http://localhost:3000/student-score/topic-wise/${studentId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch scores");
                }
                const data = await response.json();
    
                const mergedScores = data.reduce((acc, item) => {
                    const { round, topicName, totalQuestion, topicScore } = item;
    
                    let existingRound = acc.find(entry => entry.round === round);
                    if (!existingRound) {
                        existingRound = { round, total: 0, fullScore: 0, topics: {} }; 
                        acc.push(existingRound);
                    }
    
                    existingRound.topics[topicName] = { topicScore, totalQuestion };
                    existingRound.total += topicScore;
                    existingRound.fullScore += totalQuestion;
                    return acc;
                }, []);
    
                mergedScores.sort((a, b) => a.round - b.round);
    
                setScore(mergedScores);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchScores();
    }, [studentId]);
    

    return (
        <>
        <Navbar />
        <div className="full-page" style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className="score-container" style={{marginLeft: '2rem', width: '100%'}}>
                <div className="header">
                    <h3>{courseName}</h3>
                </div>
                <div className="score-box" style={{paddingRight: '2rem'}}>
                    {score.map((item => (
                        <ScoreBox round={item.round} score={item}></ScoreBox>
                    )))}
                </div>
            </div>
            <div className="right-panel" style={{width: '60%', marginTop: '2rem', borderLeft: '1px solid rgb(196, 196, 196)'}}>
                    <CountDownPanel />
                    <div style={{display: 'flex', textAlign: 'center', justifyContent: 'center', marginTop: '2rem'}}>
                        <a href="/suggest" style={{textDecoration: 'underline'}}>
                            Let us help you prepare before your exam &nbsp;
                            <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                    
            </div>
        </div>
        </>
    );
}
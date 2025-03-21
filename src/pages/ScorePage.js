import { useState, useEffect } from "react";
import CountDownPanel from "../components/CountDownPanel";
import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";
import styles from '../styles/Score.module.css';
import { useParams, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";

export default function ScorePage() {

    const [isCheckingLogin, setIsCheckingLogin] = useState(true);
    const [score, setScore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testDate, setTestDate] = useState(null);
    const courseName = "01204111 Computer and Programming";
    const {username} = useParams();
    const navigate = useNavigate(); 
    
    
    useEffect(() => {
        const fetchScores = async () => {
            const password = localStorage.getItem('password');
            const checkedUsername = localStorage.getItem('username');
            try {
                    console.log(password, checkedUsername)
                    const response = await fetch(`http://localhost:3000/student-score/topic-wise/${username}`);
                    const data = await response.json();
                    console.log(data)
                    if (data['message'] === 'No records found with that LoginName.') {
                        navigate('/pre-exam-suggestion');
                        return;
                    } else {
                        const processedRounds = data.map(round => {
                            const { scheduleName, SectionData,  UserTestStartDate, UserTestStartTime} = round;
        
                        let totalScore = 0;
                        let totalQuestions = 0;
                        const topics = [];
        
                        if (Object.keys(SectionData).length === 0) {
                            const combinedDateTimeString = `${UserTestStartDate}T${UserTestStartTime}`;
                            setTestDate(combinedDateTimeString);
                        } else {
                            setTestDate(null);
                        }
        
                        Object.values(SectionData).forEach(section => {
                            const { scoreDetail, maxScore } = section;
        
                            totalQuestions += maxScore;
                            
                            Object.entries(scoreDetail).forEach(([topicKey, topicValue]) => {
                                topics.push({
                                    topicName: topicValue.topicName,
                                    topicScore: topicValue.topicScore,
                                    totalQuestions: topicValue.totalQuestions
                                });
        
                                totalScore += topicValue.topicScore;
                            });
                        });
        
                        return {
                            round: scheduleName,    
                            totalScore: totalScore, 
                            totalQuestions: totalQuestions, 
                            scoreDetails: topics    
                        };
                        });
            
                        console.log(processedRounds);
                        setScore(processedRounds)
                    }
                }
            catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(err);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchScores();
        console.log('tets')
        return;
    }, [username, navigate]);

    const password = localStorage.getItem('password');
    console.log(typeof password, password)

    return (
        <>
        {
            password === '' ? (
                <NotFound />
            ) : (
                <div style={{display: 'flex'}}>
                <Navbar />
                <div className={styles['content-panel']}>
                    <CountDownPanel date={testDate}/>
                    <div className="score-container" style={{padding: '2rem'}}>
                        <div className="header">
                            <h3>{courseName}</h3>
                        </div>
                        <div className="score-box">
                            {score.length > 0 ? (
                                score.map(item => (
                                <ScoreBox key={item.round} round={item.round} score={item} username={username} />
                                ))
                            ) : (
                                <p>No scores available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            )
        }
        </>
    );

}
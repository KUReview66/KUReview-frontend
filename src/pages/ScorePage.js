import { useState, useEffect } from "react";
import CountDownPanel from "../components/CountDownPanel";
import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";
import styles from '../styles/Score.module.css';
import { useParams, useNavigate } from "react-router-dom";

export default function ScorePage() {

    const [isCheckingLogin, setIsCheckingLogin] = useState(true);
    const [score, setScore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testDate, setTestDate] = useState(null);
    const courseName = "012XXXXX Computer Programming";
    const {username} = useParams();
    const navigate = useNavigate(); 

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('username');
    
        console.log('Logged in user:', isLoggedIn);
    
        if (!isLoggedIn) {
            navigate('/404');
        } else {
            setIsCheckingLogin(false); 
        }
    }, [navigate]);

    
    useEffect(() => {
        if (isCheckingLogin) return;

        const fetchScores = async () => {
            try {
                const response = await fetch(`http://localhost:3000/student-score/topic-wise/${username}`);
                const data = await response.json();
                console.log(data)
                if (data['message'] === 'No records found with that LoginName.') {
                    navigate('/pre-exam-suggestion');
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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchScores();
    }, [username, isCheckingLogin]);

    if (isCheckingLogin) {
        return null;
    }
    

    return (
        <>
            <div style={{display: 'flex'}}>
                <Navbar />
                <div className={styles['content-panel']}>
                    <CountDownPanel date={testDate}/>
                    <div className="score-container" style={{padding: '2rem'}}>
                        <div className="header">
                            <h3>{courseName}</h3>
                        </div>
                        <div className="score-box">
                            {score.map(((item, index) => (
                                <ScoreBox key={index} round={item.round} score={item} username={username} />
                            )))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}
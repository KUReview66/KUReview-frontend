import CountDownPanel from "../components/CountDownPanel";
import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";

export default function ScorePage() {

    let courseName = '012XXXXX Computer Programming';
    let score = [
        {
            round: 1,
            total: 42, 
            loop: 5, 
            condition: 10, 
            list: 5, 
            function: 12
        },
        {
            round: 2,
            total: 60, 
            loop: 18, 
            condition: 15, 
            list: 12, 
            function: 15
        }
    ]

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
import CountDownPanel from "../components/CountDownPanel";
import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";

export default function ScorePage() {

    let courseName = '012XXXXX Computer Programming';
    let score = [
        {
            round: 1,
            total: 42, 
            repetition: 50, 
            subroutine: 20, 
            list: 80, 
            selection: 30,
            'Sequential Program': 10, 
            "Numerical Processing": 80
        },
        {
            round: 1,
            total: 95, 
            repetition: 80, 
            subroutine: 85, 
            list: 100, 
            selection: 95,
            'Sequential Program': 90, 
            "Numerical Processing": 95
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
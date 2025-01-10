import ContentPanel from "../components/ContentPanel";
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
        },
        {
            round: 3,
            total: 75, 
            loop: 18, 
            condition: 18, 
            list: 19, 
            function: 20
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
            <div className="right-panel" style={{width: '100%', marginTop: '2rem'}}>
                    <ContentPanel />
            </div>
        </div>
        </>
    );
}
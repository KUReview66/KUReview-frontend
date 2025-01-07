import Navbar from "../components/navBar";
import ScoreBox from "../components/scoreBox";

export default function ScorePage() {

    let courseName = '012XXXXX Computer Programming I';
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
        <div className="full-page" >
            <div className="score-container" style={{marginLeft: '2rem'}}>
                <div className="header">
                    <h3>{courseName}</h3>
                </div>
                <div className="score-box">
                    {score.map((item => (
                        <ScoreBox round={item.round} score={item}></ScoreBox>
                    )))}
                </div>
            </div>
        </div>
        </>
    );
}
import { Progress } from "rsuite"; 
import "rsuite/dist/rsuite.min.css"; 

export default function VerticalProgressBar({progress, totalPoints}) {

    const percentage = (progress / totalPoints) * 100;

    const color = percentage < 60 
    ? "#CA0000" 
    : percentage < 90 
    ? "#F3E03A" 
    : "#007E17";

    return (
        <>
            <Progress.Line percent={percentage} vertical={true} strokeColor={color} strokeWidth={20} showInfo={false}/> 
        </>
    )
}
import style from '../styles/progressBar.module.css';

export default function ProgressBar({progress, totalPoints}) {

    const percentage = (progress / totalPoints) * 100;

    const color = percentage < 60 
    ? "#CA0000" 
    : percentage < 90 
    ? "#F3E03A" 
    : "#007E17";

    return (
        <div className={style['parent']}>
            <div className={style['child']} style={{width: `${percentage}%`, backgroundColor: color}}>
                <span className="progress-text"></span>
            </div>
        </div>
    )
}
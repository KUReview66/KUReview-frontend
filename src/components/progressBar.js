import style from '../styles/progressBar.module.css';

export default function ProgressBar({progress, totalPoints}) {

    const percentage = (progress / totalPoints) * 100;

    return (
        <div className={style['parent']}>
            <div className={style['child']} style={{width: `${percentage}%`}}>
                <span className="progress-text"></span>
            </div>
        </div>
    )
}
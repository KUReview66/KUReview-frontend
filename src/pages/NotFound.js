import notFoundBg from '../404.png';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
    return(
        <div className={styles['container']}>
            <img src={notFoundBg} alt='404'/>
            <a href='/'>Back</a>
        </div>
    )
}
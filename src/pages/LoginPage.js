import KuReviewLogo from '../logo.png';
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';

function LogInPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('score');
    }

    return (
        <div className={styles['full-page']}>
            <div className={styles['card']}>
            <img src={KuReviewLogo} alt="logo" className={styles['logo']} />
                <form>
                    <div className={styles['input-ctn']}>
                        <label htmlFor="username">Username</label>
                        <input id="username" type="text" placeholder="Username" required />
                    </div>
                    <div className={styles['input-ctn']}>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="Password" required />
                    </div>
                    <p className={styles['header']}>*Login with your nontri account</p>
                    <button type="submit" className={styles['login-button']} onClick={handleLogin}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LogInPage;

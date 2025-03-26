import { useState } from 'react';
import KuReviewLogo from '../logo.png';
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate();   
    localStorage.setItem('username', '');
    localStorage.setItem('password', '');

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            username: username, 
            password: password
        }


        try {
            const response = await axios.post('http://localhost:3000/login', loginData);
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            navigate(`score/${username}`);
        } catch (err) {
            console.error(err)
            alert('Invalid login detail')
        }
    }

    return (
        <div className={styles['full-page']}>
            <div className={styles['card']}>
            <img src={KuReviewLogo} alt="logo" className={styles['logo']} />
                <form>
                    <div className={styles['input-ctn']}>
                        <label htmlFor="username">Username bXXXXXXXXXX</label>
                        <input id="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className={styles['input-ctn']}>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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

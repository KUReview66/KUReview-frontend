import KuReviewLogo from "../logo-white.png";
import lightBulb from '../idea-48.png';
import styles from "../styles/NavBar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate(); 

    const handleLogout = (e) => {
        e.preventDefault();

        localStorage.setItem('username', '');
        const check = localStorage.getItem('username');
        console.log(check);

        navigate('/');
    }

    return (
        <>
        <div className={styles['nav-container']}>
            <div className={styles['nav-item']}>
                <a href="/score" >
                    <img src={KuReviewLogo} alt="logo" />
                </a>
                <a href="/profile">
                    <div className={styles['name-icon']}>
                        <img src="https://cdn-icons-png.flaticon.com/512/12828/12828286.png" alt="profile-icon"/>
                        <p>Profile</p>
                    </div>
                </a>
                <a href="/suggest">
                    <div className={styles['name-icon']}>
                        <img src={lightBulb} alt="lightbulb-icon"/>
                        <p>Study</p>
                    </div>
                </a>
            </div>
            <div className={styles["spacer"]}></div>
            <div className={styles['nav-item']}>
                <a href="/" onClick={handleLogout}>
                    <div className={styles['name-icon']}>
                        <img src="https://images.freeimages.com/clg/images/26/261833/white-clarity-shutdown-icon_f?h=350" alt="logout-logo"/>
                        <p>Logout</p>
                    </div>
                </a>
            </div>
        </div>
        </>
    );
}

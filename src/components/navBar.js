import KuReviewLogo from "../logo-white.png";
import lightBulb from '../idea-48.png';
import styles from "../styles/NavBar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate(); 
    const username = localStorage.getItem('username') || "guest"; 
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        navigate('/');
    }

    return (
        <>
        <div className={styles['nav-container']}>
            <div className={styles['nav-item']}>
                {/* Navigate to /score/username */}
                <div 
                    onClick={() => navigate(`/score/${username}`)} 
                    style={{ cursor: "pointer" }}
                >
                    <img src={KuReviewLogo} alt="logo"         style={{ width: "120px", height: "auto" , margin: "10px"}} 
 />
                </div>

                {/* Navigate to /profile/username */}
                <div 
                    className={styles['name-icon']} 
                    onClick={() => navigate(`/profile/${username}`)} 
                    style={{ cursor: "pointer" }}
                >
                    <img src="https://cdn-icons-png.flaticon.com/512/12828/12828286.png" alt="profile-icon"/>
                    <p>Profile</p>
                </div>

                {/* Navigate to /suggest/username */}
                <div 
                    className={styles['name-icon']} 
                    onClick={() => navigate(`/suggest/${username}/comproExamR1`)} 
                    style={{ cursor: "pointer" }}
                >
                    <img src={lightBulb} alt="lightbulb-icon"/>
                    <p>Study</p>
                </div>
            </div>

            <div className={styles["spacer"]}></div>

            {/* Logout button */}
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

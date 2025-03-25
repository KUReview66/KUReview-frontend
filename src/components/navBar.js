import React, { useState } from "react";
import KuReviewLogo from "../logo-white.png";
import lightBulb from '../idea-48.png';
import styles from "../styles/NavBar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate(); 
    const username = localStorage.getItem('username') || "guest"; 
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        navigate('/');
    }

    const units = [
        { path: "/exerciseU2", label: "Unit 02 - Basic" },
        { path: "/exerciseU3", label: "Unit 03 - Subroutine" },
        { path: "/exerciseU5", label: "Unit 05 - Selection" },
        { path: "/exerciseU6", label: "Unit 06 - Repetition" },
        { path: "/exerciseU7", label: "Unit 07 - List" },
        { path: "/exerciseU8", label: "Unit 08 - File" },
        { path: "/exerciseU9", label: "Unit 09 - Numpy" },
    ];

    return (
        <div className={styles['nav-container']}>
            <div className={styles['nav-item']}>

                {/* KUReview Logo → go to score page */}
                <div 
                    onClick={() => navigate(`/score/${username}`)} 
                    style={{ cursor: "pointer" }}
                >
<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <img 
    src={KuReviewLogo} 
    alt="logo" 
    style={{ width: "140px", height: "auto", margin: "10px" }} 
  />
</div>                </div>

                {/* Profile */}
                <div 
                    className={styles['name-icon']} 
                    onClick={() => navigate(`/profile/${username}`)} 
                    style={{ cursor: "pointer" }}
                >
                    <img src="https://cdn-icons-png.flaticon.com/512/12828/12828286.png" alt="profile-icon"/>
                    <p>Profile</p>
                </div>

                {/* Study */}
                <div 
                    className={styles['name-icon']} 
                    onClick={() => navigate(`/suggest/${username}/comproExamR1`)} 
                    style={{ cursor: "pointer" }}
                >
                    <img src={lightBulb} alt="lightbulb-icon"/>
                    <p>Study</p>
                </div>


<div className={`${styles['dropdown-wrapper']} ${showDropdown ? styles['open'] : ''}`}>
  <div 
    className={styles['name-icon']} 
    style={{ cursor: "pointer" }}
    onClick={() => setShowDropdown(!showDropdown)}
  >
    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/White_pencil.png" alt="exercise-icon"/>
    <p>Exercises</p>
  </div>

  {showDropdown && (
    <div className={styles['dropdown-menu']}>
      {units.map((unit, index) => (
        <div
          key={index}
          className={styles['dropdown-item']}
          onClick={() => {
            navigate(`${unit.path}/${username}`);
            setShowDropdown(false);
          }}
        >
          {unit.label}
        </div>
      ))}
    </div>
  )}
</div>


                {/* history */}
                <div 
                    className={styles['name-icon']} 
                    onClick={() => navigate(`/history/${username}`)} 
                    style={{ cursor: "pointer" }}
                >
                    <img src="https://www.pngkey.com/png/full/76-768762_pen-paper-camera-e-mail-spreadsheets-and-presentations.png" alt="history-icon"/>
                    <p>Exercise History</p>
                </div>
            </div>

            <div className={styles["spacer"]}></div>

            {/* Logout */}
            <div className={styles['nav-item']}>
                <a href="/" onClick={handleLogout}>
                    <div className={styles['name-icon']}>
                        <img src="https://images.freeimages.com/clg/images/26/261833/white-clarity-shutdown-icon_f?h=350" alt="logout-logo"/>
                        <p>Logout</p>
                    </div>
                </a>
            </div>
        </div>
    );
}

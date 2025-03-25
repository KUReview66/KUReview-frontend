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

                {/* Exercises Dropdown */}
                <div 
                    className={styles['name-icon']} 
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <img src="https://cdn-icons-png.flaticon.com/512/12828/12828286.png" alt="exercise-icon"/>
                    <p>Exercises</p>

                    {showDropdown && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            backgroundColor: "white",
                            color: "#1f4f2c",
                            borderRadius: "5px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            zIndex: 999,
                            minWidth: "180px",
                            padding: "5px 0"
                        }}>
                            {units.map((unit, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        navigate(unit.path);
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        padding: "10px 15px",
                                        cursor: "pointer",
                                        fontSize: "14px"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#eaf4ea"}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    {unit.label}
                                </div>
                            ))}
                        </div>
                    )}
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

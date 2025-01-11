import KuReviewLogo from "../logo.png";
import { useState, useRef } from "react";
import styles from "../styles/NavBar.module.css";

export default function Navbar() {
    const navRef = useRef();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    return (
        <header>
        <a href="/score" style={{ marginLeft: '-30px' }}>
            <img src={KuReviewLogo} alt="logo" />
        </a>
        <nav ref={navRef}>
            <a href="/suggest">Suggestion</a>

            <div className={`${styles["profile"]} ${styles["large-screen-only"]}`}>
                <a href="/profile">Profile</a>
                <a href="/">Logout</a>
            </div>

            <div className={`${styles["profile"]} ${styles["small-screen-only"]}`}>
                <button 
                    className={styles["profile-btn"]} 
                    onClick={toggleDropdown} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '3rem' }}
                >
                    <img src="https://cdn-icons-png.flaticon.com/512/8847/8847419.png" alt="profile-logo" style={{width: '30px'}}/>
                    <i 
                    className={`bi ${isDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} 
                    style={{ marginLeft: '5px' }}
                    ></i>
                </button>

                <div className={`${styles.dropdown} ${isDropdownOpen ? styles.show : ''}`}>
                    <a href="/profile">View Profile</a>
                    <a href="/">Log Out</a>
                </div>
            </div>
        </nav>
        </header>
    );
}

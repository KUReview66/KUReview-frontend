// src/pages/ProfilePage.js

import React from 'react';
import styles from '../styles/Profile.module.css';
import ScoreChart from '../components/ScoreChart'; // Adjust the path as needed

function Profile() {
  return (
    <div className={styles.profilePage}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Users/preme/Ku-review/KUReview-frontend/src/logo.png" alt="KUReview Logo" className={styles.logo} />
          <div className={styles.subtitle}>BEST PRACTICE FOR KU LEARNERS</div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>Ploy Preme</div>
          <div className={styles.userId}>b6410xxxxxxx</div>
          <div className={styles.joinedDate}>Joined February 2024</div>
        </div>
      </header>
      <main className={styles.statistics}>
        <h2>Statistics</h2>
        <h3 className={styles.comparisonTitle}>Score Compare with average</h3>
        <div className={styles.chartSection}>
          <ScoreChart />
        </div>
        <div className={styles.scoreSummary}>
          <div>Your score : 42/100</div>
          <div>Mean : 44.42</div>
          <div>S.D. : 12.72</div>
          <div>Max: 77</div>
          <div>Min: 0</div>
        </div>
      </main>
    </div>
  );
}

export default Profile;

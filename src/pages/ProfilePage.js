import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Navbar from "../components/navBar";
import styles from '../styles/Profile.module.css'; // Assuming you will style your page via CSS

export default function ProfilePage() {
  const [round, setRound] = React.useState('1st Round');

  const handleRoundChange = (event) => {
    setRound(event.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <div>
        <Navbar />
      </div>

      {/* Flex Container for Left and Right Columns */}
      <div className={styles.flexContainer}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Profile Image */}
          <div className={styles.profileImage}>
            <img src="/userprofile.png" alt="User Profile" className={styles.profileImg} />
          </div>
          {/* User Info */}
          <div className={styles.userInfo}>
  <div className={styles.username}>Ploy Preme</div>
  <div className={styles.userInfoText}>b6410xxxxxx</div>
  <div className={styles.userInfoText}>Joined February 2024</div>
</div>


          {/* Round Selector */}
          <div className={styles.roundSelector}>
            <FormControl variant="filled">
              <InputLabel id="round-select-label">Round</InputLabel>
              <Select
                labelId="round-select-label"
                id="round-select"
                value={round}
                onChange={handleRoundChange}
                label="Round"
              >
                <MenuItem value={'1st Round'}>1st Round</MenuItem>
                <MenuItem value={'2nd Round'}>2nd Round</MenuItem>
                <MenuItem value={'3rd Round'}>3rd Round</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Bar Chart */}
          <div className={styles.chartSection}>
          <div className={styles.statisticsTitle}>Statistics</div>
          <div className={styles.compareButton}>
  Score Compare with Average
</div>
          {/* Color Boxes with Labels for Student score and Average */}
          <div className={styles.legend}>
  <div className={styles.legendItem}>
    <div className={styles.colorBox} style={{ backgroundColor: '#02B2AF' }}></div>
    <span>Student score</span>
  </div>
  <div className={styles.legendItem}>
    <div className={styles.colorBox} style={{ backgroundColor: '#2E96FF' }}></div>
    <span>Average</span>
  </div>
</div>


            <BarChart
              series={[
                { data: [35, 44, 24, 34] }, // Student scores
                { data: [51, 6, 49, 30] },  // Average scores
              ]}
              height={290}
              xAxis={[{ data: ['Loop', 'Condition', 'List', 'Dictionary'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </div>



          {/* Score Information in Two Columns */}
          <Paper className={styles.scoreInfo}>
  <div className={styles.scoreText}><strong>Your score:</strong> 42/100</div>
  <div className={styles.scoreText}><strong>Mean:</strong> 44.42</div>
  <div className={styles.scoreText}><strong>S.D.:</strong> 12.72</div>
  <div className={styles.scoreText}><strong>Max:</strong> 77</div>
  <div className={styles.scoreText}><strong>Min:</strong> 0</div>
</Paper>

        </div>
      </div>
    </div>
  );
}

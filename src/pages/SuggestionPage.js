import * as React from 'react';
import Navbar from "../components/navBar";
import styles from '../styles/Suggestion.module.css';
import { Button, Typography, Box } from '@mui/material';

export default function SuggestionPage() {
  const [selectedUnit, setSelectedUnit] = React.useState('Loop'); // Default to Unit 1

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <div>
        <Navbar />
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Column (Units) */}
        <div className={styles.leftColumn}>
          <Typography variant="h6">Units</Typography>
          <Button onClick={() => handleUnitClick('Loop')} className={styles.unitButton}>Unit 1: Loop</Button>
          <Button onClick={() => handleUnitClick('Condition')} className={styles.unitButton}>Unit 2: Condition</Button>
          <Button onClick={() => handleUnitClick('List')} className={styles.unitButton}>Unit 3: List</Button>
          <Button onClick={() => handleUnitClick('Function')} className={styles.unitButton}>Unit 4: Function</Button>
        </div>

        {/* Right Column (Suggestions for the selected unit) */}
        <div className={styles.rightColumn}>
          <Typography variant="h6">{selectedUnit} Suggestions</Typography>
          <Box className={styles.suggestionBox}>
            <Typography variant="body1">
              Suggestions for {selectedUnit} will go here.
            </Typography>
            <video width="100%" controls>
              <source src="path_to_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </div>
      </div>
    </div>
  );
}

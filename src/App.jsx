import React, { useEffect, useState } from "react";
import DailyVote from "./components/DailyVote";
import GuiltTrip from "./components/GuiltTrip";
import FlipAd from "./components/FlipAd";
import "./App.css";

function App() {
  const [scenario, setScenario] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetch("/api/scenario")
      .then((res) => res.json())
      .then(setScenario)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleOrientation = (e) => {
      const angle = Math.abs(window.orientation || 0);
      const isPortrait = angle === 0 || angle === 180;
      setIsFlipped(!isPortrait);
    };

    window.addEventListener("orientationchange", handleOrientation);
    handleOrientation();

    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, []);

  if (!scenario) {
    return (
      <div className="loading-screen">
        <h2>Loading today's dilemma...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <DailyVote
        scenario={scenario}
        hasVoted={hasVoted}
        onVote={() => setHasVoted(true)}
      />

      {hasVoted && !isFlipped && <GuiltTrip />}

      {hasVoted && isFlipped && (
        <div className="ad-container">
          <FlipAd />
          <a
            href="https://www.instagram.com/flipvertising"
            target="_blank"
            rel="noopener noreferrer"
            className="flipvertising-footer"
          >
            Powered by Flipvertising™
          </a>
        </div>
      )}
    </div>
  );
}

export default App;

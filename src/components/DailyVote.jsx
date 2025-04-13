import React, { useState, useEffect } from 'react';
import { getTodayResetKey, getTimeUntilNextReset } from '../utils/timeUtils';
import scenarios from '../data/scenarios.json';
import { submitVote, fetchVoteCounts } from '../utils/voteApi';

const todayKey = getTodayResetKey();
const votesKey = `${todayKey}_submitted`;

export default function DailyVote() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [countdown, setCountdown] = useState(getTimeUntilNextReset());
  const [rank, setRank] = useState(null);
  const [voteCounts, setVoteCounts] = useState([]);

  const today = todayKey.replace('ourceo_vote_', '');
  const scenario = scenarios[today] || scenarios.default;

  // Format countdown
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // Fetch vote counts
  const loadVoteCounts = async () => {
    const counts = await fetchVoteCounts(today);
    setVoteCounts(counts);
    if (hasVoted && selectedId !== null) {
      const sorted = [...counts].sort((a, b) => b.count - a.count).map((v) => v.option_id);
      setRank(sorted.indexOf(selectedId) + 1);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(votesKey);
    if (saved) {
      setHasVoted(true);
      setSelectedId(parseInt(saved));
    }

    loadVoteCounts();

    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextReset());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVote = async (id) => {
    const success = await submitVote(today, id);
    if (success) {
      localStorage.setItem(votesKey, id);
      setSelectedId(id);
      setHasVoted(true);
      await loadVoteCounts(); // Refresh tally
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">What do we do today?</h2>

      {hasVoted ? (
        <div className="text-center p-4 bg-green-100 rounded-xl">
          <p className="mb-2">✅ You voted for:</p>
          <p className="font-semibold">{scenario.choices.find(c => c.id === selectedId)?.text}</p>
          {rank && (
            <p className="mt-2 text-xs text-gray-700">
              You picked the #{rank} most popular option so far.
            </p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            New scenario unlocks in: <span className="font-mono">{formatTime(countdown)}</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {scenario.choices.map(choice => (
            <div
              key={choice.id}
              className="relative h-40 bg-cover bg-center cursor-pointer rounded-xl overflow-hidden shadow group"
              style={{ backgroundImage: `url(${choice.image})` }}
              onClick={() => handleVote(choice.id)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex flex-col justify-center items-center p-2">
                <p className="text-xs sm:text-sm text-center font-semibold text-white drop-shadow">
                  {choice.text}
                </p>
                <span className="mt-1 text-sm text-pink-300 font-bold drop-shadow">
                  {choice.effect}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





















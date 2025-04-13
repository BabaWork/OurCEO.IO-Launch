import React, { useEffect, useState } from 'react';
import { fetchTodayScenario } from './utils/fetchTodayScenario';
import logoLight from '/logo-light.png';
import logoDark from '/logo-grindset.png';

function App() {
  const [scenario, setScenario] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [theme, setTheme] = useState('cutie');

  const toggleTheme = () => {
    setTheme(theme === 'cutie' ? 'grindset' : 'cutie');
  };

  useEffect(() => {
    async function fetchScenario() {
      try {
        const res = await fetch('http://localhost:3001/api/scenario');
        const data = await res.json();
        setScenario(data);
      } catch (err) {
        console.error('Failed to fetch scenario:', err);
      }
    }

    fetchScenario();
  }, []);

  const handleVote = (index) => {
    setSelectedIndex(index);
    setFeedback(scenario.options[index].feedback);
  };

  if (!scenario) return <div className="text-center mt-20 text-lg">Loading...</div>;

  const isGrindset = theme === 'grindset';
  const isWideOrLandscape = window.innerWidth > 768 || window.innerHeight < window.innerWidth;

  return (
    <div className={`${isGrindset ? 'bg-gray-900 text-white' : 'bg-pink-50 text-black'} min-h-screen flex flex-col items-center justify-start p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-4">
        <img src={isGrindset ? logoDark : logoLight} alt="CEO.IO logo" className="h-12" />
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded-md text-sm font-semibold shadow transition ${
            isGrindset ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
          }`}
        >
          Switch to {isGrindset ? 'Cutie Light™' : 'Grindset Dark™'}
        </button>
      </div>

      {/* Scenario Prompt */}
      <div className={`w-full max-w-md mb-6 px-4 py-3 rounded-xl shadow-md border ${isGrindset ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'}`}>
        <h2 className="text-lg font-semibold mb-1">📣 Today’s Scenario</h2>
        <p className="text-base">{scenario.prompt}</p>
      </div>

      {/* Voting Area */}
      {selectedIndex === null ? (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {scenario.options.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleVote(index)}
              className="relative h-40 rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
              style={{
                backgroundImage: `url(${choice.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
                <span className="text-white font-semibold text-center text-sm">
                  {choice.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center mt-6 space-y-4 max-w-md">
          <p className="text-xl font-bold">{scenario.options[selectedIndex].effect}</p>
          <p className="italic text-sm text-gray-400">{feedback}</p>
          <p className="text-green-400 font-semibold text-sm mt-4">{scenario.thankYou}</p>
          <p className="text-xs text-gray-400">
            Today’s charity:{" "}
            <a
              href={scenario.charityLink}
              className="underline text-blue-400"
              target="_blank"
              rel="noreferrer"
            >
              {scenario.charity}
            </a>
          </p>
        </div>
      )}

      {/* Ad Sidebar - shows on desktop or rotated mobile */}
      {isWideOrLandscape && (
        <div className="fixed right-0 top-0 w-64 h-screen bg-white shadow-lg p-4 border-l border-gray-300 z-50">
          <p className="text-sm text-center font-medium text-red-500 mb-2">
            {scenario.guiltTrip}
          </p>
          {scenario.ad && (
            <img src={scenario.ad} alt="ad" className="w-full rounded" />
          )}
          <p className="text-xs text-center text-gray-500 mt-2">{scenario.thankYou}</p>
        </div>
      )}
    </div>
  );
}

export default App;

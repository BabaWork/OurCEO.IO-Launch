import React, { useEffect, useState } from "react";
import logoLight from "/logo-light.png";
import logoDark  from "/logo-grindset.png";

const FLIP_LINK = "https://www.instagram.com/flipvertising";

export default function App() {
  const [scenario, setScenario] = useState(null);
  const [voted, setVoted]       = useState(false);
  const [isLand, setIsLand]     = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  const [theme, setTheme] = useState("cutie"); // cutie | grindset

  /* fetch scenario once */
  useEffect(() => {
    fetch("/api/scenario")
      .then(r => r.json())
      .then(setScenario)
      .catch(console.error);

    /* orientation listener */
    const mq = window.matchMedia("(orientation: landscape)");
    const h  = e => setIsLand(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* vote */
  const handleVote = async (idx) => {
    await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({ optionIndex: idx })
    });
    setVoted(true);
  };

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const isGrind = theme === "grindset";

  return (
    <div
      className={
        `${isGrind ? "bg-gray-900 text-white" : "bg-pink-50 text-black"} ` +
        "min-h-screen flex flex-col items-center p-4"
      }
    >
      {/* header */}
      <header className="w-full max-w-md mb-4 flex items-center justify-between">
        <img src={isGrind ? logoDark : logoLight} className="h-10" />
        <button
          onClick={() => setTheme(isGrind ? "cutie" : "grindset")}
          className={
            `px-3 py-1 rounded text-sm font-semibold shadow ` +
            `${isGrind ? "bg-white text-gray-900" : "bg-gray-900 text-white"}`
          }
        >
          Switch to {isGrind ? "Cutie" : "Grindset"}
        </button>
      </header>

      {/* scenario text */}
      <p className="max-w-md text-center mb-6 whitespace-pre-line">
        {scenario.body}
      </p>

      {/* vote grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {scenario.choices.slice(0, 4).map((c, i) => (
          <button
            key={i}
            disabled={voted}
            onClick={() => handleVote(i)}
            className="relative h-40 rounded-lg overflow-hidden shadow disabled:opacity-60"
          >
            <img
              src={c.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              <span className="text-sm font-semibold text-center">{c.text}</span>
              <span className="text-xs opacity-80">{c.effect}</span>
            </div>
          </button>
        ))}
      </div>

      {/* guilt-trip always visible under grid */}
      <p className="mt-4 text-xs text-center opacity-90">{scenario.guiltTrip}</p>

      {/* sidebar ad – only while landscape */}
      {isLand && (
        <aside className="fixed right-0 top-0 w-64 h-screen bg-white text-black shadow-lg p-4 border-l border-gray-300 z-50">
          <img src={scenario.ad} alt="sponsor" className="w-full rounded mb-2" />
          <p className="text-xs text-center text-gray-600 mb-1">{scenario.thankYou}</p>
          <a
            href={FLIP_LINK}
            target="_blank"
            rel="noreferrer"
            className="block text-[10px] text-center underline text-emerald-500"
          >
            Powered by Flipvertising™
          </a>
        </aside>
      )}
    </div>
  );
}

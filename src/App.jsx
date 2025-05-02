// src/App.jsx
import React, { useEffect, useState } from "react";
import { fetchTodayScenario, submitVote } from "./utils/fetchTodayScenario";
import "./index.css";

// assets
import logoLight from "/logo-light.png";
import logoDark  from "/logo-grindset.png";

const FLIPVERTISING_LINK = "https://www.instagram.com/flipvertising/?utm_source=ig_web_button_share_sheet"; // 🔗 IG

export default function App() {
  /* ───────── state ───────── */
  const [scenario, setScenario] = useState(null);
  const [voteSent, setVoteSent] = useState(false);
  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);

  /* ───────── effects ─────── */
  useEffect(() => {
    fetchTodayScenario().then(setScenario).catch(console.error);

    const mq = window.matchMedia("(orientation: landscape)");
    const handler = (e) => setIsLandscape(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ───────── helpers ─────── */
  const handleVote = async (choiceIdx) => {
    await submitVote(choiceIdx);
    setVoteSent(true);
  };

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  /* ───────── JSX ─────────── */
  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white p-4">
      {/* logo */}
      <img
        src={isLandscape ? logoDark : logoLight}
        alt="CEO.IO logo"
        className="w-32 mb-3"
      />

      {/* scenario */}
      <p className="max-w-md text-center mb-6">{scenario.body}</p>

      {/* vote grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {scenario.choices.slice(0, 4).map((c, idx) => (
          <button
            key={idx}
            onClick={() => handleVote(idx)}
            disabled={voteSent}
            className="relative h-28 rounded-lg overflow-hidden group"
          >
            <img
              src={c.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition"
            />
            <span className="relative z-10 font-semibold text-sm px-2">
              {c.text}
            </span>
            <span className="relative z-10 block text-xs mt-1 opacity-80">
              {c.effect}
            </span>
          </button>
        ))}
      </div>

      {/* guilt trip — always visible below the votes */}
      <p className="mt-4 text-xs text-center italic opacity-90">
        {scenario.guiltTrip} – flip your phone to feed our dev team 🍜
      </p>

      {/* ad banner – only while landscape */}
      {isLandscape && (
        <div className="fixed top-4 right-4 w-48 shadow-lg">
          <a href={scenario.fakeAdLink} target="_blank" rel="noreferrer">
            <img src="/ad-banner.jpg" alt="ad" className="rounded-md" />
          </a>
          <p className="text-[10px] text-center mt-1">
            Sponsored • No refunds.<br />
            Thanks for rotating 🙏
          </p>
          <p className="text-[10px] text-center mt-0.5">
            <a
              href={FLIPVERTISING_LINK}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Powered by Flipvertising™
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

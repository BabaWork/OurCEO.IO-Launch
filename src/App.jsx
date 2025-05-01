import React, { useEffect, useState } from "react";
import { fetchTodayScenario, submitVote } from "./utils/fetchTodayScenario";
import "./index.css";

/* ---------- CONFIG ---------- */
const INSTAGRAM_URL = "https://www.instagram.com/flipvertising?igsh=cWVoYjVrN3liOGg3; 
/* ---------------------------- */

export default function App() {
  /* ----------- state ---------- */
  const [scenario, setScenario] = useState(null);
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  const [hasVoted, setHasVoted] = useState(false);

  /* ----------- hooks ---------- */
  useEffect(() => {
    fetchTodayScenario().then(setScenario);

    /* orientation listener */
    const mql = window.matchMedia("(orientation: landscape)");
    const onChange = (e) => setIsLandscape(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  /* ----------- render helper ---------- */
  if (!scenario)
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading…
      </div>
    );

  const { body, choices, ad, thankYou, guiltTrip } = scenario;

  /* ----------- JSX ---------- */
  return (
    <div className="min-h-screen flex flex-col items-center pt-6 pb-24 sm:pb-8 px-4 text-center">
      {/* --- HEADER --- */}
      <h1 className="text-3xl font-bold mb-6">CEO.IO</h1>

      {/* --- STORY BODY --- */}
      <p className="max-w-md text-sm leading-relaxed mb-6 whitespace-pre-line">
        {body}
      </p>

      {/* --- VOTE GRID --- */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {choices.map((c, idx) => (
          <button
            key={idx}
            disabled={hasVoted}
            className="relative aspect-square rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            onClick={() => {
              submitVote(idx);
              setHasVoted(true);
            }}
          >
            {/* bg image */}
            <img
              src={c.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-2">
              <span className="text-xs font-semibold leading-tight">
                {c.text}
              </span>
              <span className="text-emerald-400 text-xs mt-1">{c.effect}</span>
            </div>
          </button>
        ))}
      </div>

      {/* --- GUILT-TRIP (portrait only) --- */}
      {!isLandscape && (
        <p className="text-xs text-neutral-400 mt-5 max-w-xs">
          {guiltTrip} <br />
          <span className="italic">Rotate your phone&nbsp;↻</span>
        </p>
      )}

      {/* --- SIDEBAR AD (landscape only, floats right in CSS) --- */}
      {isLandscape && (
        <aside className="fixed right-2 top-24 w-52">
          {/* real or placeholder ad */}
          <a
            href={ad}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-neutral-700 rounded-md overflow-hidden"
          >
            <img src={ad} alt="sponsor" className="w-full" />
          </a>

          {/* thank-you & branding */}
          <p className="text-xs text-neutral-400 mt-1">{thankYou}</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[10px] text-emerald-400 underline mt-0.5"
          >
            Powered by Flipvertising™
          </a>
        </aside>
      )}
    </div>
  );
}

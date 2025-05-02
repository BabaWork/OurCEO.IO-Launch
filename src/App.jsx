import React, { useEffect, useState } from "react";
import logoLight from "/logo-light.png";
import logoDark from "/logo-grindset.png";

const FLIP_LINK = "https://www.instagram.com/flipvertising";

export default function App() {
  const [scenario, setScenario] = useState(null);
  const [voted, setVoted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  const [theme, setTheme] = useState("cutie");

  useEffect(() => {
    fetch("/api/scenario")
      .then((r) => r.json())
      .then(setScenario)
      .catch(console.error);

    const mq = window.matchMedia("(orientation: landscape)");
    const h = (e) => setIsLandscape(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const vote = async (i) => {
    await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({ optionIndex: i }),
    });
    setVoted(true);
  };

  if (!scenario)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );

  const t = theme === "grindset";

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-4 ${
        t ? "bg-gray-900 text-white" : "bg-pink-50 text-black"
      }`}
    >
      <header className="w-full max-w-md mb-4 flex items-center justify-between">
        <img src={t ? logoDark : logoLight} className="h-10" />
        <button
          onClick={() => setTheme(t ? "cutie" : "grindset")}
          className={`px-3 py-1 rounded text-sm font-semibold shadow ${
            t ? "bg-white text-gray-900" : "bg-gray-900 text-white"
          }`}
        >
          Switch to {t ? "Cutie" : "Grindset"}
        </button>
      </header>
import React, { useEffect, useState } from "react";
import logoLight from "/logo-light.png";
import logoDark from "/logo-grindset.png";

const FLIP_LINK = "https://www.instagram.com/flipvertising";

export default function App() {
  const [scenario, setScenario] = useState(null);
  const [voted, setVoted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  const [theme, setTheme] = useState("cutie");

  useEffect(() => {
    fetch("/api/scenario")
      .then((r) => r.json())
      .then(setScenario)
      .catch(console.error);

    const mq = window.matchMedia("(orientation: landscape)");
    const h = (e) => setIsLandscape(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const vote = async (i) => {
    await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({ optionIndex: i }),
    });
    setVoted(true);
  };

  if (!scenario)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );

  const t = theme === "grindset";

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-4 ${
        t ? "bg-gray-900 text-white" : "bg-pink-50 text-black"
      }`}
    >
      <header className="w-full max-w-md mb-4 flex items-center justify-between">
        <img src={t ? logoDark : logoLight} className="h-10" />
        <button
          onClick={() => setTheme(t ? "cutie" : "grindset")}
          className={`px-3 py-1 rounded text-sm font-semibold shadow ${
            t ? "bg-white text-gray-900" : "bg-gray-900 text-white"
          }`}
        >
          Switch to {t ? "Cutie" : "Grindset"}
        </button>
      </header>

      <p className="max-w-md text-center mb-6 whitespace-pre-line">
        {scenario.body}
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        {scenario.choices.slice(0, 4).map((c, i) => (
          <button
            key={i}
            onClick={() => vote(i)}
            disabled={voted}
            className="relative h-40 rounded-lg overflow-hidden shadow disabled:opacity-60"
          >
            <img
              src={c.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
              <span className="text-sm font-semibold">{c.text}</span>
              <span className="text-xs opacity-80">{c.effect}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-center opacity-90">{scenario.guiltTrip}</p>

      {isLandscape && (
        <aside className="fixed right-0 top-0 w-64 h-screen bg-white text-black shadow-lg p-4 border-l border-gray-300 z-50">
          <img src={scenario.ad} alt="ad" className="w-full rounded mb-2" />
          <p className="text-xs text-center text-gray-600 mb-1">
            {scenario.thankYou}
          </p>
          <a
            href={FLIP_LINK}
            target="_blank"
            rel="noreferrer"
            className="block text-[10px] text-center text-emerald-500 underline"
          >
            Powered by Flipvertising™
          </a>
        </aside>
      )}
    </div>
  );
}

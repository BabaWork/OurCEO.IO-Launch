/* --------------  src/App.jsx (entire file)  -------------- */
import React, { useEffect, useState } from "react";
import { fetchTodayScenario } from "./utils/fetchTodayScenario";
import logoLight from "/logo-light.png";
import logoDark  from "/logo-grindset.png";

export default function App() {
  const [scenario, setScenario]  = useState(null);
  const [selected, setSelected]  = useState(null);
  const [theme,    setTheme]     = useState("cutie");
  const [loading,  setLoading]   = useState(true);
  const [error,    setError]     = useState("");
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" &&
    (window.innerWidth > 768 || window.innerHeight < window.innerWidth)
  );

  useEffect(() => {
    fetchTodayScenario()
      .then(setScenario)
      .catch(err => setError(err.message || "API error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () =>
      setIsLandscape(window.innerWidth > 768 || window.innerHeight < window.innerWidth);
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);

  const isGrind = theme === "grindset";
  const toggleTheme = () => setTheme(isGrind ? "cutie" : "grindset");

  if (loading) return <div className="h-screen flex items-center justify-center">Loading…</div>;
  if (error || !scenario) return <div className="p-6 text-red-600">⚠️ {error || "No data"}</div>;

  return (
    <div className={`${isGrind ? "bg-gray-900 text-white" : "bg-pink-50 text-black"} min-h-screen flex flex-col items-center p-4`}>

      {/* header */}
      <header className="w-full max-w-md mb-4 flex items-center justify-between">
        <img src={isGrind ? logoDark : logoLight} className="h-10" />
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded text-sm font-semibold shadow transition ${
            isGrind ? "bg-white text-gray-900" : "bg-gray-900 text-white"
          }`}
        >
          Switch to {isGrind ? "Cutie" : "Grindset"}
        </button>
      </header>

      {/* prompt */}
      <section className={`w-full max-w-md mb-5 p-4 rounded-xl shadow border ${isGrind ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <h2 className="font-semibold mb-1">📣 Today’s Scenario</h2>
        <p>{scenario.prompt}</p>
      </section>

      {/* vote grid OR result */}
      {selected === null ? (
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {scenario.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className="relative h-40 rounded-lg overflow-hidden shadow hover:scale-105 transition"
              style={{
                backgroundImage: `url(${opt.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
                <span className="text-white text-center text-sm leading-snug">
                  {opt.text}
                  <br />
                  <span className="text-xs opacity-80">{opt.effect}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-3 max-w-md">
          <p className="text-xl font-bold">{scenario.options[selected].effect}</p>
          <p className="italic text-sm opacity-70">{scenario.options[selected].feedback}</p>
          <p className="text-green-500 font-medium">{scenario.thankYou}</p>
          <p className="text-xs opacity-60">
            Today’s charity:&nbsp;
            <a href={scenario.charityLink} target="_blank" rel="noreferrer" className="underline">
              {scenario.charity}
            </a>
          </p>
        </div>
      )}

      {/* -------- Flipvertising™ sidebar (landscape) -------- */}
      {isLandscape && (
        <aside className="fixed right-0 top-0 w-64 h-screen bg-white shadow-lg p-4 border-l border-gray-300 z-50 text-black">
          {/* ad creative */}
          {scenario.ad && (
            <img src={scenario.ad} alt="ad" className="w-full rounded mb-2" />
          )}

          {/* daily thanks (only landscape) */}
          <p className="text-xs text-center text-gray-600 mb-1">{scenario.thankYou}</p>

          {/* powered-by tagline */}
          <p className="text-[10px] text-center text-gray-400">
            Powered&nbsp;by&nbsp;<span className="italic">Flipvertising™</span>
          </p>
        </aside>
      )}

      {/* -------- Guilt trip bar (portrait only) -------- */}
      {!isLandscape && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-100 text-red-600 text-center p-2 text-sm shadow z-50">
          {scenario.guiltTrip}
        </div>
      )}
    </div>
  );
}

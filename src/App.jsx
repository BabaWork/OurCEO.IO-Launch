import React, { useEffect, useState } from "react";
import { fetchTodayScenario } from "./utils/fetchTodayScenario";
import logoLight from "/logo-light.png";
import logoDark from "/logo-grindset.png";

export default function App() {
  /* ---------- state ---------- */
  const [scenario, setScenario] = useState(null);
  const [selected, setSelected] = useState(null); // index of choice
  const [theme, setTheme] = useState("cutie"); // cutie | grindset
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- fetch once on mount ---------- */
  useEffect(() => {
    fetchTodayScenario()
      .then((data) => setScenario(data))
      .catch((err) => setError(err.message || "API error"))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- helpers ---------- */
  const isGrind = theme === "grindset";
  const isVertical =
    typeof window !== "undefined" &&
    window.innerHeight > window.innerWidth;

  const toggleTheme = () => setTheme(isGrind ? "cutie" : "grindset");

  /* ---------- early returns ---------- */
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">Loading…</div>
    );
  if (error || !scenario)
    return <div className="p-6 text-red-600">⚠️ {error || "No data"}</div>;

  /* ---------- render ---------- */
  return (
    <div
      className={`${
        isGrind ? "bg-gray-900 text-white" : "bg-pink-50 text-black"
      } min-h-screen flex flex-col items-center p-4`}
    >
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
      <section
        className={`w-full max-w-md mb-5 p-4 rounded-xl shadow border ${
          isGrind ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="font-semibold mb-1">📣 Today’s Scenario</h2>
        <p>{scenario.prompt}</p>
      </section>

      {/* vote grid or result */}
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
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2">
                <span className="text-white text-center text-sm leading-snug">
                  {opt.text}
                  <br className="hidden sm:block" />
                  <span className="text-xs opacity-80">{opt.effect}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-3 max-w-md">
          <p className="text-xl font-bold">
            {scenario.options[selected].effect}
          </p>
          <p className="italic text-sm opacity-70">
            {scenario.options[selected].feedback}
          </p>
          <p className="text-green-500 font-medium">{scenario.thankYou}</p>
          <p className="text-xs opacity-60">
            Today’s charity:&nbsp;
            <a
              href={scenario.charityLink}
              target="_blank"
              className="underline"
            >
              {scenario.charity}
            </a>
          </p>
        </div>
      )}

      {/* guilt trip bar — only visible in vertical mode */}
      {isVertical && (
        <div className="fixed bottom-4 inset-x-4 bg-yellow-100 border border-yellow-300 text-yellow-900 text-sm font-medium p-3 rounded-xl shadow text-center z-50">
          {scenario.guiltTrip}
        </div>
      )}
    </div>
  );
}

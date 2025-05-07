import React, { useEffect, useState } from "react";
import { fetchTodayScenario } from "./utils/fetchTodayScenario";
import logoLight from "/logo-light.png";
import logoDark from "/logo-grindset.png";

export default function App() {
  const [scenario, setScenario] = useState(null);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState("cutie");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== "undefined" &&
      (window.innerWidth > 768 || window.innerHeight < window.innerWidth)
  );

  useEffect(() => {
    fetchTodayScenario()
      .then(setScenario)
      .catch((err) => setError(err.message || "API error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () =>
      setIsLandscape(
        window.innerWidth > 768 || window.innerHeight < window.innerWidth
      );
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);

  useEffect(() => {
    if (isLandscape) {
      const adScript = document.createElement("script");
      adScript.src = "https://vemtoutcheeg.com/400/9300933";
      adScript.async = true;
      const adZone = document.getElementById("propeller-sidebar");
      if (adZone && !adZone.hasChildNodes()) {
        adZone.appendChild(adScript);
      }
    }
  }, [isLandscape]);

  const isGrind = theme === "grindset";
  const toggleTheme = () => setTheme(isGrind ? "cutie" : "grindset");

  if (loading)
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  if (error || !scenario)
    return <div className="p-6 text-red-600">⚠️ {error || "No data"}</div>;

  return (
    <div
      className={`${isGrind ? "bg-gray-900 text-white" : "bg-pink-50 text-black"} min-h-screen flex flex-col lg:flex-row p-4`}
    >
      {/* ⬅️ Sidebar with optional ad */}
      <aside className="lg:w-64 w-full mb-4 lg:mb-0 lg:mr-6">
        <div className="flex items-center justify-between mb-4">
          <img src={isGrind ? logoDark : logoLight} className="h-10" />
          <button
            onClick={toggleTheme}
            className={`px-3 py-1 rounded text-sm font-semibold shadow transition ${
              isGrind ? "bg-white text-gray-900" : "bg-gray-900 text-white"
            }`}
          >
            Switch to {isGrind ? "Cutie" : "Grindset"}
          </button>
        </div>

        {isLandscape && (
          <div id="propeller-sidebar" className="mt-4 w-full flex justify-center p-2" />
        )}
      </aside>

      {/* 👉 Main content */}
      <main className="flex-1 max-w-2xl mx-auto">
        <section
          className={`mb-5 p-4 rounded-xl shadow border ${
            isGrind ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="font-semibold mb-1"> M-" Today’s Scenario</h2>
          <p>{scenario.prompt}</p>
        </section>

        {selected === null ? (
          <div className="grid grid-cols-2 gap-3">
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
                    <br />
                    <span className="text-xs opacity-80">{opt.effect}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-xl font-bold">{scenario.options[selected].effect}</p>
            <p className="italic text-sm opacity-70">{scenario.options[selected].feedback}</p>
            <p className="text-green-500 font-medium">{scenario.thankYou}</p>
            <p className="text-xs opacity-60">
              Today’s charity:&nbsp;
              <a
                href={scenario.charityLink}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {scenario.charity}
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

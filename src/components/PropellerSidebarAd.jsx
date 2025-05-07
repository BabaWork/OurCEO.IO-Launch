import { useEffect, useState } from "react";

export default function PropellerSidebarAd() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const landscape =
        window.innerWidth > window.innerHeight ||
        window.matchMedia("(orientation: landscape)").matches;
      setIsLandscape(landscape);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  useEffect(() => {
    if (isLandscape) {
      const adScript = document.createElement("script");
      adScript.src = "https://vemtoutcheeg.com/400/9300933";
      adScript.async = true;
      const container = document.getElementById("propeller-ad-zone");
      if (container && !container.hasChildNodes()) {
        container.appendChild(adScript);
      }
    }
  }, [isLandscape]);

  if (!isLandscape) return null;

  return (
    <div id="propeller-ad-zone" className="w-full flex justify-center p-2">
      {/* Propeller display ad renders here */}
    </div>
  );
}

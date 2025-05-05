import React, { useEffect, useState } from "react";

function GuiltTrip({ text }) {
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  if (!isPortrait || !text) return null;

  return (
    <div className="guilt-trip">
      <p>{text}</p>
    </div>
  );
}

export default GuiltTrip;

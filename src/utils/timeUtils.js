// timeUtils.js
export function getTodayResetKey() {
  const now = new Date();
  const est = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const datePart = est.toISOString().split('T')[0];
  return `ourceo_vote_${datePart}`;
}

export function getTimeUntilNextReset() {
  const now = new Date();
  const tomorrow = new Date();

  // Set reset to 11AM EST → which we convert to UTC
  const reset = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
      .replace(/(\d{4}-\d{2}-\d{2}).*/, "$1T11:00:00")
  );

  const resetUTC = new Date(reset.toLocaleString("en-US", { timeZone: "UTC" }));

  // If it's past 11AM EST today, set to tomorrow
  if (now >= resetUTC) {
    tomorrow.setUTCDate(now.getUTCDate() + 1);
    resetUTC.setUTCDate(tomorrow.getUTCDate());
  }

  return resetUTC - now;
}

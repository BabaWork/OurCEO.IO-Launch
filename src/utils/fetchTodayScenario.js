export async function fetchTodayScenario() {
  const res = await fetch("/api/scenario");
  if (!res.ok) throw new Error("Failed to fetch scenario");
  return await res.json();
}

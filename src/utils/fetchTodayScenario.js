export async function fetchTodayScenario() {
  const res = await fetch('/api/scenario');
  if (!res.ok) throw new Error('No scenario today');
  return res.json();
}

export async function fetchTodayScenario() {
  try {
    const res = await fetch('http://localhost:3001/api/scenario');
    if (!res.ok) throw new Error('No scenario found');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching scenario:', err);
    return null;
  }
}

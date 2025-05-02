import { notion } from '../src/utils/notionClient.js';
import { fetchTodayScenario } from '../src/utils/fetchTodayScenario.js';

export default async (_req, res) => {
  try {
    const data = await fetchTodayScenario();
    res.status(200).json(data ?? { error: 'no-scenario' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server-error' });
  }
};


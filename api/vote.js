import { submitVote } from '../src/utils/fetchTodayScenario.js';

export default async (req, res) => {
  try {
    const { optionIndex } = JSON.parse(req.body);
    await submitVote(optionIndex);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server-error' });
  }
};

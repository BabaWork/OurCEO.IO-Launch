import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.VITE_NOTION_SECRET });
const databaseId = process.env.VITE_NOTION_DATABASE_ID;

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { results } = await notion.databases.query({
      database_id: databaseId,
      filter: { property: 'Date', date: { equals: today } },
    });

    if (!results[0]) return res.status(404).json({ error: 'No scenario today' });

    const entry   = results[0];
    const txt = (p) => entry.properties[p]?.rich_text?.[0]?.plain_text || '';
    const url = (p) => entry.properties[p]?.url || '';

    res.json({
      prompt: txt('Scenario'),
      options: [1, 2, 3, 4].map(i => ({
        text:     txt(`Choice ${i}`),
        effect:   txt(`Effect ${i}`),
        image:    url(`Image ${i}`),
        feedback: txt(`Feedback ${i}`),
      })),
      ad:         url('Fake Ad Link'),
      thankYou:   txt('Thank You'),
      guiltTrip:  txt('Guilt Trip'),
      charity:    txt('Charity'),
      charityLink: url('Charity Link'),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notion fetch failed' });
  }
}

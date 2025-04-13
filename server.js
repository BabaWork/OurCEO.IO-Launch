import express from 'express';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.VITE_NOTION_SECRET });
const databaseId = process.env.VITE_NOTION_DATABASE_ID;

app.get('/api/scenario', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Date',
        date: { equals: today },
      },
    });

    const entry = response.results[0];
    if (!entry) return res.status(404).json({ error: 'No scenario today' });

    // DEBUG OUTPUT 👇
    console.log('👉 Full Notion Entry:\n', JSON.stringify(entry.properties, null, 2));
    console.log('👉 Scenario Field:\n', entry.properties['Scenario']);

    const getText = (prop) => entry.properties[prop]?.rich_text?.[0]?.plain_text || '';
    const getUrl = (prop) => entry.properties[prop]?.url || '';

    const data = {
      prompt: getText('Scenario'),
      options: [1, 2, 3, 4].map((i) => ({
        text: getText(`Choice ${i}`),
        effect: getText(`Effect ${i}`),
        image: getUrl(`Image ${i}`),
        feedback: getText(`Feedback ${i}`),
      })),
      ad: getUrl('Fake Ad Link'),
      thankYou: getText('Thank You'),
      guiltTrip: getText('Guilt Trip'),
      charity: getText('Charity'),
      charityLink: getUrl('Charity Link'),
    };

    res.json(data);
  } catch (err) {
    console.error('❌ Notion error:', err);
    res.status(500).json({ error: 'Failed to fetch from Notion' });
  }
});

app.listen(3001, () => {
  console.log('✅ API server running at http://localhost:3001');
});

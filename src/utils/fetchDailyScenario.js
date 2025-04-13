import { notion, databaseId } from './notionClient';

export async function fetchTodayScenario() {
  const today = new Date().toISOString().split('T')[0];

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Date',
      date: {
        equals: today,
      },
    },
  });

  const entry = response.results[0];

  if (!entry) return null;

  const getText = (prop) =>
    entry.properties[prop]?.rich_text?.[0]?.plain_text || '';

  const getUrl = (prop) =>
    entry.properties[prop]?.url || '';

  return {
    prompt: getText('Scenario Prompt'),
    options: [
      {
        text: getText('Choice 1'),
        effect: getText('Effect 1'),
        image: getUrl('Image 1'),
        feedback: getText('Feedback 1'),
      },
      {
        text: getText('Choice 2'),
        effect: getText('Effect 2'),
        image: getUrl('Image 2'),
        feedback: getText('Feedback 2'),
      },
      {
        text: getText('Choice 3'),
        effect: getText('Effect 3'),
        image: getUrl('Image 3'),
        feedback: getText('Feedback 3'),
      },
      {
        text: getText('Choice 4'),
        effect: getText('Effect 4'),
        image: getUrl('Image 4'),
        feedback: getText('Feedback 4'),
      },
    ],
    ad: getUrl('Fake Ad Link'),
    thankYou: getText('Thank You'),
    charity: getText('Charity'),
    charityLink: getUrl('Charity Link'),
  };
}

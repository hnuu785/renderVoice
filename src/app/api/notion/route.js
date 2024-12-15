import notion from '@/lib/notionClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const data = response.results.map((page) => ({
      name: page.properties.Name.title[0],
      gender: page.properties.Gender.rich_text[0],
      age: page.properties.Age.rich_text[0],
      region: page.properties.PreferredRegions.rich_text[0],
      phone: page.properties.Phone.rich_text[0],
      hobby: page.properties.Hobbies.rich_text[0],
      personality: page.properties.Personality.rich_text[0],
      frequency: page.properties.ContactFrequency.rich_text[0],
      conStyle: page.properties.ConversationStyle.rich_text[0],
      conType: page.properties.ConversationType.rich_text[0],  
      dataStyle: page.properties.DateStyle.rich_text[0],
      firstWish: page.properties.FirstWish.rich_text[0],
      activity: page.properties.FreeTimeActivity.rich_text[0],
      friend: page.properties.FriendRelationship.rich_text[0],
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Notion data:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

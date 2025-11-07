import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.02,
    });

    const reply = completion.choices[0].message;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'GPT error', error: error.message });
  }
}

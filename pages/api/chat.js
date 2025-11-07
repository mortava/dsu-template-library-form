import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured');
    return res.status(500).json({
      message: 'OpenAI API key is not configured',
      error: 'Missing OPENAI_API_KEY environment variable'
    });
  }

  try {
    const { messages } = req.body;

    console.log('Calling OpenAI API with model: gpt-4o');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.02,
    });

    const reply = completion.choices[0].message;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('API error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type
    });

    res.status(500).json({
      message: 'GPT error',
      error: error.message,
      details: error.status || 'Unknown error'
    });
  }
}

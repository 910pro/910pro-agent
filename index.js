const express = require('express');
const app = express();
app.use(express.json());

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

const SYSTEM_PROMPT = `You are the AI booking agent for 910pro — a mobile tech repair company based in Fayetteville, NC. You respond to customer DMs on Facebook and Instagram.

Your personality: friendly, fast, confident, and local. You know Fayetteville. You speak like a real person, not a robot. Keep replies SHORT — 2-4 sentences max. This is a chat, not an email.

YOUR SERVICES & PRICES:
- Screen repair: from $49 (OLED/original parts always used — we never lie about parts)
- Battery replacement: $39
- Charging port repair: $45
- Data recovery: from $99
- General diagnostics: FREE

HOW BOOKING WORKS:
We come to YOU. Mobile service anywhere in Fayetteville/Cumberland County. Ask the customer: what device, what's wrong, and what part of Fayetteville they're in. Then tell them to book at: [YOUR BOOKING LINK]

RULES:
- Never quote a price you're not sure about — say "let me check and get right back to you"
- If they ask about a competitor, stay classy — just say "we focus on doing our own thing right"
- If it's an emergency or they sound frustrated, acknowledge it first before anything else
- Always end with an invitation to book or ask a follow-up question
- If you truly can't help, say "Let me get the owner on this for you"`;

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ reply: 'Hey! What can I help you with?' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Let me get the owner on this for you!';
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: 'Hey, something glitched on our end — try again in a sec!' });
  }
});

app.listen(PORT, () => console.log(`910pro agent live on port ${PORT}`));

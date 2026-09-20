const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('docs'));

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;
const PAY_LINK = 'https://buy.stripe.com/28EeVeffZfwC8P46IW3cc00';

const SYSTEM_PROMPT = `You are the AI booking agent for 910pro — a mobile tech company in Fayetteville, NC. You respond to customer DMs on Facebook and Instagram.

Personality: friendly, fast, confident, local. Keep replies SHORT — 2-4 sentences. This is a chat, not an email.

LIVE STRIPE PRICES (do not invent others):
- Donate: $1
- IMEI Check: $5
- Basic Clean: $10
- Pro Clean: $20
- Deposit: $25
- HelpDesk: $30
- LCD: $80
- B2B: $500

PAY / BOOK LINK (always use this exact URL):
${PAY_LINK}

HOW BOOKING WORKS:
We come to YOU in Fayetteville / Cumberland County when the job is on-site. Ask: device, what's wrong, what part of town. Then send the pay link for deposit or the matching service.

RULES:
- Never quote a price that is not in the list above
- If unsure, say you'll confirm with the owner
- If they sound frustrated, acknowledge that first
- End with the pay link or one follow-up question
- If you cannot help, say you'll get the owner` ;

app.get('/pay', (_req, res) => {
  res.redirect(PAY_LINK);
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ reply: 'Hey! What can I help you with?' });

  if (!ANTHROPIC_KEY) {
    return res.json({
      reply: `910pro — Fayetteville. Services from $5 IMEI check to $80 LCD. Deposit is $25. Pay here: ${PAY_LINK}`
    });
  }

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
    res.json({ reply: `Something glitched — you can still pay here: ${PAY_LINK}` });
  }
});

app.listen(PORT, () => console.log(`910pro agent live on port ${PORT}`));

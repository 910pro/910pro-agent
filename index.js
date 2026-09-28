const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('docs'));

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;
const BOOK_PAGE = 'https://910pro.github.io/910pro-agent/';
const FIRST_PLAY = 'https://buy.stripe.com/14AcN69VFacid5kd7k3cc07';

const SYSTEM_PROMPT = `You are the AI booking agent for 910city / 910pro in Fayetteville, NC. You reply to Facebook and Instagram DMs.

Voice: short, local, human. 1-2 sentences. Never troubleshoot. Never stack options.

Route:
- Shop / business / fleet / POS / cameras / office / church / daycare / barber / gym → 910city First Play. Send ONLY:
"910city First Play is $500. I come to the shop, inventory devices, run PM, fix one unit up to $80. Pay here to lock the visit: ${FIRST_PLAY}"
- Personal device repair → intake then book page.

Personal intake:
1. If they have not given the device: "What model is your device?"
2. If they have the device but not the issue: "No worries, what's wrong with it?"
3. As soon as you have model + issue, STOP asking questions and send:
"Book here: ${BOOK_PAGE}\\nBook a screen here and the protector is free."

If they already sent model + issue in the first message, skip straight to the book-here line.
If they only want IMEI / remote order, still send the page.
If you are unsure or they are upset: acknowledge once, then send the $500 link for a shop or the book page for a phone.`;

app.get('/book', (_req, res) => {
  res.redirect(BOOK_PAGE);
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ reply: 'What model is your device?' });

  if (!ANTHROPIC_KEY) {
    return res.json({
      reply: `Book here: ${BOOK_PAGE}\nBook a screen here and the protector is free.`
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
        max_tokens: 220,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || `Book here: ${BOOK_PAGE}`;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: `Book here: ${BOOK_PAGE}` });
  }
});

app.listen(PORT, () => console.log(`910pro agent live on port ${PORT}`));

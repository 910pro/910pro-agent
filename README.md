# 910pro-agent

Mobile tech assistant + live Stripe checkout for 910pro (Fayetteville, NC).

## Pay customers with this link
https://buy.stripe.com/28EeVeffZfwC8P46IW3cc00

That one link includes every live product. Customer picks quantity on Stripe Checkout.

Preview page: `docs/index.html`

## Live prices (Stripe)
- Donate $1
- IMEI Check $5
- Basic Clean $10
- Pro Clean $20
- Deposit $25
- HelpDesk $30
- LCD $80
- B2B $500

## Run the chat agent
```
npm install
ANTHROPIC_API_KEY=... npm start
```
POST `/chat` with `{ "message": "..." }`.

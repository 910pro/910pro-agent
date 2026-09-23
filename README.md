# 910pro-agent

Live page (GitHub Pages, `/docs`):
https://910pro.github.io/910pro-agent/

$25 deposit:
https://buy.stripe.com/dRm14o3xhckq1mCd7k3cc04

## Turn Pages on (one time)
Repo Settings → Pages → Deploy from a branch → `main` / `/docs` → Save.

Then that URL is the main 910pro link for IG, Google, NFC, and ManyChat.

## Chat agent
```
npm install
ANTHROPIC_API_KEY=... npm start
```

POST `/chat` with `{ "message": "..." }`.
After model + issue the agent sends the live page, not a long quote.

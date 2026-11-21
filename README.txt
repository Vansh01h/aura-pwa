AURA — switch Cloudflare Worker from OpenAI to OpenRouter

1. In Cloudflare, open Workers & Pages > aura-backend > Settings > Variables and Secrets.
2. Add a Production Secret:
   Name: OPENROUTER_API_KEY
   Value: paste your OpenRouter key privately
   Tick Secret, then save/deploy.
   (You can remove the old OPENAI_API_KEY secret after confirming the new connection works.)
3. Open aura-backend > Edit code / Quick edit.
4. Replace all contents of worker.js with the worker.js file in this folder.
5. Deploy.
6. Keep AURA's backend URL unchanged:
   https://aura-backend.chaudharyvansh90507.workers.dev
7. Test chat from https://vansh01h.github.io/aura-pwa/

The Worker uses OpenRouter's openrouter/free model router. Free models have variable availability, rate limits, and may change. This is not unlimited guaranteed free service. Never put the API key in GitHub or the browser.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues on magnusheino/vodigitalisering (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Calendar content

Behaviour and design decisions are in `docs/spec.md`. Uppdrag and the kalenderkanalen link live in `src/innehall.ts`; lucka positions in `src/placering.ts`. When the arrangör asks to change, swap or move an uppdrag:

- Write it in Swedish, addressed to the deltagare as "du", one to three short paragraphs, the last one saying what to post.
- Keep it **AI-free**: the inlämning is a photo or sound of something physical, or rests on knowledge only this workplace has. Text an AI could produce on request does not count.
- Make it doable both at the office and at home, in about ten minutes, with things already at hand.
- Keep the rubrik from giving away a puzzle's solution.
- Set `inlamning: 'startinlägg'` when deltagare answer a post the arrangör makes; tell the arrangör what to post and when.
- Moving an uppdrag to another date means moving its entry in `placering.ts` too.

Done when `npm test` passes; it validates dates and placements.

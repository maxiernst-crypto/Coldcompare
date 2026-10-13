# Brand identity

## Name options

Domain and trademark availability were **not checked** (no registrar/trademark lookup was possible from the build environment). Check `.com`, `.co.uk` and `.de`, plus UKIPO, DPMA and EUIPO, before committing.

| # | Name | Domain idea | Why it works | Watch-outs |
|---|---|---|---|---|
| 1 | **ColdCompare** (recommended) | coldcompare.com / .de / .co.uk | "Cold storage" + "compare" says exactly what the site does; short; pronounceable in English and German; not tied to one coin or vendor | "Cold" alone is generic, so the brand relies on the compound |
| 2 | KeyVerdict | keyverdict.com | Keys = self-custody; "verdict" = reviews | "Verdict" reads less naturally in German |
| 3 | SelfCustody Guide | selfcustody.guide | Exact topical match; strong for education | Long; `.guide` TLD less trusted by some users |
| 4 | WalletAtlas | walletatlas.com | Broad, scalable to software wallets later | Less specific to hardware/security |
| 5 | SignerCheck | signercheck.com | Accurate modern term ("signing device") | Jargon for beginners |

**Recommendation: ColdCompare.** It carries the core commercial intent (comparison) and the security concept (cold storage) without naming any coin or manufacturer, which keeps it neutral and avoids trademark conflicts with vendors. The name is a single constant in `src/lib/site.ts` and the dictionaries, so it can be changed in minutes.

## Positioning

> Independent, transparent hardware-wallet comparisons — security first, sources shown, nothing for sale in the rankings.

Tone: calm, precise, plain-language; no hype, no price speculation, no "moon" imagery. Security warnings are direct.

## Visual system

- **Palette** (CSS tokens in `src/app/globals.css`): near-black ink `#0B0F14`, white/very light grey surfaces, neutral greys for UI. **Bitcoin orange `#F7931A`** is used sparingly for accents (logo keyhole, primary "Find my wallet" CTA, score bars), with `#C46A00` for orange text that meets contrast requirements. Semantic colours: green (verified/pros), amber (unverified/warnings), red (critical advisories/cons), blue (manufacturer claims/info).
- **Dark mode**: full token set; follows the system setting with a manual toggle.
- **Type**: Inter Variable (self-hosted via Fontsource — no third-party font requests), tabular numerals for prices and scores.
- **Logo**: rounded dark tile with an orange keyhole (SVG, `public/icon.svg`).
- **Imagery**: neutral form-factor illustrations until properly licensed product photos are added (admin has image URL, credit and licence fields). Do not use manufacturer images without permission.
- **Sponsored vs editorial**: sponsored placements use a dashed border, a grey background and a "Sponsored" label; they never appear inside rankings, picks, comparison tables or the quiz.

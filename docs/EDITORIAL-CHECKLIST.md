# Editorial checklist (required before publishing)

The admin enforces these for articles (status `published` requires all boxes ticked plus a fact-check date); wallet profiles require a "specs last verified" date.

1. Every factual claim checked against a primary source (official docs, source code, certificate, audit). Update each attribute's **fact status**.
2. No hands-on testing claimed unless it took place.
3. Prices, availability and firmware versions confirmed on the date shown. Set price fact status to `verified` and update `priceCheckedAt`; add GBP prices.
4. Security advisories current and accurately summarised, linked to the vendor's own notice.
5. Affiliate links disclosed; picks and scores not influenced by commission.
6. Title, meta description and internal links in place; no keyword stuffing.

## Items flagged during research (verify first)

- **All prices**: sources disagreed (e.g. Trezor Safe 3/5 and BitBox02 Nova); every price is `unverified`. No GBP prices are seeded.
- **COLDCARD 2026 entropy advisory**: confirm wording, version numbers and dates against coldcard.com/security/status. COLDCARD Mk4 is a **draft** — check whether it is still sold or replaced by the Mk5 (no Mk5 profile yet).
- **Trezor Safe 3 researcher report (2025)**: confirm details and date against primary sources.
- **Blockstream Jade 1.0.37/1.0.38 fix**: confirm against Blockstream's own notice. Jade Core is a **draft** (confirm camera/QR support).
- **Manufacturer HQ** for Keystone, SafePal and OneKey: sources conflicted; left blank.
- **NGRAVE ZERO** passphrase/multisig and **Tangem** passphrase: marked unverified.
- **Foundation Passport Prime**: confirm Bitcoin-only scope and current price.
- **Shipping and warranty** for every product: not yet researched (marked "not yet verified").
- **Legal pages**: templates — have them reviewed by a lawyer; fill operator details in Settings.

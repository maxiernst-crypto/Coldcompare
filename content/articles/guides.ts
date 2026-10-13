import type { SeedArticle } from "./types";

/** Picks are editorial choices justified in the text; scores and attributes are shown live from the product database. */
export const guides: SeedArticle[] = [
  {
    type: "guide",
    locale: "en",
    slug: "best-hardware-wallets",
    translationKey: "guide-best",
    title: "The Best Hardware Wallets in 2026",
    metaTitle: "Best Hardware Wallets 2026: Independent, Security-First Picks",
    metaDescription:
      "The best hardware wallets for Bitcoin and crypto in 2026, picked with a transparent scoring model: best overall, for beginners, Bitcoin-only, air-gapped and multi-chain.",
    excerpt: "Our top picks across use cases, with the reasoning — and the caveats — behind each one.",
    productSlugs: ["bitbox02", "trezor-safe-3", "trezor-safe-5", "ledger-flex", "blockstream-jade-plus", "keystone-3-pro"],
    data: {
      picks: [
        { product: "bitbox02", label: "Best overall for most people" },
        { product: "trezor-safe-3", label: "Best value" },
        { product: "trezor-safe-5", label: "Best open-source touchscreen" },
        { product: "ledger-flex", label: "Best for multi-chain & DeFi" },
        { product: "blockstream-jade-plus", label: "Best affordable air-gap option for Bitcoin" },
        { product: "keystone-3-pro", label: "Best air-gapped multi-chain" },
      ],
      faqs: [
        { q: "What is the most secure hardware wallet?", a: "There is no single answer. Security depends on your threat model, how you back up your seed and whether you use features like passphrases or multisig. Our scores weigh security architecture most heavily, but a well-backed-up mid-range device is safer than a premium device with a poor backup." },
        { q: "Do I need a hardware wallet?", a: "If you hold an amount of crypto you could not afford to lose, a hardware wallet keeps your keys offline and away from malware on your computer or phone." },
        { q: "How did you choose these picks?", a: "We combine our published scores with the use case each device suits best. Affiliate commissions are not an input." },
      ],
    },
    body: `
There is no single "best" hardware wallet — the right choice depends on what you hold, which devices you use, and how much complexity you are willing to manage. These picks come from our [published scoring model](/en/methodology) plus a judgement about who each device serves best. Not sure where you fit? Try the [wallet finder](/en/quiz).

[[picks]]

## How the picks compare

[[table:bitbox02,trezor-safe-3,trezor-safe-5,ledger-flex]]

## Why these picks

**BitBox02 — best overall for most people.** It combines open-source firmware, a secure chip, a Bitcoin-only option and the easiest robust backup we know of (microSD plus standard words). Its main gap is iPhone support; iPhone users should consider the BitBox02 Nova or Trezor Safe 7.

**Trezor Safe 3 — best value.** A secure element, open-source firmware and multi-share backups at an entry-level price. Buttons and a small screen are the compromise.

**Trezor Safe 5 — best open-source touchscreen.** The same security model as the Safe 3, with a touchscreen that makes on-device PIN and passphrase entry and address checks more comfortable.

**Ledger Flex — best for multi-chain and DeFi.** A large E Ink screen for reviewing complex transactions and unmatched asset support. You must be comfortable with Ledger's closed secure-element OS.

**Blockstream Jade Plus — best affordable air-gap option for Bitcoin.** Open source, camera-based QR signing and iPhone support. It has no conventional secure element; understand its blind-oracle model first.

**Keystone 3 Pro — best air-gapped multi-chain.** QR-only signing, a large touchscreen and a Bitcoin-only firmware option.

## What about COLDCARD?

The COLDCARD Q remains an exceptionally capable Bitcoin signer, but after the 2026 seed-generation flaw we are not including it as a headline pick until the fix has a longer track record. Experienced users may still choose it — read our [review](/en/wallets/coldcard-q) and the advisory first.

## Before you buy

- Buy from the manufacturer or an authorised reseller, never second-hand. See [how to buy and verify a hardware wallet](/en/learn/how-to-buy-and-verify-a-hardware-wallet).
- Plan your backup before your device arrives: [how to back up Bitcoin securely](/en/learn/how-to-back-up-bitcoin).
- Never type your recovery phrase into a computer, phone or website.
`,
  },
  {
    type: "guide",
    locale: "en",
    slug: "best-bitcoin-hardware-wallets",
    translationKey: "guide-best-bitcoin",
    title: "The Best Bitcoin Hardware Wallets (Bitcoin-Only Picks)",
    metaTitle: "Best Bitcoin Hardware Wallets 2026: Bitcoin-Only Devices Compared",
    metaDescription:
      "The best Bitcoin-only hardware wallets and Bitcoin-only firmware options in 2026, compared on security, air-gap, multisig and ease of use.",
    excerpt: "Devices and firmware editions built for Bitcoin alone — and why a smaller codebase matters.",
    productSlugs: ["bitbox02", "blockstream-jade-plus", "trezor-safe-5", "foundation-passport-prime", "coldcard-q"],
    data: {
      picks: [
        { product: "bitbox02", label: "Best for most Bitcoiners (Bitcoin-only edition)" },
        { product: "blockstream-jade-plus", label: "Best value with air-gap option" },
        { product: "trezor-safe-5", label: "Best with multi-share backups (Bitcoin-only firmware)" },
        { product: "foundation-passport-prime", label: "Best premium Bitcoin device" },
        { product: "coldcard-q", label: "Most advanced features (read the 2026 advisory)" },
      ],
      faqs: [
        { q: "Why choose a Bitcoin-only wallet?", a: "Bitcoin-only firmware contains no code for other blockchains, which reduces the attack surface and the number of updates that could introduce bugs." },
        { q: "Can I add altcoins later?", a: "Not on Bitcoin-only firmware. Some devices (BitBox02, Trezor) let you choose a different edition or firmware; dedicated Bitcoin-only devices cannot." },
      ],
    },
    body: `
If you only hold Bitcoin, a **Bitcoin-only** device or firmware is worth considering: every line of altcoin code removed is one less place for a bug to hide. Several manufacturers build Bitcoin-only devices, and others offer Bitcoin-only firmware editions of their multi-coin hardware.

[[picks]]

[[table:bitbox02,blockstream-jade-plus,trezor-safe-5,foundation-passport-prime]]

## Why these picks

**BitBox02 (Bitcoin-only edition).** The simplest robust choice for most Bitcoiners: open source, secure chip, microSD backup, good multisig support.

**Blockstream Jade Plus.** Bitcoin and Liquid only, open source, with camera-based air-gapped signing and iPhone support at a mid-range price. No conventional secure element.

**Trezor Safe 5 (Bitcoin-only firmware).** Trezor's open-source model with a touchscreen and multi-share backups, which suit long-term storage.

**Foundation Passport Prime.** A premium, phone-like Bitcoin device with a large touchscreen, camera and tamper detection. Expensive, and a young platform.

**COLDCARD Q.** The most feature-rich air-gapped Bitcoin signer, with excellent multisig tooling. Because of the 2026 seed-generation flaw it scores lower on security in our model; use seeds generated on fixed firmware only.

## Taking it further

For larger amounts, consider a **multisig** setup that combines devices from different manufacturers, so a flaw in one vendor's device cannot cost you your funds. Start with our [multisig guide](/en/learn/multisig-custody) and see [best wallets for multisig](/en/best/best-hardware-wallets-for-long-term-bitcoin-storage).
`,
  },
  {
    type: "guide",
    locale: "en",
    slug: "best-hardware-wallets-for-beginners",
    translationKey: "guide-best-beginners",
    title: "The Best Hardware Wallets for Beginners",
    metaTitle: "Best Crypto Hardware Wallets for Beginners (2026)",
    metaDescription:
      "The best beginner-friendly hardware wallets in 2026: simple setup, clear screens, safe backups — plus the mistakes new users should avoid.",
    excerpt: "Easy to set up, hard to get wrong.",
    productSlugs: ["bitbox02", "trezor-safe-3", "trezor-safe-5", "ledger-nano-s-plus", "tangem-wallet"],
    data: {
      picks: [
        { product: "bitbox02", label: "Best for beginners overall" },
        { product: "trezor-safe-3", label: "Best on a budget" },
        { product: "trezor-safe-5", label: "Most comfortable to use" },
        { product: "ledger-nano-s-plus", label: "Best budget multi-asset" },
        { product: "tangem-wallet", label: "Simplest for small amounts on mobile" },
      ],
      faqs: [
        { q: "What's the biggest beginner mistake?", a: "Storing the recovery phrase digitally — in a photo, a notes app, cloud storage or email. Write it down on paper or metal and keep it offline." },
        { q: "Is a card wallet like Tangem safe for beginners?", a: "It is very simple, but it has no screen, so you cannot verify transactions on the device. We consider it suitable for modest amounts; for savings, choose a device with a screen." },
      ],
    },
    body: `
For a first hardware wallet, **ease of getting the basics right** matters more than advanced features. The best beginner devices guide you through creating and backing up your seed, show transaction details clearly, and don't overwhelm you with options.

[[picks]]

[[table:bitbox02,trezor-safe-3,trezor-safe-5,ledger-nano-s-plus]]

## Why these picks

**BitBox02.** Clear setup through the BitBoxApp and an optional microSD backup make it hard to get wrong. The Bitcoin-only edition is ideal if you are starting with Bitcoin.

**Trezor Safe 3.** A secure element, open source and excellent backup options at an entry-level price.

**Trezor Safe 5.** If you can spend more, the touchscreen makes everything easier.

**Ledger Nano S Plus.** The cheapest way to support a wide range of assets with a secure element.

**Tangem.** The simplest experience on a phone — but with no screen, you rely on the app to show what you are signing. Fine for modest amounts; for savings, choose a device with a screen.

## Five beginner rules

1. Buy direct from the manufacturer or an authorised reseller.
2. Set it up yourself — never use a device that arrives with words already filled in.
3. Write your recovery phrase on paper or metal. Never photograph it or type it anywhere.
4. Send a small test amount and practise a recovery before moving larger sums.
5. Nobody legitimate will ever ask for your recovery phrase.

Continue with [what is a hardware wallet?](/en/learn/what-is-a-hardware-wallet) and [seed phrases explained](/en/learn/seed-phrases-and-recovery).
`,
  },
  {
    type: "guide",
    locale: "en",
    slug: "best-air-gapped-hardware-wallets",
    translationKey: "guide-best-airgapped",
    title: "The Best Air-Gapped Hardware Wallets",
    metaTitle: "Best Air-Gapped Hardware Wallets 2026: QR & microSD Signing",
    metaDescription:
      "The best air-gapped hardware wallets in 2026 for QR-code and microSD signing: Keystone, Jade Plus, Passport Prime, COLDCARD, SafePal and NGRAVE compared.",
    excerpt: "Sign transactions without ever connecting the device to a computer.",
    productSlugs: ["keystone-3-pro", "blockstream-jade-plus", "foundation-passport-prime", "coldcard-q", "safepal-s1-pro", "ngrave-zero"],
    data: {
      picks: [
        { product: "keystone-3-pro", label: "Best air-gapped overall (multi-chain)" },
        { product: "blockstream-jade-plus", label: "Best value for Bitcoin" },
        { product: "foundation-passport-prime", label: "Best premium Bitcoin device" },
        { product: "coldcard-q", label: "Most advanced (read the 2026 advisory)" },
        { product: "safepal-s1-pro", label: "Cheapest fully air-gapped" },
      ],
      faqs: [
        { q: "Is air-gapped signing more secure?", a: "It removes the data connection between device and computer, eliminating attacks that rely on it. But a well-designed USB wallet that shows everything on its screen is also very secure; air-gapping is one layer, not a guarantee." },
        { q: "QR or microSD?", a: "QR is faster and needs no extra media; microSD handles large multisig transactions more easily. Some devices support both." },
      ],
    },
    body: `
An **air-gapped** hardware wallet never needs a data connection to your computer or phone. Unsigned transactions go to the device as QR codes or on a microSD card; signed transactions come back the same way. Read [air-gapped signing explained](/en/learn/air-gapped-signing) for the details and trade-offs.

[[picks]]

[[table:keystone-3-pro,blockstream-jade-plus,foundation-passport-prime,safepal-s1-pro]]

## Why these picks

**Keystone 3 Pro.** QR-only signing, a large touchscreen, multiple secure elements and a Bitcoin-only firmware option make it the most well-rounded air-gapped device for multi-chain users.

**Blockstream Jade Plus.** Open source with a camera for QR signing at a mid-range price; also works over USB and Bluetooth when convenience matters more.

**Foundation Passport Prime.** A premium Bitcoin device with a camera for air-gapped use, tamper detection and a big screen.

**COLDCARD Q.** Air-gapped by design with microSD, QR and NFC options and superb multisig features — but rated lower after the 2026 seed-generation flaw.

**SafePal S1 Pro.** A low-cost, QR-only device for multi-chain users; closed source and tied to SafePal's app.

We also profile the **NGRAVE ZERO**, a premium fully air-gapped device; its high price and closed design keep it out of our top picks.
`,
  },
  {
    type: "guide",
    locale: "en",
    slug: "best-hardware-wallets-uk",
    translationKey: "guide-best-uk",
    title: "The Best Hardware Wallets in the UK",
    metaTitle: "Best Hardware Wallets UK (2026): Where to Buy & What to Check",
    metaDescription:
      "The best hardware wallets for UK buyers in 2026, with advice on buying from official stores, import charges, consumer rights and avoiding tampered devices.",
    excerpt: "Our picks for UK buyers, plus practical advice on buying safely and what UK consumer law covers.",
    productSlugs: ["bitbox02", "trezor-safe-3", "trezor-safe-5", "ledger-flex", "blockstream-jade-plus"],
    data: {
      picks: [
        { product: "bitbox02", label: "Best overall" },
        { product: "trezor-safe-3", label: "Best value" },
        { product: "trezor-safe-5", label: "Best open-source touchscreen" },
        { product: "ledger-flex", label: "Best multi-chain" },
        { product: "blockstream-jade-plus", label: "Best Bitcoin air-gap option" },
      ],
      faqs: [
        { q: "Will I pay import charges buying a hardware wallet from abroad?", a: "Possibly. Goods shipped into the UK can attract VAT and handling fees depending on value and how the seller handles VAT. Check at checkout whether prices include UK VAT." },
        { q: "Is it legal to own a hardware wallet in the UK?", a: "Yes. Owning and using a hardware wallet to self-custody crypto is legal in the UK. Crypto disposals may be subject to Capital Gains Tax — HMRC guidance applies." },
      ],
    },
    body: `
The best devices for UK buyers are the same as anywhere else — but where and how you buy matters. Prices below are shown in GBP when verified; otherwise check the official store.

[[picks]]

[[table:bitbox02,trezor-safe-3,trezor-safe-5,ledger-flex]]

## Buying safely in the UK

- **Buy from the official store or an authorised UK reseller.** Avoid marketplaces and second-hand listings, where tampered devices have been sold.
- **Check whether prices include UK VAT.** Some manufacturers ship from the EU, Switzerland or North America. Depending on value and the seller's VAT arrangements, you may pay VAT or handling fees on delivery.
- **Know your rights.** When buying from a UK business, the Consumer Rights Act 2015 gives you rights if goods are faulty. Buying from abroad, your rights depend on the seller's location.
- **Protect your delivery address.** After past e-commerce data leaks in the industry, some buyers use a non-home delivery address.

## Tax note

HMRC treats crypto disposals as potentially subject to Capital Gains Tax. A hardware wallet doesn't change your tax position, but keep records of transfers. This is not tax advice.

New to this? Start with the [beginner's guide](/en/best/best-hardware-wallets-for-beginners) or the [wallet finder](/en/quiz).
`,
  },
  {
    type: "guide",
    locale: "en",
    slug: "best-hardware-wallets-germany",
    translationKey: "guide-best-germany",
    title: "The Best Hardware Wallets in Germany",
    metaTitle: "Best Hardware Wallets in Germany (2026): Picks & Buying Advice",
    metaDescription: "The best hardware wallets for buyers in Germany in 2026: EU-based options, EUR pricing, consumer rights and safe buying.",
    excerpt: "Our picks for buyers in Germany, with EU-specific buying advice.",
    productSlugs: ["bitbox02", "trezor-safe-3", "trezor-safe-5", "ledger-flex", "blockstream-jade-plus"],
    data: {
      picks: [
        { product: "bitbox02", label: "Best overall" },
        { product: "trezor-safe-3", label: "Best value (EU manufacturer)" },
        { product: "trezor-safe-5", label: "Best open-source touchscreen" },
        { product: "ledger-flex", label: "Best multi-chain (EU manufacturer)" },
        { product: "blockstream-jade-plus", label: "Best Bitcoin air-gap option" },
      ],
    },
    body: `
For buyers in Germany, popular devices come from manufacturers in the EU (Trezor in Czechia, Ledger in France) and Switzerland (BitBox). Buying within the EU generally avoids import charges.

[[picks]]

[[table:bitbox02,trezor-safe-3,trezor-safe-5,ledger-flex]]

## Buying safely in Germany

- **Buy direct or from authorised resellers.** Avoid marketplaces and used devices.
- **EU sellers:** you benefit from the 14-day withdrawal right for online purchases and the statutory two-year warranty (Gewährleistung). Note that some sellers exclude opened security devices from returns — check before buying.
- **Swiss and non-EU sellers:** imports may attract import VAT (Einfuhrumsatzsteuer) and handling fees; check whether the price includes them.

## Tax note

In Germany, gains from selling privately held crypto after a holding period of more than one year are generally tax-free under § 23 EStG; shorter holding periods may be taxable. A hardware wallet doesn't change this, but keep records. This is not tax advice.

A [German version of this guide](/de/best/beste-hardware-wallets-deutschland) is available.
`,
  },
  {
    type: "guide",
    locale: "de",
    slug: "beste-hardware-wallets-deutschland",
    translationKey: "guide-best-germany",
    title: "Die besten Hardware Wallets in Deutschland",
    metaTitle: "Beste Hardware Wallet 2026: Empfehlungen für Deutschland",
    metaDescription:
      "Die besten Hardware Wallets für Käufer in Deutschland 2026: Empfehlungen nach Bedarf, Euro-Preise, Gewährleistung, Steuern und sicherer Kauf.",
    excerpt: "Unsere Empfehlungen für Käufer in Deutschland – mit Tipps zum sicheren Kauf in der EU.",
    productSlugs: ["bitbox02", "trezor-safe-3", "trezor-safe-5", "ledger-flex", "blockstream-jade-plus"],
    data: {
      picks: [
        { product: "bitbox02", label: "Beste Wahl insgesamt" },
        { product: "trezor-safe-3", label: "Bestes Preis-Leistungs-Verhältnis (EU-Hersteller)" },
        { product: "trezor-safe-5", label: "Bester Open-Source-Touchscreen" },
        { product: "ledger-flex", label: "Beste Multi-Chain-Wallet (EU-Hersteller)" },
        { product: "blockstream-jade-plus", label: "Beste Air-Gap-Option für Bitcoin" },
      ],
      faqs: [
        { q: "Welche Hardware Wallet ist die sicherste?", a: "Das hängt von Ihrem Bedrohungsmodell und Ihrem Backup ab. Unsere Wertung gewichtet die Sicherheitsarchitektur am stärksten, doch ein gut gesichertes Mittelklassegerät ist sicherer als ein Premiumgerät mit schlechtem Backup." },
        { q: "Muss ich Gewinne aus Bitcoin versteuern?", a: "Gewinne aus privaten Veräußerungsgeschäften mit Kryptowerten sind in Deutschland nach einer Haltefrist von mehr als einem Jahr grundsätzlich steuerfrei (§ 23 EStG). Dies ist keine Steuerberatung." },
        { q: "Kann ich eine geöffnete Hardware Wallet zurückgeben?", a: "Beim Online-Kauf in der EU gilt grundsätzlich ein 14-tägiges Widerrufsrecht. Manche Händler schließen geöffnete Sicherheitsprodukte aus – prüfen Sie die Bedingungen vor dem Kauf." },
      ],
    },
    body: `
Für Käufer in Deutschland kommen die beliebtesten Geräte von Herstellern aus der EU (Trezor aus Tschechien, Ledger aus Frankreich) und der Schweiz (BitBox). Beim Kauf innerhalb der EU fallen in der Regel keine Einfuhrabgaben an.

[[picks]]

[[table:bitbox02,trezor-safe-3,trezor-safe-5,ledger-flex]]

## Warum diese Empfehlungen

**BitBox02.** Quelloffen, mit Sicherheitschip, Bitcoin-only-Edition und dem wohl einfachsten robusten Backup (microSD plus Standard-Wörter). Für iPhone-Nutzer gibt es die BitBox02 Nova.

**Trezor Safe 3.** Secure Element, Open Source und Multi-Share-Backup zum Einstiegspreis – vom EU-Hersteller aus Prag.

**Trezor Safe 5.** Gleiches Sicherheitsmodell mit komfortablem Farb-Touchscreen.

**Ledger Flex.** Großer E-Ink-Bildschirm und sehr breite Asset-Unterstützung; das Betriebssystem im Secure Element ist jedoch Closed Source.

**Blockstream Jade Plus.** Quelloffen, mit Kamera für air-gapped Signieren per QR und iPhone-Unterstützung. Kein klassisches Secure Element.

## Sicher kaufen in Deutschland

- **Direkt beim Hersteller oder autorisierten Händlern kaufen.** Marktplätze und Gebrauchtgeräte meiden.
- **EU-Händler:** 14-tägiges Widerrufsrecht beim Online-Kauf und zweijährige gesetzliche Gewährleistung. Manche Händler schließen geöffnete Sicherheitsgeräte vom Widerruf aus – vorher prüfen.
- **Schweizer und Nicht-EU-Händler:** Es können Einfuhrumsatzsteuer und Bearbeitungsgebühren anfallen.
- **Lieferadresse:** Nach Datenlecks bei Onlineshops der Branche nutzen manche Käufer eine Packstation oder Geschäftsadresse.

## Steuerlicher Hinweis

Gewinne aus dem Verkauf privat gehaltener Kryptowerte sind nach einer Haltefrist von mehr als einem Jahr grundsätzlich steuerfrei (§ 23 EStG). Eine Hardware Wallet ändert daran nichts, aber dokumentieren Sie Ihre Transaktionen. Keine Steuerberatung.

Neu im Thema? Lesen Sie [Was ist eine Hardware Wallet?](/de/learn/was-ist-eine-hardware-wallet) oder nutzen Sie den [Wallet-Finder](/de/quiz).
`,
  },
  {
    type: "guide",
    locale: "en",
    slug: "best-hardware-wallets-for-long-term-bitcoin-storage",
    translationKey: "guide-best-longterm-multisig",
    title: "Best Hardware Wallets for Long-Term Bitcoin Storage and Multisig",
    metaTitle: "Best Wallets for Long-Term Bitcoin Storage & Multisig (2026)",
    metaDescription:
      "The best hardware wallets for long-term Bitcoin cold storage and multisig in 2026: devices that work well together, backup strategy and inheritance considerations.",
    excerpt: "For savings measured in years: strong backups, multisig compatibility and vendor diversity.",
    productSlugs: ["bitbox02", "trezor-safe-5", "blockstream-jade-plus", "keystone-3-pro", "coldcard-q"],
    data: {
      picks: [
        { product: "bitbox02", label: "Excellent multisig signer, simple to operate" },
        { product: "trezor-safe-5", label: "Multi-share backups for single-sig storage" },
        { product: "blockstream-jade-plus", label: "Open-source, air-gap-capable second vendor" },
        { product: "keystone-3-pro", label: "Air-gapped QR signer for multisig" },
        { product: "coldcard-q", label: "Advanced multisig tooling (fixed firmware only)" },
      ],
    },
    body: `
Long-term storage is less about the "best" device and more about a **setup** that survives device failure, vendor failure, loss, theft and your own absence. Two approaches dominate:

1. **Single-signature with a robust backup** — e.g. a multi-share (SLIP-39) backup spread across locations, or a seed plus a passphrase stored separately.
2. **Multisignature (e.g. 2-of-3)** — three keys on devices from **different manufacturers**, any two of which can spend.

The 2026 COLDCARD seed-generation flaw is a reminder of why vendor diversity matters: in a 2-of-3 multisig with three different vendors, a flaw in one device's key generation does not put funds at risk on its own.

[[picks]]

[[table:bitbox02,trezor-safe-5,blockstream-jade-plus,keystone-3-pro]]

## Building a 2-of-3 multisig

- Choose a coordinator: **Sparrow** (desktop) or **Nunchuk** (mobile/desktop) are popular.
- Use three devices from different vendors, e.g. BitBox02 + Jade Plus + Keystone 3 Pro.
- Back up **each** seed and the **wallet descriptor** (the multisig configuration). Without the descriptor, recovering a multisig is much harder.
- Store keys in different places so no single location holds two keys.
- Practise a recovery before depositing significant funds.

Read [multisig custody explained](/en/learn/multisig-custody) and [Bitcoin inheritance planning](/en/learn/bitcoin-inheritance-planning).
`,
  },
];

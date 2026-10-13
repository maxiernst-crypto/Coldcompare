import type { SeedArticle } from "./types";

export const comparisons: SeedArticle[] = [
  {
    type: "comparison",
    locale: "en",
    slug: "bitbox02-vs-ledger-nano-x",
    translationKey: "cmp-bitbox02-ledger-nano-x",
    title: "BitBox02 vs Ledger Nano X: Open Source or Maximum Compatibility?",
    metaTitle: "BitBox02 vs Ledger Nano X (2026): Which Should You Buy?",
    metaDescription:
      "BitBox02 vs Ledger Nano X compared: security architecture, open source, backups, iPhone support, assets and price — with a clear recommendation for each type of user.",
    excerpt: "Two compact wallets with very different philosophies: transparency and simplicity versus breadth and mobility.",
    productSlugs: ["bitbox02", "ledger-nano-x"],
    data: {
      verdict:
        "Choose the BitBox02 if you mainly hold Bitcoin, use desktop or Android, and value open-source firmware and an easy microSD backup. Choose the Ledger Nano X if you need an iPhone-compatible device or broad altcoin support and are comfortable trusting Ledger's closed secure-element OS.",
      faqs: [
        { q: "Which is more secure, BitBox02 or Ledger Nano X?", a: "They make different trade-offs. Ledger relies on a secure element running closed firmware; BitBox02 combines open-source firmware with a secure chip. Neither is universally more secure — it depends on whether you prioritise physical-attack resistance or auditability, and how you back up." },
        { q: "Which works with iPhone?", a: "The Ledger Nano X, via Bluetooth. The original BitBox02 does not; the BitBox02 Nova does." },
      ],
    },
    body: `
## The short answer

[[table:bitbox02,ledger-nano-x]]

The **BitBox02** is the better fit for Bitcoin-focused users who want open-source software, a Bitcoin-only edition and a straightforward backup. The **Ledger Nano X** is the better fit if you hold many different assets or want to sign on an iPhone.

## Security philosophy

These devices represent the two main schools of hardware-wallet design.

**Ledger** puts everything inside a secure element running its own closed operating system. Secure elements are built to resist physical attacks, and Ledger's implementation has a long track record. But because the OS is closed, you cannot verify independently what it does — a point underlined in 2023 when Ledger Recover showed that seed material can be exported with user consent. The Nano X also uses an older EAL5+ chip than Ledger's newer devices.

**BitBox02** runs open-source firmware on a general-purpose microcontroller and uses a secure chip to protect the secrets needed to unlock the wallet and to rate-limit PIN attempts. This gives outsiders the ability to audit the wallet logic, while still adding protection against physical extraction.

If you only hold Bitcoin, the **BitBox02 Bitcoin-only edition** also removes all altcoin code from the device. Ledger offers no Bitcoin-only firmware.

## Connectivity and mobile use

The Nano X has **Bluetooth and a battery**, so it works with Ledger's app on iPhone and Android. The BitBox02 is **USB-C only** and works with desktop and Android, but not iPhone. Neither device signs air-gapped.

Some people deliberately prefer no radio. Bluetooth on the Nano X carries only encrypted, already-approved data, and keys never leave the secure element — but it is still an additional interface.

## Backups

Both use the standard **24-word BIP39** phrase and support passphrases. The BitBox02 adds an optional **microSD backup**, which many beginners find easier than writing words down correctly. Ledger offers **Ledger Recover**, a paid cloud backup service; whether you consider that a feature or a risk is a personal trust decision.

## Asset support

Ledger supports thousands of coins and tokens. The BitBox02 Multi supports a curated shortlist. If you need a specific altcoin, check before buying.

## Privacy and vendor history

BitBox's app supports connecting to your own node and Tor. Ledger's 2020 customer-database breach exposed contact details and led to years of phishing; it did not compromise devices, but it is relevant if privacy matters to you.

## Who should choose which

- **BitBox02:** Bitcoiners, open-source advocates, desktop and Android users, beginners who want the easiest robust backup.
- **Ledger Nano X:** multi-asset holders, iPhone users, people who want the largest ecosystem of compatible apps.

Read the full [BitBox02 review](/en/wallets/bitbox02) or compare more devices in our [comparison tool](/en/compare?w=bitbox02,ledger-nano-x).
`,
  },
  {
    type: "comparison",
    locale: "en",
    slug: "trezor-safe-5-vs-ledger-flex",
    translationKey: "cmp-trezor-safe-5-ledger-flex",
    title: "Trezor vs Ledger: Safe 5 vs Flex Compared",
    metaTitle: "Trezor vs Ledger (2026): Trezor Safe 5 vs Ledger Flex Compared",
    metaDescription:
      "Trezor vs Ledger in 2026: we compare the Trezor Safe 5 and Ledger Flex on security model, open source, screens, backups, mobile support and value.",
    excerpt: "The classic rivalry, using each brand's mid-range touchscreen device.",
    productSlugs: ["trezor-safe-5", "ledger-flex"],
    data: {
      verdict:
        "Pick the Trezor Safe 5 if open-source firmware, multi-share backups and a Bitcoin-only option matter to you. Pick the Ledger Flex if you are a multi-chain user who wants a big screen, Bluetooth and NFC, and you accept Ledger's closed secure-element OS.",
      faqs: [
        { q: "Is Trezor or Ledger better for Bitcoin?", a: "For Bitcoin-only users, Trezor's open-source and Bitcoin-only firmware is usually the better fit. Ledger works well for Bitcoin too, especially with Sparrow, but has no Bitcoin-only firmware." },
        { q: "Is Trezor or Ledger better for altcoins and DeFi?", a: "Ledger generally supports more assets and its large screens help with clear signing of complex transactions." },
      ],
    },
    body: `
## The short answer

[[table:trezor-safe-5,ledger-flex]]

Trezor and Ledger are the two best-known hardware-wallet brands, and they disagree about the most important design question: **should the security-critical code be open source?** Trezor says yes; Ledger relies on a closed secure-element OS. Both now use secure elements, so the gap in physical-attack resistance is much smaller than it was with older Trezor models.

## Security model

- **Trezor Safe 5:** open-source firmware on the main chip, plus a secure element that holds a secret required (with your PIN) to unlock the seed. The secure element's internal firmware is closed, but it does not run the wallet logic.
- **Ledger Flex:** keys are generated and used inside a certified secure element running Ledger's closed OS. Strong physical protections, limited independent auditability.

If you want to minimise how much you must trust any single vendor, open source is a meaningful advantage. If you primarily worry about a sophisticated attacker with physical access to your device, Ledger's all-in-secure-element design is a strength — though a strong passphrase narrows the difference considerably on either device.

## Screens and usability

The Flex's ~2.8-inch E Ink touchscreen is larger and better suited to reviewing long, complex transactions such as DeFi interactions. The Safe 5's colour touchscreen is smaller but comfortable for PIN, passphrase and address checks. Both are big improvements on button-driven devices.

## Connectivity

The Flex has USB-C, **Bluetooth and NFC**, so it works with iPhone. The Safe 5 is **USB-only** (Trezor's Bluetooth model is the Safe 7). Neither signs air-gapped.

## Backups

Both support **BIP39** and **passphrases**. Trezor adds **SLIP-39 multi-share backups** (e.g. 2-of-3), a powerful option for long-term storage. Ledger offers the optional paid **Ledger Recover** service.

## Assets and ecosystem

Ledger supports more coins and has deeper integration with Web3 apps. Trezor covers the major assets and offers a **Bitcoin-only firmware**.

## Vendor history

Ledger's 2020 customer-data breach and 2023 Connect Kit supply-chain attack did not compromise device keys but affected users. Trezor's older models were shown to be vulnerable to physical seed extraction, which the Safe series addresses with a secure element.

## Who should choose which

- **Trezor Safe 5:** Bitcoiners, open-source advocates, long-term holders who want multi-share backups.
- **Ledger Flex:** active multi-chain and DeFi users, iPhone users, people who value a large signing screen.

Explore both: [Trezor Safe 5 review](/en/wallets/trezor-safe-5) · [Ledger Flex review](/en/wallets/ledger-flex).
`,
  },
  {
    type: "comparison",
    locale: "en",
    slug: "coldcard-q-vs-bitbox02",
    translationKey: "cmp-coldcard-q-bitbox02",
    title: "COLDCARD Q vs BitBox02: Advanced Air-Gap or Effortless Simplicity?",
    metaTitle: "COLDCARD Q vs BitBox02 (2026): Bitcoin Wallets Compared",
    metaDescription:
      "COLDCARD Q vs BitBox02 Bitcoin-only: air-gapped signing vs simplicity, the 2026 COLDCARD seed flaw, backups, multisig and which suits you.",
    excerpt: "Both are favourites with Bitcoiners — for very different kinds of users.",
    productSlugs: ["coldcard-q", "bitbox02"],
    data: {
      verdict:
        "For most Bitcoin holders, especially beginners, the BitBox02 Bitcoin-only edition is the simpler and currently more conservative choice. The COLDCARD Q suits experienced users who need air-gapped signing and advanced multisig features — provided they use seeds generated on fixed firmware after the 2026 entropy flaw.",
      faqs: [
        { q: "Should I switch from COLDCARD to BitBox02 after the 2026 flaw?", a: "Not necessarily. The flaw affects seeds generated on older firmware; Coinkite has released fixes. What you must do is migrate any affected seed. Whether you also change vendor depends on your trust in Coinkite's remediation." },
        { q: "Can I use both together?", a: "Yes. Both work as signers in a Bitcoin multisig with coordinators such as Sparrow or Nunchuk — using different vendors reduces single-vendor risk." },
      ],
    },
    body: `
## The short answer

[[table:coldcard-q,bitbox02]]

These are two of the most popular Bitcoin-focused devices, and they could hardly be more different. The **COLDCARD Q** is a full-keyboard, air-gapped power tool. The **BitBox02** (in its Bitcoin-only edition) is a minimalist USB device built to make good security easy.

## The 2026 COLDCARD seed flaw

In mid-2026 Coinkite disclosed that a firmware bug weakened seed generation on COLDCARD Mk4, Mk5 and Q devices. Seeds generated before the fixed firmware are affected; updating firmware does not fix them, and owners must migrate funds to a new seed. See the [COLDCARD Q review](/en/wallets/coldcard-q) for details. This is the main reason the BitBox02 currently scores higher on security architecture in our model.

## Air-gapped vs connected signing

The COLDCARD Q never needs a data connection: transactions move via **microSD, QR codes or NFC**. The BitBox02 signs over **USB-C**. Air-gapping removes a class of attacks that rely on a malicious computer talking to the device — but well-designed connected wallets mitigate those by showing every detail on the device screen for confirmation.

## Ease of use

The BitBox02 is far easier to set up and use day to day. The COLDCARD Q is friendlier than older COLDCARDs thanks to its keyboard and screen, but PSBT workflows and the sheer number of options make it an expert's tool.

## Backup options

- **BitBox02:** microSD backup and/or BIP39 words; passphrase.
- **COLDCARD Q:** BIP39 words, encrypted microSD backups, **Seed XOR**, passphrase, dice-roll entropy.

## Multisig

Both are strong multisig signers. COLDCARD's multisig tooling is more extensive; BitBox02 integrates cleanly with Sparrow and Specter. Combining devices from **different manufacturers** in a multisig is a good defence against exactly the kind of single-vendor failure the 2026 flaw represents.

## Open source

The BitBox02's firmware and hardware designs are open source. COLDCARD's firmware is published under a source-available licence.

## Who should choose which

- **BitBox02 (Bitcoin-only):** beginners and most single-signature Bitcoin holders on desktop or Android.
- **COLDCARD Q:** experienced Bitcoiners who want air-gapped signing and advanced controls, and who will follow Coinkite's migration guidance carefully.
`,
  },
  {
    type: "comparison",
    locale: "en",
    slug: "blockstream-jade-plus-vs-trezor-safe-3",
    translationKey: "cmp-jade-plus-trezor-safe-3",
    title: "Blockstream Jade Plus vs Trezor Safe 3: Which Open-Source Wallet?",
    metaTitle: "Jade Plus vs Trezor Safe 3 (2026): Open-Source Wallets Compared",
    metaDescription:
      "Jade vs Trezor: we compare the Blockstream Jade Plus and Trezor Safe 3 on security model, air-gapped signing, backups, mobile support and price.",
    excerpt: "Two open-source devices, two different answers to the secure-element question.",
    productSlugs: ["blockstream-jade-plus", "trezor-safe-3"],
    data: {
      verdict:
        "The Trezor Safe 3 is the simpler, cheaper choice with a secure element and multi-asset support. The Jade Plus is the better choice for Bitcoiners who want mobile use over Bluetooth and the option of fully air-gapped QR signing, and who understand its blind-oracle security model.",
      faqs: [
        { q: "Is the lack of a secure element in Jade a problem?", a: "It is a different trade-off. Jade uses a PIN server ('blind oracle') instead. For larger amounts, a strong passphrase or stateless SeedQR operation substantially mitigates physical-access risks." },
      ],
    },
    body: `
## The short answer

[[table:blockstream-jade-plus,trezor-safe-3]]

Both devices publish their firmware as open source and both are reasonably priced. The difference lies in how they protect keys against physical attacks, and in how you connect them.

## Protecting the seed

- **Trezor Safe 3:** a **secure element** stores a secret that, together with your PIN, is needed to decrypt the seed.
- **Jade Plus:** no secure element. A **blind oracle** (PIN server) holds a secret required to unlock the encrypted seed; it never sees your keys, and you can run it yourself.

Both designs aim to make it impractical for a thief to extract your seed. They rely on different assumptions; adding a strong passphrase improves either.

## Connectivity and air-gap

The Safe 3 is **USB-only**. The Jade Plus offers **USB, Bluetooth and a camera** for QR-based, fully air-gapped signing — and works with iPhone. If air-gapped signing or iPhone support matters to you, that settles it.

## Backups

The Safe 3 supports **multi-share SLIP-39 backups** in addition to BIP39. The Jade Plus supports BIP39 and **SeedQR**, which enables "stateless" use where the seed is never stored on the device.

## Assets

The Safe 3 supports Bitcoin and many other assets (with an optional Bitcoin-only firmware). The Jade Plus supports Bitcoin and Liquid only.

## Who should choose which

- **Trezor Safe 3:** beginners on a budget, users who want a secure element and multi-asset support, long-term holders wanting multi-share backups.
- **Jade Plus:** Bitcoiners who want mobile convenience and the option of air-gapped QR signing, and anyone building a multi-vendor multisig.
`,
  },
  {
    type: "comparison",
    locale: "en",
    slug: "trezor-safe-3-vs-ledger-nano-s-plus",
    translationKey: "cmp-trezor-safe-3-ledger-nano-s-plus",
    title: "Trezor Safe 3 vs Ledger Nano S Plus: The Best Budget Hardware Wallet?",
    metaTitle: "Trezor Safe 3 vs Ledger Nano S Plus (2026): Budget Wallets Compared",
    metaDescription:
      "Trezor Safe 3 vs Ledger Nano S Plus: two low-cost hardware wallets compared on open source, secure element, backups and asset support.",
    excerpt: "The two most popular entry-level devices, side by side.",
    productSlugs: ["trezor-safe-3", "ledger-nano-s-plus"],
    data: {
      verdict:
        "Both are excellent value. Choose the Trezor Safe 3 for open-source firmware, multi-share backups and a Bitcoin-only option. Choose the Ledger Nano S Plus for the widest asset support at a low price.",
    },
    body: `
## The short answer

[[table:trezor-safe-3,ledger-nano-s-plus]]

If you are buying your first hardware wallet on a budget, these are the two most likely candidates. Both have secure elements, both are USB-only, and both cost well under €/£100 at their recommended prices.

## Open source vs closed secure element

The **Safe 3** runs open-source firmware and uses its secure element to guard a secret needed to unlock the seed. The **Nano S Plus** keeps everything in a secure element running Ledger's closed OS. Both protect against casual physical attacks; they differ in how much you must trust the vendor.

## Backups

The Safe 3 supports **multi-share backups** (SLIP-39) as well as standard BIP39 words. The Nano S Plus uses BIP39 words, with Ledger Recover available as a paid option.

## Assets

The Nano S Plus supports more assets. The Safe 3 covers the major ones and offers a **Bitcoin-only firmware**.

## Usability

Both use two buttons and a small monochrome screen — fine for occasional use, slower for checking long addresses.

## Who should choose which

- **Trezor Safe 3:** Bitcoin-focused beginners, open-source advocates, anyone wanting multi-share backups.
- **Ledger Nano S Plus:** beginners with a broad altcoin portfolio.
`,
  },
];

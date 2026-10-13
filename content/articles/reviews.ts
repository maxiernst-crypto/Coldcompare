import type { SeedArticle } from "./types";

/**
 * Reviews are desk-research assessments (no hands-on testing claimed). The product profile supplies
 * specs, pros/cons, scores, advisories and "who should buy/avoid"; the body supplies the analysis.
 */
export const reviews: SeedArticle[] = [
  {
    type: "review",
    locale: "en",
    slug: "bitbox02",
    translationKey: "review-bitbox02",
    title: "BitBox02 Review: Open-Source Simplicity with a Bitcoin-Only Option",
    metaTitle: "BitBox02 Review (2026): Security, Backup & Who Should Buy It",
    metaDescription:
      "Our BitBox02 review covers its open-source dual-chip security, microSD backups, Bitcoin-only edition, limitations and the best alternatives.",
    excerpt: "A compact, open-source wallet that makes good security habits easy — as long as you don't need iPhone support.",
    productSlugs: ["bitbox02"],
    data: {
      verdict:
        "The BitBox02 is one of the easiest ways to get open-source, secure-element-backed self-custody right. Its microSD backup and Bitcoin-only edition are genuine strengths. Choose the Nova instead if you use an iPhone, and look elsewhere if you need air-gapped signing.",
      faqs: [
        { q: "Is the BitBox02 open source?", a: "Yes. Shift Crypto publishes the firmware and the hardware design files, so independent researchers can review them." },
        { q: "Does the BitBox02 work with an iPhone?", a: "The original BitBox02 connects over USB and is not supported on iPhone. The BitBox02 Nova adds Bluetooth for iPhone and iPad." },
        { q: "Can I use the BitBox02 without the microSD card?", a: "Yes. You can record the standard 24-word BIP39 recovery phrase instead of, or as well as, the microSD backup." },
        { q: "Bitcoin-only or Multi edition?", a: "If you only hold Bitcoin, the Bitcoin-only edition runs less code and therefore has a smaller attack surface. Choose Multi only if you need the other supported assets." },
      ],
      sources: [{ label: "Shift Crypto — BitBox02", url: "https://bitbox.swiss/bitbox02/" }],
    },
    body: `
## Overview

The BitBox02 from Swiss company Shift Crypto is a small USB-C device with touch-sensitive edges instead of buttons. It comes in two editions: **Multi**, which supports Bitcoin and a curated set of other assets, and **Bitcoin-only**, which runs firmware stripped down to Bitcoin. Both editions use the same hardware.

What sets it apart is not one headline feature but a combination of sensible defaults: open-source firmware and hardware, a secure chip, a microSD-card backup that removes the most error-prone part of set-up for many beginners, and companion software (the BitBoxApp) that keeps things simple.

## Security architecture

The BitBox02 uses a **dual-chip design**. A general-purpose microcontroller runs the open-source firmware; a separate secure chip stores secrets that are needed to decrypt the wallet and enforces limits on PIN attempts. The idea is to get the auditability of open-source firmware *and* some of the physical-attack resistance of a secure element, without depending on a secure element's closed operating system for everything.

Two further points matter:

- **Bitcoin-only firmware.** Less code means fewer places for bugs to hide. If you only hold BTC, this is a meaningful reduction in attack surface.
- **No radios.** The original BitBox02 has no Bluetooth or NFC. Everything happens over a USB-C cable, which some users prefer for simplicity.

The trade-off is that it is **not air-gapped**: the device signs while connected to a computer or Android phone. For most users this is fine — the device displays what you are signing and asks for confirmation — but if you specifically want microSD- or QR-based signing, look at the alternatives below.

## Setup and user experience

Set-up runs through the BitBoxApp on desktop or Android. You choose a device password on the BitBox02 itself, then create a backup. The touch-slider interface takes a few minutes to get used to; after that, confirming addresses and transactions is quick. The screen is small, which makes reviewing long addresses slower than on touchscreen devices.

## Supported cryptocurrencies

The Bitcoin-only edition supports Bitcoin (including testnet). The Multi edition adds a deliberately limited list of other assets such as Ethereum and ERC-20 tokens and Litecoin; check Shift Crypto's current list before buying if you need a specific coin. If you want hundreds of chains, a Ledger or Trezor is a better fit.

## Backup and recovery

This is the BitBox02's strongest area. You can back up to a **microSD card** (stored somewhere safe, separate from the device), write down the standard **24-word BIP39 recovery phrase**, or both. Because the phrase is a standard, you can recover in other BIP39-compatible wallets if Shift Crypto ever disappeared. **Optional passphrase** support lets you create hidden wallets.

A microSD card is convenient but is a digital medium: store it carefully, keep more than one copy if you rely on it, and consider a paper or metal copy of the words for long-term storage. See our guide to [backing up Bitcoin securely](/en/learn/how-to-back-up-bitcoin).

## Privacy considerations

The BitBoxApp can connect to your own Bitcoin node and supports Tor, which reduces what third-party servers learn about your addresses. The device also works with independent software such as Sparrow and Electrum.

## Pricing and value

At its recommended price (check the live price — ours is shown with its verification status above), the BitBox02 sits in the mid-range. You are paying for a polished experience and a transparent security model rather than for a large screen or wireless features. For open-source buyers, that is good value.

## Compared with alternatives

[[table:bitbox02,trezor-safe-3,ledger-nano-s-plus,bitbox02-nova]]

- **Trezor Safe 3** offers a similar open-source approach with a secure element at a lower price, plus multi-share backups — but no microSD option.
- **Ledger Nano S Plus** supports far more assets, but its secure-element operating system is closed source.
- **BitBox02 Nova** is the same idea with Bluetooth for iPhone users and a nicer screen, at a higher price.

Read our head-to-head: [BitBox02 vs Ledger Nano X](/en/compare/bitbox02-vs-ledger-nano-x) and [COLDCARD Q vs BitBox02](/en/compare/coldcard-q-vs-bitbox02).

## Final verdict

The BitBox02 makes it easy to do the right things: verify on the device, keep a good backup, and run open-source software. It is an excellent first hardware wallet for desktop and Android users — especially in its Bitcoin-only edition — and a solid choice for experienced users who want a simple single-signature or multisig signer. iPhone users should consider the Nova; those who want air-gapped signing should look at COLDCARD, Jade or Keystone.
`,
  },
  {
    type: "review",
    locale: "de",
    slug: "bitbox02",
    translationKey: "review-bitbox02",
    title: "BitBox02 Test: Einfache Open-Source-Wallet mit Bitcoin-only-Option",
    metaTitle: "BitBox02 Test (2026): Sicherheit, Backup & für wen sie sich lohnt",
    metaDescription:
      "Unser BitBox02-Test: quelloffenes Zwei-Chip-Design, microSD-Backup, Bitcoin-only-Edition, Schwächen und die besten Alternativen.",
    excerpt: "Eine kompakte, quelloffene Wallet, die gute Sicherheitsgewohnheiten leicht macht – sofern Sie kein iPhone brauchen.",
    productSlugs: ["bitbox02"],
    data: {
      verdict:
        "Mit der BitBox02 gelingt quelloffene Selbstverwahrung mit Sicherheitschip besonders einfach. microSD-Backup und Bitcoin-only-Edition sind echte Stärken. iPhone-Nutzer greifen zur Nova; wer air-gapped signieren will, schaut sich Alternativen an.",
      faqs: [
        { q: "Ist die BitBox02 Open Source?", a: "Ja. Shift Crypto veröffentlicht Firmware und Hardware-Designdateien, sodass unabhängige Forscher sie prüfen können." },
        { q: "Funktioniert die BitBox02 mit dem iPhone?", a: "Die ursprüngliche BitBox02 wird per USB verbunden und am iPhone nicht unterstützt. Die BitBox02 Nova ergänzt Bluetooth für iPhone und iPad." },
        { q: "Brauche ich die microSD-Karte?", a: "Nein. Sie können stattdessen oder zusätzlich die 24-Wörter-Wiederherstellungsphrase (BIP39) notieren." },
        { q: "Bitcoin-only oder Multi?", a: "Wenn Sie nur Bitcoin halten, läuft auf der Bitcoin-only-Edition weniger Code – die Angriffsfläche ist kleiner. Multi lohnt sich nur, wenn Sie die weiteren Assets brauchen." },
      ],
      sources: [{ label: "Shift Crypto — BitBox02", url: "https://bitbox.swiss/bitbox02/" }],
    },
    body: `
## Überblick

Die BitBox02 des Schweizer Unternehmens Shift Crypto ist ein kleines USB-C-Gerät mit berührungsempfindlichen Kanten statt Tasten. Es gibt zwei Editionen: **Multi** mit Bitcoin und einer kuratierten Auswahl weiterer Assets sowie **Bitcoin-only** mit einer auf Bitcoin reduzierten Firmware. Die Hardware ist identisch.

Ihre Stärke ist kein einzelnes Feature, sondern eine Kombination vernünftiger Voreinstellungen: Open-Source-Firmware und -Hardware, ein Sicherheitschip, ein microSD-Backup, das den fehleranfälligsten Teil der Einrichtung entschärft, und eine übersichtliche BitBoxApp.

## Sicherheitsarchitektur

Die BitBox02 setzt auf ein **Zwei-Chip-Design**: Ein Allzweck-Mikrocontroller führt die quelloffene Firmware aus, ein separater Sicherheitschip speichert Geheimnisse zum Entschlüsseln der Wallet und begrenzt PIN-Versuche. So verbindet sie die Prüfbarkeit offener Firmware mit einem Teil des physischen Schutzes eines Secure Elements – ohne sich vollständig auf dessen geschlossenes Betriebssystem zu verlassen.

- **Bitcoin-only-Firmware:** Weniger Code bedeutet weniger mögliche Fehler. Für reine Bitcoin-Halter eine spürbar kleinere Angriffsfläche.
- **Kein Funk:** Die ursprüngliche BitBox02 hat weder Bluetooth noch NFC – alles läuft über USB-C.

Der Kompromiss: Sie ist **nicht air-gapped**. Signiert wird bei Verbindung mit Computer oder Android-Smartphone. Für die meisten Nutzer ist das unproblematisch, da das Gerät alle Details zur Bestätigung anzeigt.

## Einrichtung und Bedienung

Die Einrichtung erfolgt über die BitBoxApp auf Desktop oder Android. Das Gerätepasswort geben Sie direkt an der BitBox02 ein, danach erstellen Sie das Backup. Die Touch-Bedienung erfordert ein paar Minuten Eingewöhnung. Das kleine Display macht das Prüfen langer Adressen etwas mühsamer als bei Touchscreen-Geräten.

## Unterstützte Kryptowährungen

Die Bitcoin-only-Edition unterstützt Bitcoin. Die Multi-Edition ergänzt eine bewusst begrenzte Liste, etwa Ethereum mit ERC-20-Token und Litecoin – prüfen Sie vor dem Kauf die aktuelle Liste des Herstellers. Wer Hunderte Chains benötigt, ist bei Ledger oder Trezor besser aufgehoben.

## Backup und Wiederherstellung

Hier glänzt die BitBox02: Backup auf **microSD-Karte**, die **24-Wörter-Phrase nach BIP39** oder beides. Dank des Standards ist eine Wiederherstellung auch in anderen Wallets möglich. Eine **optionale Passphrase** ermöglicht versteckte Wallets.

Eine microSD-Karte ist bequem, aber ein digitales Medium: sorgfältig lagern, ggf. mehrere Kopien anlegen und für die Langzeitverwahrung zusätzlich die Wörter auf Papier oder Metall sichern. Mehr dazu: [Seed-Phrase sicher aufbewahren](/de/learn/seed-phrase-sicher-aufbewahren).

## Privatsphäre

Die BitBoxApp kann sich mit einem eigenen Bitcoin-Node verbinden und unterstützt Tor. Außerdem funktioniert das Gerät mit unabhängiger Software wie Sparrow und Electrum.

## Preis und Leistung

Zur unverbindlichen Preisempfehlung (Prüfstatus siehe oben) liegt die BitBox02 im Mittelfeld. Sie zahlen für ein durchdachtes Gesamtpaket und ein transparentes Sicherheitsmodell, nicht für ein großes Display oder Funk. Für Open-Source-Käufer ein gutes Angebot.

## Alternativen im Vergleich

[[table:bitbox02,trezor-safe-3,ledger-nano-s-plus,bitbox02-nova]]

- **Trezor Safe 3:** ähnlicher Open-Source-Ansatz mit Secure Element, günstiger und mit Multi-Share-Backup – aber ohne microSD.
- **Ledger Nano S Plus:** deutlich mehr Assets, aber geschlossenes Betriebssystem.
- **BitBox02 Nova:** gleiches Konzept mit Bluetooth fürs iPhone und besserem Display, zu höherem Preis.

## Fazit

Die BitBox02 macht es leicht, das Richtige zu tun: am Gerät prüfen, gut sichern, offene Software nutzen. Für Desktop- und Android-Nutzer – besonders in der Bitcoin-only-Edition – eine hervorragende erste Hardware Wallet und für Erfahrene ein solider Signer für Single- oder Multisig. iPhone-Nutzer wählen die Nova; wer air-gapped signieren will, schaut sich COLDCARD, Jade oder Keystone an.
`,
  },
  {
    type: "review",
    locale: "en",
    slug: "trezor-safe-5",
    translationKey: "review-trezor-safe-5",
    title: "Trezor Safe 5 Review: Open Source Meets a Proper Touchscreen",
    metaTitle: "Trezor Safe 5 Review (2026): Security, Touchscreen & Alternatives",
    metaDescription:
      "Trezor Safe 5 review: open-source firmware with a secure element, colour touchscreen, multi-share backups, limitations and who should buy it.",
    excerpt: "Trezor's open-source security model with a far more comfortable screen — the main gap is iPhone support.",
    productSlugs: ["trezor-safe-5"],
    data: {
      verdict:
        "The Safe 5 is the most comfortable way into Trezor's open-source ecosystem: a secure element, multi-share backups and a touchscreen that makes on-device verification easy. iPhone users should look at the Safe 7; budget buyers get the same security model in the Safe 3.",
      faqs: [
        { q: "Does the Trezor Safe 5 have a secure element?", a: "Yes. Like the Safe 3, it pairs open-source firmware with a secure element that protects a secret needed to unlock the wallet." },
        { q: "What is a multi-share backup?", a: "A SLIP-39 backup split into several shares, of which a set number (for example 2 of 3) is needed to recover. It lets you store backups in different places without any single share being enough to steal your funds." },
        { q: "Can I use the Safe 5 with an iPhone?", a: "Not for signing over a cable connection. Trezor's Bluetooth model, the Safe 7, supports iOS." },
        { q: "Is there a Bitcoin-only version?", a: "Yes. Trezor offers Bitcoin-only firmware, which reduces the code running on the device." },
      ],
      sources: [{ label: "Trezor — official site", url: "https://trezor.io/" }],
    },
    body: `
## Overview

Trezor, made by Prague-based SatoshiLabs, introduced the first consumer hardware wallet and has always published its firmware as open source. The **Safe 5** combines that approach with a secure element and a colour touchscreen with haptic feedback. It sits between the budget Safe 3 and the Bluetooth-equipped flagship Safe 7.

## Security architecture

Older Trezor models (the Model One and Model T) stored secrets on a general-purpose chip, and researchers demonstrated that with physical access and specialist equipment the seed could be extracted — which is why Trezor long recommended a passphrase for high-value storage. The **Safe series adds a secure element**: a secret held in the secure element, combined with your PIN, is required to decrypt the seed. This makes physical extraction far harder while keeping the main firmware open source.

The secure element's own internal firmware is not open source — no mainstream secure-element vendor allows that — but it does not run the wallet logic. Trezor also offers **Bitcoin-only firmware** for users who want the smallest attack surface.

The Safe 5 is **USB-only**: no Bluetooth, no NFC, and no air-gapped signing.

## Setup and user experience

The touchscreen is the reason to pick the Safe 5 over the Safe 3. Entering a PIN or passphrase on the device itself — rather than on a computer — is much easier on a touchscreen, and reading full addresses before confirming a transaction is more comfortable. Setup is guided by Trezor Suite on desktop, web or Android.

## Supported cryptocurrencies

The Universal firmware supports Bitcoin and a large range of other coins and tokens through Trezor Suite and third-party wallets such as MetaMask. The Bitcoin-only firmware supports BTC only.

## Backup and recovery

Trezor's Safe series supports **SLIP-39 backups**, including **multi-share** backups that split your recovery across several shares with a threshold (e.g. any 2 of 3). That is a powerful option for people who want geographic redundancy without a single point of failure. Standard BIP39 recovery phrases are also supported, and **passphrases** let you create hidden wallets.

## Privacy considerations

Trezor Suite supports connecting to your own node and routing traffic via Tor. As an open-source vendor, Trezor's code can be reviewed independently. The device works with Sparrow, Electrum and other privacy-focused wallets.

## Pricing and value

The Safe 5 costs noticeably more than the Safe 3, which has the same security model. You are paying for the touchscreen and haptics. Whether that is worth it depends on how often you will use the device: for frequent use and on-device passphrase entry, it is.

## Compared with alternatives

[[table:trezor-safe-5,trezor-safe-3,ledger-flex,bitbox02]]

- **Trezor Safe 3** — same security model, buttons instead of a touchscreen, lower price.
- **Ledger Flex** — bigger E Ink screen, Bluetooth and broader asset support, but closed secure-element OS.
- **BitBox02** — open-source alternative with microSD backup and a smaller form factor.

See also [Trezor Safe 5 vs Ledger Flex](/en/compare/trezor-safe-5-vs-ledger-flex).

## Final verdict

The Trezor Safe 5 is a well-balanced device for people who want open-source firmware without sacrificing comfort. Its multi-share backup option is a standout for long-term storage. If you mainly use an iPhone, look at the Safe 7; if you want to save money, the Safe 3 gives you the same core protections.
`,
  },
  {
    type: "review",
    locale: "en",
    slug: "ledger-flex",
    translationKey: "review-ledger-flex",
    title: "Ledger Flex Review: Big Screen, Broad Support — and the Closed-Source Question",
    metaTitle: "Ledger Flex Review (2026): Security, Ledger Recover & Alternatives",
    metaDescription:
      "Ledger Flex review: E Ink touchscreen, secure element, Bluetooth and NFC, Ledger Recover, past incidents and who should (and shouldn't) buy it.",
    excerpt: "The most practical Ledger for active multi-chain users. Whether it's right for you depends on how you feel about closed firmware.",
    productSlugs: ["ledger-flex"],
    data: {
      verdict:
        "The Ledger Flex is an excellent signing device for multi-chain users: its large E Ink screen makes clear signing practical and its asset support is unmatched. The trade-off is trust in Ledger's closed secure-element OS and a history of customer-data incidents. Bitcoin-only and open-source purists should look elsewhere.",
      faqs: [
        { q: "Is Ledger Recover required?", a: "No. Ledger Recover is an optional, paid subscription. You can use the Flex with a standard 24-word recovery phrase only." },
        { q: "Can a Ledger device be hacked through Bluetooth?", a: "Bluetooth carries only encrypted, already-signed data; private keys stay in the secure element. Still, every radio is extra attack surface — you can disable Bluetooth and use USB." },
        { q: "Were Ledger devices hacked in the data breach?", a: "No. The 2020 incident exposed customer contact data from Ledger's e-commerce database, which led to phishing. The devices and keys were not compromised." },
        { q: "Flex or Stax?", a: "They share the same security model. The Stax has a bigger curved screen and wireless charging; the Flex offers better value." },
      ],
      sources: [{ label: "Ledger — official site", url: "https://www.ledger.com/" }],
    },
    body: `
## Overview

The Ledger Flex is a credit-card-sized device with a roughly 2.8-inch E Ink touchscreen, USB-C, Bluetooth and NFC. It sits between the newer Nano Gen5 and the premium Stax in Ledger's range and shares the same security model as both.

## Security architecture

Ledger's approach centres on a **certified secure element** that runs Ledger's own operating system. Keys are generated and used inside the chip, which is designed to resist physical attacks such as fault injection and side-channel analysis. On this axis, Ledger's architecture is among the strongest available.

The trade-off is **transparency**. The secure-element operating system is closed source, so outsiders cannot independently audit what it does. In 2023, Ledger announced **Ledger Recover**, an optional paid service that can export encrypted shares of your seed to custodians. It is opt-in, but it demonstrated that the firmware can export seed material when the user consents — and many users concluded that, with closed firmware, they must simply trust Ledger's implementation. That is a legitimate trust decision, and you should make it consciously.

Ledger has also had incidents outside the device itself: a 2020 **e-commerce database breach** that exposed customer contact details and led to sustained phishing, and a 2023 **supply-chain attack on its Connect Kit** JavaScript library that affected third-party web apps. Neither compromised keys on devices — but both are relevant to your threat model. See the advisories section below.

## Setup and user experience

The Flex is where Ledger's hardware shines. The large E Ink screen shows full addresses and readable transaction details ("clear signing" where supported), which reduces the risk of approving something you didn't intend — the cause of many real-world losses in DeFi. Setup runs through the Ledger Wallet app (formerly Ledger Live) on desktop or mobile.

## Supported cryptocurrencies

Asset support is Ledger's biggest advantage: thousands of coins and tokens via Ledger's app and third-party wallets such as MetaMask, Rabby or Sparrow (for Bitcoin). There is no Bitcoin-only firmware.

## Backup and recovery

Backup is a standard **24-word BIP39 phrase**, so you can recover in other wallets. **Passphrases** are supported. Ledger Recover is available as an optional paid extra.

## Privacy considerations

Ledger's app uses Ledger's infrastructure by default. Bitcoin users who care about privacy can pair the Flex with Sparrow and their own node. Given the 2020 data breach, consider using a non-identifying delivery address or buying from an authorised reseller.

## Pricing and value

The Flex costs considerably more than a Nano S Plus, which has the same core security model. You pay for the screen and wireless features — worth it if you sign transactions often, less so for long-term cold storage.

## Compared with alternatives

[[table:ledger-flex,trezor-safe-5,ledger-stax,ledger-nano-gen5]]

- **Trezor Safe 5** — open-source firmware and multi-share backups; smaller screen, USB-only.
- **Ledger Stax** — same security, bigger curved screen, much higher price.
- **Ledger Nano Gen5** — similar features and E Ink touchscreen in a smaller, cheaper package.

Read [Trezor Safe 5 vs Ledger Flex](/en/compare/trezor-safe-5-vs-ledger-flex) for a deeper comparison.

## Final verdict

For multi-chain users who sign transactions regularly, the Ledger Flex is one of the most practical devices available: a strong secure element and a screen that makes verification realistic. If your priority is open-source firmware, Bitcoin-only operation or minimising trust in a single vendor, choose a Trezor, BitBox or Bitcoin-only signer instead.
`,
  },
  {
    type: "review",
    locale: "en",
    slug: "coldcard-q",
    translationKey: "review-coldcard-q",
    title: "COLDCARD Q Review: Powerful Air-Gapped Signer After a Serious 2026 Flaw",
    metaTitle: "COLDCARD Q Review (2026): Features, Seed Flaw & What To Do",
    metaDescription:
      "COLDCARD Q review: air-gapped Bitcoin-only design, QR and microSD signing, the 2026 seed-generation flaw, migration steps and alternatives.",
    excerpt: "Feature-for-feature one of the most capable Bitcoin signers — but the 2026 entropy flaw changes how we rate it.",
    productSlugs: ["coldcard-q"],
    data: {
      verdict:
        "The COLDCARD Q remains one of the most capable air-gapped Bitcoin signers, with excellent multisig support and unique security features. But the 2026 seed-generation flaw was a failure in the most fundamental job a hardware wallet has. If you own one, follow Coinkite's migration guidance now. If you are buying, only use seeds generated on fixed firmware — and weigh alternatives carefully.",
      faqs: [
        { q: "Is my COLDCARD seed affected?", a: "Coinkite's advisory says seeds generated on Mk4, Mk5 and Q before the fixed firmware releases are affected, with an exception for seeds created with sufficient private dice rolls. Check Coinkite's official status and migration pages for the exact versions and steps." },
        { q: "Does updating firmware fix an affected seed?", a: "No. Updating firmware does not change or repair an existing seed. Affected users need to create a new seed on fixed firmware and move their funds." },
        { q: "Is it safe to buy a COLDCARD Q now?", a: "New seeds generated on fixed firmware are not affected by this flaw, according to Coinkite. Update firmware before creating a seed, consider adding dice-roll entropy, and verify the firmware version on the device." },
        { q: "Is COLDCARD open source?", a: "The firmware source code is published, but under a source-available licence rather than a standard open-source licence." },
      ],
      sources: [
        { label: "COLDCARD — security status", url: "https://coldcard.com/security/status" },
        { label: "COLDCARD — migrate an affected seed", url: "https://coldcard.com/security/migrate" },
      ],
    },
    body: `
> **Security advisory (2026):** Coinkite disclosed a firmware flaw that weakened seed generation on COLDCARD Mk4, Mk5 and Q devices. If you created a seed on a COLDCARD before the fixed firmware releases, read the advisory below and Coinkite's [migration guide](https://coldcard.com/security/migrate) **before doing anything else**. Updating firmware alone does not fix an existing seed.

## Overview

The COLDCARD Q from Canadian company Coinkite is a Bitcoin-only signing device with a full QWERTY keyboard, a colour screen, a QR scanner, NFC, two microSD slots and battery power. It is designed for **air-gapped** use: transactions travel between your computer or phone and the device as partially signed Bitcoin transactions (PSBTs) on microSD, as QR codes or via NFC, so the device never needs a data connection to sign.

## Security architecture

On paper the Q is one of the most security-focused devices available: Bitcoin-only firmware, **two secure elements from different vendors**, air-gapped signing, and advanced features such as duress and "trick" PINs, Seed XOR and extensive multisig controls.

In mid-2026, however, Coinkite disclosed that a **firmware bug weakened the randomness used to generate seeds**. According to Coinkite's advisory, affected Mk4, Mk5 and Q seeds have roughly 72 bits of entropy instead of the expected 128 — low enough that attackers were able to regenerate private keys offline. Third-party reports attribute significant losses to the flaw. Fixed firmware is available, and later releases add mandatory user-supplied entropy for new seeds.

This matters more than any feature. Generating a secret that nobody else can guess is the single job a hardware wallet cannot get wrong. We have therefore **reduced the COLDCARD Q's security score substantially** and will revisit it as the fix accumulates a track record and independent analysis is published. (Seeds created with at least 50 private, unrecorded dice rolls are treated separately by Coinkite.)

The firmware source is published, but under a **source-available** licence rather than a standard open-source licence.

## What owners should do

1. Read Coinkite's official [security status page](https://coldcard.com/security/status).
2. Update to the current firmware for your model.
3. Follow the [migration guide](https://coldcard.com/security/migrate): generate a **new** seed on fixed firmware (optionally adding dice rolls), back it up properly, and move funds to it.
4. For multisig setups, replace any affected COLDCARD key in the quorum.
5. Be alert to scams: no legitimate company will ask for your seed words to "check" or "migrate" them.

## Setup and user experience

The Q is much friendlier than earlier COLDCARDs thanks to its keyboard and larger screen, but it remains a device for people who want control and are willing to learn PSBT workflows. Pairing it with coordinator software such as Sparrow or Nunchuk is straightforward once you understand the concepts.

## Supported cryptocurrencies

Bitcoin only.

## Backup and recovery

Standard **BIP39** recovery phrases, encrypted **microSD backups**, **Seed XOR** (splitting a seed into parts that can each look like a valid seed) and **passphrases** are all supported. For multisig, COLDCARD's tooling is among the best available.

## Privacy considerations

Because it signs air-gapped and works with any PSBT-capable wallet, the Q lets you pair it with your own node and privacy-focused software. It does not require an account or a vendor app.

## Pricing and value

The Q is priced at the upper end of Bitcoin-only devices. For experienced users who will use its multisig and air-gap features, the hardware is good value; the security score reflects the 2026 incident, not the price.

## Compared with alternatives

[[table:coldcard-q,blockstream-jade-plus,keystone-3-pro,foundation-passport-prime]]

- **Blockstream Jade Plus** — cheaper, open-source, air-gap via camera, but no secure element.
- **Keystone 3 Pro** — air-gapped QR device with a Bitcoin-only firmware option and multisig support.
- **Foundation Passport Prime** — premium Bitcoin device with camera, tamper detection and a large touchscreen.

See [COLDCARD Q vs BitBox02](/en/compare/coldcard-q-vs-bitbox02).

## Final verdict

The COLDCARD Q's design and feature set are excellent for advanced Bitcoin users, particularly in multisig. But we cannot rate it as highly as before the 2026 seed-generation flaw. If you already use one, prioritise migration. If you are buying now, insist on fixed firmware before creating a seed, consider dice-roll entropy, and remember that a multisig setup with devices from different vendors protects you against exactly this kind of single-vendor failure.
`,
  },
  {
    type: "review",
    locale: "en",
    slug: "blockstream-jade-plus",
    translationKey: "review-blockstream-jade-plus",
    title: "Blockstream Jade Plus Review: Affordable, Open-Source and Air-Gap Ready",
    metaTitle: "Blockstream Jade Plus Review (2026): Blind Oracle, QR & Value",
    metaDescription:
      "Blockstream Jade Plus review: how its blind-oracle security works without a secure element, QR air-gapped signing, Liquid support and alternatives.",
    excerpt: "Open-source Bitcoin signing with a camera for QR air-gap at a mid-range price — with a security model you should understand first.",
    productSlugs: ["blockstream-jade-plus"],
    data: {
      verdict:
        "The Jade Plus is a flexible, open-source Bitcoin signer that can work over USB, Bluetooth or fully air-gapped via QR codes. Its blind-oracle design avoids closed secure-element firmware, but it is a different trust model from a secure element. A strong choice for Bitcoiners who understand that trade-off and want air-gap options without a premium price.",
      faqs: [
        { q: "Does the Jade Plus have a secure element?", a: "No. Jade uses a 'virtual secure element': the encrypted seed can only be unlocked with your PIN plus a secret held by a PIN server (Blockstream's or one you run yourself)." },
        { q: "Can I run my own PIN server?", a: "Yes. Blockstream publishes the PIN server software, so you can self-host it instead of relying on Blockstream's." },
        { q: "Can I use Jade without storing the seed on the device?", a: "Yes. In stateless mode with SeedQR, you scan your seed from a QR backup each session and the device does not keep it." },
        { q: "Does it support altcoins?", a: "No. Jade supports Bitcoin and assets on Blockstream's Liquid sidechain only." },
      ],
      sources: [
        { label: "Blockstream — Jade Plus launch", url: "https://blockstream.com/press-releases/2025-01-03-blockstream-launch-jade-plus/" },
        { label: "Blockstream — Jade comparison", url: "https://blockstream.com/jade/jade-comparison/" },
      ],
    },
    body: `
## Overview

The Jade Plus, launched by Blockstream in January 2025, is an open-source Bitcoin and Liquid signer with a colour screen, battery, USB-C, Bluetooth and a built-in camera. It can be used like a conventional hardware wallet over a cable or Bluetooth, or **fully air-gapped** by scanning QR codes. In 2026 Blockstream added a cheaper Jade Core to the range.

## Security architecture

Jade does not have a conventional secure element. Instead it uses a **"blind oracle"** approach: your seed is encrypted on the device, and decrypting it requires both your PIN and a secret held by a **PIN server**. The server never learns your seed or PIN; it simply refuses to help after too many wrong attempts. You can use Blockstream's server or **run your own**.

The upside is that Jade's security does not depend on closed secure-element firmware. The downside is that resistance to a well-equipped attacker with physical access works differently from a secure element; using a strong **BIP39 passphrase**, or **stateless** operation with SeedQR (where the seed is not stored on the device at all), substantially mitigates that risk.

According to third-party reports, Blockstream shipped a **security fix in firmware 1.0.37** (November 2025) and added downgrade protection in 1.0.38, with no known exploitation. Keep firmware current.

## Setup and user experience

Setup works with the Blockstream app (formerly Green) on mobile or desktop, or with third-party wallets such as Sparrow and Nunchuk. QR mode takes a little practice but quickly becomes routine. The jog-wheel style navigation is functional rather than luxurious.

## Supported cryptocurrencies

Bitcoin and Liquid Network assets only.

## Backup and recovery

Standard **BIP39** recovery phrases (12 or 24 words), **SeedQR** backups for stateless use, and **passphrase** support. Because the backup is standard, you are not locked in to Blockstream software.

## Privacy considerations

Jade works with your own node via compatible wallets, and air-gapped QR signing keeps the device off any data connection. Self-hosting the PIN server removes reliance on Blockstream's infrastructure.

## Pricing and value

Recent listings place the Jade Plus in the mid-range (sources disagreed on the current price — check the official store). For an open-source device with QR air-gap capability, it is strong value.

## Compared with alternatives

[[table:blockstream-jade-plus,trezor-safe-3,coldcard-q,keystone-3-pro]]

- **Trezor Safe 3** — has a secure element and multi-share backups, but no air-gap.
- **COLDCARD Q** — more advanced air-gapped Bitcoin features; see the 2026 advisory.
- **Keystone 3 Pro** — air-gapped QR device with secure elements and a large touchscreen.

See [Blockstream Jade Plus vs Trezor Safe 3](/en/compare/blockstream-jade-plus-vs-trezor-safe-3).

## Final verdict

The Jade Plus offers an unusually flexible, open-source package for Bitcoin users, and its air-gap capability at this price is hard to match. Understand the blind-oracle model, consider a passphrase or stateless use for larger amounts, and keep firmware updated — and it is an excellent choice, especially as one key in a multi-vendor multisig.
`,
  },
];

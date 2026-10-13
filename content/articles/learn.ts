import type { SeedArticle } from "./types";

export const learn: SeedArticle[] = [
  {
    type: "learn",
    locale: "en",
    slug: "what-is-a-hardware-wallet",
    translationKey: "learn-what-is-hw",
    title: "What Is a Hardware Wallet?",
    metaTitle: "What Is a Hardware Wallet? A Plain-English Guide",
    metaDescription: "What a hardware wallet is, how it protects your Bitcoin and crypto, what it can't protect against, and whether you need one.",
    excerpt: "A small device that keeps your private keys offline and signs transactions — explained without jargon.",
    data: {
      faqs: [
        { q: "Are my coins stored on the hardware wallet?", a: "No. Coins exist on the blockchain. The device stores the private keys that let you spend them." },
        { q: "What happens if my hardware wallet breaks?", a: "Nothing is lost as long as you have your recovery phrase. You can restore your wallet on a new device of the same or another compatible brand." },
        { q: "Can Bitcoin be stolen from a hardware wallet?", a: "It is difficult if you set it up properly. Most thefts happen when people reveal their recovery phrase to scammers, store it digitally, or approve a malicious transaction without reading the device screen." },
      ],
    },
    body: `
A **hardware wallet** is a small, dedicated device that stores the **private keys** that control your Bitcoin or other crypto assets, and uses them to **sign transactions** without ever exposing them to your computer or phone.

## Your coins aren't "in" the device

Bitcoin lives on the blockchain — a public ledger. What you own is the ability to move it, and that ability comes from a private key (see [how Bitcoin private keys work](/en/learn/how-bitcoin-private-keys-work)). A hardware wallet keeps that key in a protected environment and only uses it after you physically confirm an action on the device.

## How it protects you

When you send Bitcoin, your wallet app on a computer or phone builds an unsigned transaction and passes it to the hardware wallet. The device displays the destination address and amount on its **own screen**. You check them and confirm with a button or touch. The device signs the transaction internally and returns only the signature. Even if your computer has malware, it never sees your key — and it can't change the transaction without that change showing on the device screen.

## What it can't protect against

- **Losing your backup.** If the device breaks and you have no recovery phrase, your funds are gone.
- **Revealing your recovery phrase.** Anyone with those words can take your coins — no device needed.
- **Approving the wrong thing.** If you don't read the screen and confirm a malicious address, the device will sign it.
- **A compromised device.** Buy only from the manufacturer or an authorised reseller ([how to buy safely](/en/learn/how-to-buy-and-verify-a-hardware-wallet)).

## Do you need one?

If you hold an amount of crypto that you couldn't afford to lose, and you want to hold it yourself rather than on an exchange, a hardware wallet is the standard tool. Compare [hot and cold wallets](/en/learn/hot-vs-cold-wallets), then try the [wallet finder](/en/quiz) or browse our [best hardware wallets](/en/best/best-hardware-wallets).
`,
  },
  {
    type: "learn",
    locale: "de",
    slug: "was-ist-eine-hardware-wallet",
    translationKey: "learn-what-is-hw",
    title: "Was ist eine Hardware Wallet?",
    metaTitle: "Was ist eine Hardware Wallet? Einfach erklärt",
    metaDescription: "Was eine Hardware Wallet ist, wie sie Ihre Bitcoin und Kryptowerte schützt, wo ihre Grenzen liegen und ob Sie eine brauchen.",
    excerpt: "Ein kleines Gerät, das Ihre privaten Schlüssel offline hält und Transaktionen signiert – ohne Fachchinesisch erklärt.",
    data: {
      faqs: [
        { q: "Sind meine Coins auf der Hardware Wallet gespeichert?", a: "Nein. Coins existieren auf der Blockchain. Das Gerät speichert die privaten Schlüssel, mit denen Sie darüber verfügen." },
        { q: "Was passiert, wenn die Hardware Wallet kaputtgeht?", a: "Nichts geht verloren, solange Sie Ihre Wiederherstellungsphrase haben. Sie stellen die Wallet auf einem neuen kompatiblen Gerät wieder her." },
        { q: "Können Bitcoin von einer Hardware Wallet gestohlen werden?", a: "Bei richtiger Einrichtung ist das schwierig. Die meisten Diebstähle passieren, wenn Menschen ihre Wiederherstellungsphrase an Betrüger verraten, digital speichern oder Transaktionen bestätigen, ohne das Display zu lesen." },
      ],
    },
    body: `
Eine **Hardware Wallet** ist ein kleines, spezialisiertes Gerät, das die **privaten Schlüssel** zu Ihren Bitcoin oder anderen Kryptowerten speichert und damit **Transaktionen signiert** – ohne die Schlüssel jemals Ihrem Computer oder Smartphone preiszugeben.

## Ihre Coins sind nicht „im“ Gerät

Bitcoin existieren auf der Blockchain, einem öffentlichen Kassenbuch. Sie besitzen die Fähigkeit, sie zu bewegen – und die stammt von einem privaten Schlüssel. Die Hardware Wallet bewahrt diesen Schlüssel geschützt auf und nutzt ihn erst, wenn Sie eine Aktion direkt am Gerät bestätigen.

## So schützt sie Sie

Beim Senden erstellt Ihre Wallet-App auf Computer oder Smartphone eine unsignierte Transaktion und übergibt sie der Hardware Wallet. Das Gerät zeigt Empfängeradresse und Betrag auf seinem **eigenen Display** an. Sie prüfen und bestätigen per Taste oder Berührung. Das Gerät signiert intern und gibt nur die Signatur zurück. Selbst wenn Ihr Computer Schadsoftware hat, sieht diese den Schlüssel nie – und kann die Transaktion nicht unbemerkt verändern.

## Wovor sie nicht schützt

- **Verlust des Backups:** Geht das Gerät kaputt und es gibt keine Wiederherstellungsphrase, sind die Coins weg.
- **Preisgabe der Wiederherstellungsphrase:** Wer die Wörter hat, kann Ihre Coins nehmen – ganz ohne Gerät.
- **Bestätigen des Falschen:** Wer das Display nicht liest und eine fremde Adresse bestätigt, signiert sie.
- **Manipulierte Geräte:** Nur beim Hersteller oder autorisierten Händlern kaufen.

## Brauchen Sie eine?

Wenn Sie Kryptowerte halten, deren Verlust Sie sich nicht leisten können, und diese selbst statt auf einer Börse verwahren wollen, ist eine Hardware Wallet das Standardwerkzeug. Lesen Sie weiter: [Seed-Phrase sicher aufbewahren](/de/learn/seed-phrase-sicher-aufbewahren), oder nutzen Sie den [Wallet-Finder](/de/quiz).
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "hot-vs-cold-wallets",
    translationKey: "learn-hot-vs-cold",
    title: "Hot Wallets vs Cold Wallets: What's the Difference?",
    metaDescription: "Hot wallets vs cold wallets explained: how they differ, the risks of each, and how to combine them sensibly.",
    excerpt: "Spending money vs savings: why most people need both.",
    body: `
A **hot wallet** keeps private keys on an internet-connected device — a phone app, a browser extension or desktop software. A **cold wallet** keeps keys on a device that is not exposed to the internet, most commonly a hardware wallet.

## Hot wallets

**Pros:** free, convenient, ideal for frequent small payments.
**Cons:** keys live on a general-purpose device that runs many apps and connects to the internet. Malware, phishing and compromised phones are real risks.

## Cold wallets

**Pros:** keys never touch the internet-connected device; every transaction is confirmed on a separate screen.
**Cons:** cost money, take a little more effort, and must be backed up properly.

## Exchanges are neither

Holding coins on an exchange means the exchange holds the keys. You have a claim on the exchange, not the coins themselves. Exchanges can freeze withdrawals, be hacked or fail.

## A sensible setup

Think of it like cash and a bank vault: a hot wallet for spending money, a hardware wallet for savings. Move only what you need to the hot wallet.

Next: [what is a hardware wallet?](/en/learn/what-is-a-hardware-wallet) · [best hardware wallets for beginners](/en/best/best-hardware-wallets-for-beginners)
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "how-bitcoin-private-keys-work",
    translationKey: "learn-private-keys",
    title: "How Bitcoin Private Keys Work",
    metaDescription: "A clear explanation of Bitcoin private keys, public keys, addresses and signatures — and why randomness matters so much.",
    excerpt: "From a random number to a signature: the cryptography behind self-custody.",
    body: `
## A key is a very large random number

A Bitcoin **private key** is, at heart, a 256-bit number chosen at random. The number of possible keys is so vast that guessing one is not feasible — **as long as the key was generated with enough randomness**.

## From private key to address

From the private key, wallet software derives a **public key** using elliptic-curve cryptography (secp256k1). This is a one-way operation: easy to compute, practically impossible to reverse. From the public key, an **address** is derived, which you share to receive funds.

## Signatures

To spend, you create a **digital signature** with your private key over the transaction. Anyone can verify the signature with your public key, but nobody can create one without the private key. A hardware wallet's job is to create these signatures without letting the private key leave the device.

## One seed, many keys

Modern wallets don't store individual keys. They generate one **seed** — usually represented as 12 or 24 words ([seed phrases explained](/en/learn/seed-phrases-and-recovery)) — and derive all keys from it deterministically (BIP32/BIP39). Back up the seed once and you can recreate every key.

## Why randomness is everything

If the random number behind a seed is predictable, an attacker can reproduce it. In 2026, COLDCARD disclosed a firmware flaw that weakened seed generation on some devices — affected seeds needed to be replaced, even though no device was "hacked" in the usual sense ([details](/en/wallets/coldcard-q)). This is why many advanced users add their own entropy, for example by rolling dice, when generating a seed — and why we weight a vendor's key-generation track record heavily in our [methodology](/en/methodology).
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "seed-phrases-and-recovery",
    translationKey: "learn-seed-phrases",
    title: "Seed Phrases and Recovery, Explained",
    metaTitle: "Seed Phrases Explained: What They Are and How Recovery Works",
    metaDescription: "What a seed phrase (recovery phrase) is, how BIP39 works, how wallet recovery works, and the mistakes that lead to lost Bitcoin.",
    excerpt: "Those 12 or 24 words are your wallet. Here's how they work.",
    data: {
      faqs: [
        { q: "Is a seed phrase the same as a password?", a: "No. A password protects access to a device or account. A seed phrase is the wallet itself — anyone with it can recreate your keys anywhere." },
        { q: "Can I recover my wallet on a different brand of device?", a: "Usually yes, if both support the BIP39 standard and the same derivation paths. Some backup formats, such as SLIP-39 multi-share, are supported by fewer devices." },
      ],
    },
    body: `
A **seed phrase** (also called a recovery phrase or mnemonic) is a list of 12 or 24 words that encodes the random seed from which all your wallet's keys are derived. It is your wallet in human-readable form.

## How BIP39 works

The BIP39 standard maps random bits to words from a fixed list of 2,048 words. Twelve words encode 128 bits of randomness (plus a checksum); 24 words encode 256 bits. Because the list and the derivation method are standardised, the same words recreate the same wallet in any compatible software or device.

## How recovery works

If your device is lost, stolen or broken, you take a new device (or compatible software), choose "restore", and enter your words. The wallet derives the same keys and finds your funds on the blockchain. Your coins were never on the device in the first place.

This is also why the seed phrase is so dangerous in the wrong hands: **anyone who sees it can do exactly the same**.

## Rules that prevent most losses

1. **Never store it digitally.** No photos, notes apps, cloud storage, password managers or emails.
2. **Never type it into a website or app** — except when restoring on a hardware wallet's own screen. "Wallet validation" sites are scams.
3. **Write it carefully** and double-check spelling against the BIP39 word list.
4. **Protect against fire and water** — consider a metal backup.
5. **Test a recovery** before trusting it with significant funds.
6. **Plan for others** — would your family know it exists? See [inheritance planning](/en/learn/bitcoin-inheritance-planning).

## Alternatives and additions

- **Passphrase** — an extra secret that creates a different wallet from the same words ([passphrases explained](/en/learn/passphrases-and-hidden-wallets)).
- **Multi-share backups (SLIP-39)** — split the backup into shares with a threshold.
- **microSD or card backups** — offered by some vendors (BitBox, Tangem); convenient, but understand how they work.

Continue: [how to back up Bitcoin securely](/en/learn/how-to-back-up-bitcoin).
`,
  },
  {
    type: "learn",
    locale: "de",
    slug: "seed-phrase-sicher-aufbewahren",
    translationKey: "learn-backup",
    title: "Seed-Phrase sicher aufbewahren: So sichern Sie Ihre Bitcoin",
    metaTitle: "Seed-Phrase sicher aufbewahren – Anleitung 2026",
    metaDescription: "So bewahren Sie Ihre Seed-Phrase (Wiederherstellungsphrase) sicher auf: Papier vs. Metall, Aufbewahrungsorte, Passphrase, Multi-Share und typische Fehler.",
    excerpt: "Das Backup ist wichtiger als das Gerät. So machen Sie es richtig.",
    data: {
      faqs: [
        { q: "Darf ich ein Foto meiner Seed-Phrase machen?", a: "Nein. Fotos landen schnell in Cloud-Backups und sind für Schadsoftware erreichbar. Bewahren Sie die Wörter nur offline auf." },
        { q: "Ist ein Bankschließfach eine gute Idee?", a: "Es schützt gut vor Feuer und Einbruch, aber Sie haben nur zu Öffnungszeiten Zugriff, und Dritte könnten Kenntnis erlangen. Viele kombinieren es mit einer Passphrase oder einem Multi-Share-Backup." },
      ],
    },
    body: `
Ihre **Seed-Phrase** (12 oder 24 Wörter) ist Ihre Wallet. Geht das Gerät verloren, stellen Sie damit alles wieder her – und jeder, der sie findet, kann das ebenso. Ein gutes Backup schützt also vor zwei Gefahren gleichzeitig: **Verlust** und **Diebstahl**.

## Die Grundregeln

1. **Nie digital speichern:** keine Fotos, Cloud, Notiz-Apps, Passwortmanager oder E-Mails.
2. **Nie auf Websites eingeben:** Seiten, die Ihre Wallet „validieren“ wollen, sind Betrug.
3. **Sorgfältig notieren** und mit der BIP39-Wortliste abgleichen.
4. **Wiederherstellung testen**, bevor größere Beträge eingehen.

## Papier oder Metall?

Papier ist ein guter Anfang, verträgt aber weder Feuer noch Wasser. Für langfristige Verwahrung empfehlen sich **Metall-Backups** (gestanzte oder gravierte Platten). Achten Sie darauf, dass Sie die Wörter eindeutig und vollständig festhalten.

## Wo aufbewahren?

An einem Ort, der vor Feuer, Wasser und neugierigen Blicken geschützt ist – und getrennt von der Hardware Wallet. Wer mehr Sicherheit will, verteilt das Risiko:

- **Passphrase:** Ein zusätzliches Geheimnis erzeugt eine andere Wallet aus denselben Wörtern. Seed und Passphrase getrennt aufbewahren – wer nur eines findet, kommt nicht an die Coins. Aber: Ohne Passphrase sind auch Sie ausgesperrt.
- **Multi-Share-Backup (SLIP-39):** Das Backup wird in z. B. drei Teile aufgeteilt, von denen zwei zur Wiederherstellung reichen.
- **Multisig:** Mehrere Schlüssel auf Geräten verschiedener Hersteller.

## An die Familie denken

Würden Ihre Angehörigen im Ernstfall wissen, dass es Ihre Bitcoin gibt und wie sie herankommen – ohne dass jemand es zu früh kann? Ein versiegelter Brief mit Anleitung (ohne die Wörter selbst) bei einer Vertrauensperson oder im Testament kann helfen.

## Typische Fehler

- Nur eine einzige Kopie an einem einzigen Ort.
- Seed und Passphrase am selben Ort.
- Nie getestete Wiederherstellung.
- Ein „Support-Mitarbeiter“ fragt nach den Wörtern – das ist immer Betrug.

Weiter: [Was ist eine Hardware Wallet?](/de/learn/was-ist-eine-hardware-wallet) · [Die besten Hardware Wallets in Deutschland](/de/best/beste-hardware-wallets-deutschland)
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "how-to-back-up-bitcoin",
    translationKey: "learn-backup",
    title: "How to Back Up Bitcoin Securely (and Store a Seed Phrase Safely)",
    metaTitle: "How to Store a Seed Phrase Safely: Bitcoin Backup Guide",
    metaDescription: "How to store a seed phrase safely: paper vs metal, where to keep it, passphrases, multi-share backups, multisig and the mistakes to avoid.",
    excerpt: "Your backup matters more than your device. Here's how to get it right.",
    data: {
      faqs: [
        { q: "Can I take a photo of my seed phrase?", a: "No. Photos sync to cloud services and are reachable by malware. Keep seed words offline only." },
        { q: "Should I split my seed words between two places?", a: "Splitting a BIP39 phrase into halves weakens it and can make recovery fragile. Use a proper scheme instead: a passphrase stored separately, SLIP-39 multi-share, or multisig." },
      ],
    },
    body: `
A good backup protects against two opposite threats at once: **losing access** (fire, flood, forgetting, death) and **someone else gaining access** (theft, snooping, scams). Every backup decision is a balance between them.

## Step 1: Record the words properly

Write the words clearly, in order, and check each against the BIP39 word list. Many devices let you verify the backup during setup — do it.

## Step 2: Choose a durable medium

Paper is fine to start with but vulnerable to fire and water. For long-term storage, a **metal backup** (stamped or engraved plates) survives far more. Whatever you choose, make sure it is unambiguous and complete.

## Step 3: Choose where to keep it

Somewhere protected from fire, water and casual discovery, and **separate from the hardware wallet**. A safe at home, a trusted relative's home or a safe-deposit box are common options, each with trade-offs (access hours, who might know about it).

## Step 4: Add protection against theft (optional)

- **Passphrase:** store it separately from the seed. A thief who finds one but not the other gets nothing — but if *you* lose the passphrase, the funds are gone too. See [passphrases explained](/en/learn/passphrases-and-hidden-wallets).
- **Multi-share backup (SLIP-39):** e.g. any 2 of 3 shares can recover, so one lost or stolen share is not fatal. Supported by Trezor and some others.
- **Multisig:** keys on several devices from different vendors. See [multisig custody](/en/learn/multisig-custody).

Don't improvise by cutting a 24-word phrase in half: that weakens it and creates new ways to lose access.

## Step 5: Test recovery

Send a small amount, wipe or use a second device, restore from your backup, and confirm you see the funds. Only then move significant savings.

## Step 6: Plan for the people you leave behind

Write a letter that explains what exists and how to access it — without including the secrets themselves — and keep it with your will or a trusted person. See [inheritance planning](/en/learn/bitcoin-inheritance-planning).

## Common mistakes

- A single copy in a single place.
- Seed and passphrase stored together.
- A recovery that was never tested.
- Trusting anyone who asks for your words "to help". That is always a scam.
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "passphrases-and-hidden-wallets",
    translationKey: "learn-passphrases",
    title: "Passphrases and Hidden Wallets",
    metaDescription: "How a BIP39 passphrase (25th word) works, when to use one, how hidden wallets protect against theft and coercion, and the risks.",
    excerpt: "The optional extra secret that turns one seed into many wallets.",
    body: `
A **passphrase** (sometimes called the "25th word") is an optional extra secret combined with your seed phrase to derive a completely different wallet. Same 24 words + different passphrase = different keys and addresses.

## Why use one?

- **Protection if your seed is found.** A thief with your seed but not your passphrase sees only the wallet without a passphrase — which could be empty or hold a small decoy amount.
- **Defence against physical attacks on the device**, especially relevant for devices without a secure element.
- **Plausible deniability.** Different passphrases open different hidden wallets.

## The risks

- **There is no "wrong passphrase" error.** Any passphrase opens *a* wallet. A typo opens an empty wallet, which can be alarming — and if you forget the exact passphrase (including capitalisation and spaces), the funds are unrecoverable.
- **More to back up.** You now need to protect two secrets, stored separately, and make sure your heirs can find both.

## Good practice

- Use a strong passphrase that you also write down and store **separately** from the seed.
- Enter it on the device itself where possible (touchscreen devices make this easy).
- Note the first receive address of the passphrase wallet, so you can confirm you typed it correctly later.
- Test recovery of the passphrase wallet before depositing.

Devices with good on-device passphrase entry include the [Trezor Safe 5](/en/wallets/trezor-safe-5) and the [BitBox02](/en/wallets/bitbox02).
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "secure-elements-explained",
    translationKey: "learn-secure-elements",
    title: "Secure Elements Explained",
    metaDescription: "What a secure element is, how it protects hardware wallets against physical attacks, the open-source debate, and the alternatives.",
    excerpt: "Why some chips resist attackers with lab equipment — and why that is not the whole story.",
    body: `
A **secure element (SE)** is a tamper-resistant chip designed to store secrets and perform cryptographic operations even when an attacker has physical access and specialist equipment. The same class of chip is used in bank cards and passports.

## What it protects against

General-purpose microcontrollers can be vulnerable to **fault injection** (glitching the voltage or clock to skip security checks) and **side-channel analysis** (measuring power use or electromagnetic emissions). Researchers have used such techniques to extract seeds from older wallets without secure elements. Secure elements include countermeasures against these attacks.

## Certification levels

You'll often see **Common Criteria EAL** ratings (e.g. EAL5+, EAL6+). Higher levels indicate more rigorous evaluation of the chip's design — but a certificate applies to the chip and a defined scope, not to the whole wallet or its firmware. Check what a certificate actually covers.

## The open-source trade-off

Secure-element vendors typically require non-disclosure agreements, so firmware running *inside* the SE usually cannot be published. Manufacturers resolve this differently:

- **Everything in the SE** (Ledger): strongest physical protection, least public auditability.
- **Open-source firmware + SE for specific secrets** (Trezor Safe series, BitBox02): wallet logic is auditable; the SE guards a secret needed to unlock the seed.
- **No SE, alternative protection** (Blockstream Jade's blind oracle): avoids closed chips entirely, relies on a PIN server and encourages passphrase or stateless use.
- **Auditable secure elements** (e.g. Trezor's TROPIC01 in the Safe 7): an attempt to have both.

## What it means for you

An SE matters most if your threat model includes someone stealing the device and investing serious effort. A strong **passphrase** narrows the gap considerably on any device. And no chip protects you from revealing your seed phrase to a scammer.
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "air-gapped-signing",
    translationKey: "learn-air-gapped",
    title: "Air-Gapped Signing Explained",
    metaDescription: "What air-gapped signing is, how QR and microSD signing work with PSBTs, the benefits and the limits.",
    excerpt: "Signing transactions without a cable, Bluetooth or any data connection.",
    body: `
An **air-gapped** hardware wallet never forms a data connection with your computer or phone. Transactions cross the "air gap" as **QR codes** (via a camera) or on a **microSD card**.

## How it works

1. Your wallet software (e.g. Sparrow, Nunchuk, Keystone's app) creates an unsigned **PSBT** — a partially signed Bitcoin transaction.
2. You transfer it to the device by scanning a QR code or inserting a microSD card.
3. The device shows the details; you verify and sign.
4. The signed transaction returns the same way, and your software broadcasts it.

## Benefits

- Removes the attack surface of a USB or Bluetooth stack.
- Makes it obvious what data enters and leaves the device.
- Works well with multisig, where each signer can be in a different place.

## Limits

- Slower and more steps than USB.
- The device still needs firmware updates, typically via microSD.
- Air-gapping does **not** protect against a bad seed, a leaked backup or approving the wrong address.

Devices: [best air-gapped hardware wallets](/en/best/best-air-gapped-hardware-wallets).
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "multisig-custody",
    translationKey: "learn-multisig",
    title: "Multisignature (Multisig) Custody Explained",
    metaDescription: "How Bitcoin multisig works, why 2-of-3 with different vendors is popular, what to back up, and common mistakes.",
    excerpt: "Requiring several keys to spend removes single points of failure.",
    body: `
A **multisig** wallet requires signatures from several keys to spend — for example **any 2 of 3**. No single device, backup or person can move the funds alone.

## Why people use it

- **No single point of failure.** Lose one key and you can still spend with the others.
- **Theft resistance.** A thief needs two keys from two places.
- **Vendor diversity.** Using devices from different manufacturers means a flaw in one — such as the 2026 COLDCARD seed-generation issue — doesn't compromise the wallet by itself.

## What you need

- A **coordinator** wallet, such as Sparrow or Nunchuk, that builds the multisig and transactions.
- **Signers**: hardware wallets with good multisig support (see [our multisig picks](/en/best/best-hardware-wallets-for-long-term-bitcoin-storage)).
- A backup of **each seed** and of the **wallet descriptor** (the configuration listing all public keys and the threshold).

## The descriptor matters

In a 2-of-3, two seeds alone are not enough to find your funds — you also need the public information about the third key, which is contained in the descriptor. Store copies of the descriptor with each key backup. It reveals your balance but cannot spend.

## Common mistakes

- Not backing up the descriptor.
- Keeping two keys in the same place.
- Never testing a recovery.
- Building a setup your heirs can't understand — see [inheritance planning](/en/learn/bitcoin-inheritance-planning).
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "bitcoin-inheritance-planning",
    translationKey: "learn-inheritance",
    title: "Bitcoin Inheritance Planning",
    metaDescription: "How to make sure your Bitcoin can be inherited: letters of instruction, backups, multisig, professional help — without exposing your keys today.",
    excerpt: "If something happened to you tomorrow, could your family access your Bitcoin?",
    body: `
Self-custody means nobody can freeze your Bitcoin — and also that nobody can recover it for your family unless you've planned ahead. Inheritance planning balances two goals: **your heirs can get access when needed**, and **nobody can get access before then**.

## Start with a letter of instruction

Write down — without including seed words or passphrases:

- What you hold and roughly where (which wallets, which devices).
- Where backups are stored and how many shares or keys exist.
- Which software to use for recovery, and whom to ask for technical help.

Keep it with your will or a trusted person, and update it when your setup changes.

## Structures that help

- **Single-sig + separately stored passphrase:** heirs need both pieces; store them with different trusted parties.
- **Multisig (e.g. 2-of-3):** you hold two keys; a trusted person or lawyer holds the third. On your death, the third key plus one of yours allows recovery. Make sure the descriptor is backed up.
- **Collaborative custody services:** some companies hold one key in a multisig and offer inheritance support; you retain control. Evaluate their terms carefully.

## Legal aspects

Mention digital assets in your will. In both the UK and Germany, crypto forms part of the estate. A lawyer familiar with digital assets can help. Never put seed words directly in a will — wills can become public.

## Test it

Ask: could a non-technical relative follow your instructions? If not, simplify.
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "hardware-wallet-scams",
    translationKey: "learn-scams",
    title: "Common Hardware Wallet Scams (and How to Avoid Them)",
    metaDescription: "The most common hardware wallet scams — fake support, phishing, tampered devices, fake apps and address poisoning — and how to protect yourself.",
    excerpt: "Most losses aren't hacks — they're scams. Know the patterns.",
    body: `
Hardware wallets are hard to break. That is why criminals target **people** instead. Almost every scam ends with the victim revealing their recovery phrase or approving a transaction they didn't understand.

## 1. "Support" asking for your recovery phrase

Fake support agents on social media, email, phone or chat ask you to "verify" or "sync" your wallet by entering your words. **No legitimate company will ever ask for your recovery phrase.** Anyone who does is a thief.

## 2. Phishing emails and letters

After e-commerce data leaks, customers have received convincing emails — and even physical letters — claiming their device must be "updated" via a link. Go to the manufacturer's site by typing the address yourself, and update only through official software.

## 3. Tampered or pre-configured devices

Devices bought second-hand or from marketplaces may be tampered with. A device that arrives with a pre-printed recovery phrase, or asks you to use one provided, is a scam. Buy directly — see [how to buy and verify a hardware wallet](/en/learn/how-to-buy-and-verify-a-hardware-wallet).

## 4. Fake apps and browser extensions

Malicious copies of wallet apps appear in app stores and search ads. Download only from links on the manufacturer's official website.

## 5. Address poisoning and clipboard malware

Attackers send tiny transactions from addresses that look like ones you use, hoping you copy the wrong one later. Malware can also replace a copied address. **Always verify the full address on your hardware wallet's screen.**

## 6. Blind signing

In DeFi, malicious contracts can request approvals that let attackers drain tokens. Use devices and apps that show readable details ("clear signing"), and don't approve what you don't understand.

## 7. Recovery services

If you've lost funds, "recovery experts" who contact you are almost always running a second scam.
`,
  },
  {
    type: "learn",
    locale: "en",
    slug: "how-to-buy-and-verify-a-hardware-wallet",
    translationKey: "learn-buy-verify",
    title: "How to Safely Buy a Hardware Wallet and Verify Its Authenticity",
    metaDescription: "Where to buy a hardware wallet safely, what to check when it arrives, and how to verify firmware and device authenticity.",
    excerpt: "Buying direct, checking the device and verifying firmware — step by step.",
    body: `
## Where to buy

- **Directly from the manufacturer**, or from an **authorised reseller** listed on the manufacturer's website.
- **Avoid** marketplaces, auctions and second-hand devices. Even when sold in sealed packaging, you cannot know what happened to them.

## When it arrives

- Check the packaging is intact, but don't rely on seals alone — attackers can reseal.
- **The device must not contain a pre-set recovery phrase.** It should generate a new seed during setup (or let you import your own). Any included card with words already filled in means: stop.
- A brand-new device usually arrives without firmware or with firmware that must be verified on first connection.

## Verify the device and firmware

Manufacturers use different methods; follow the official instructions:

- **Device attestation:** many devices prove they are genuine by signing a challenge with a factory key (e.g. Ledger's "genuine check", Trezor's authenticity check, BitBox's attestation).
- **Signed firmware:** devices only install firmware signed by the manufacturer. Some vendors also publish reproducible builds so independent people can confirm that the published source matches the released binary.
- **Air-gapped devices** often update via microSD; check the file's signature or hash as described in the vendor's documentation.

## Before trusting it with savings

Send a small amount, practise a recovery from your backup, and only then move larger sums. Keep firmware up to date and read vendor security advisories — we list them on every [wallet profile](/en/wallets).
`,
  },
];

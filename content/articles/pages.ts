import type { SeedArticle } from "./types";

/**
 * Trust & legal pages. Legal entity details are NOT invented: the [[legal]] shortcode renders the
 * operator details entered in Admin → Settings, or a visible "to be completed" notice.
 * Have privacy, cookie, terms and Impressum texts reviewed by a qualified lawyer before launch.
 */
export const pages: SeedArticle[] = [
  {
    type: "page",
    locale: "en",
    slug: "about",
    translationKey: "page-about",
    title: "About ColdCompare",
    metaDescription: "Who we are, why we compare hardware wallets, and how we keep our recommendations independent.",
    body: `
ColdCompare helps people choose and use hardware wallets to hold Bitcoin and other crypto assets themselves — safely, and without having to wade through marketing claims.

## What we do

- **Structured comparisons.** Every wallet has a profile with the same attributes, so you can compare like with like: secure element, open-source status, connectivity, backup methods, multisig support and more.
- **Transparent scores.** Ratings come from a [published, weighted scoring model](/en/methodology). You can see each category score and how it contributes to the total.
- **Dated, sourced facts.** Every attribute is labelled as *independently verified*, a *manufacturer claim*, or *not yet verified*, with the date it was last checked.
- **Education first.** Our [academy](/en/learn) explains seed phrases, passphrases, multisig and inheritance in plain language, because most losses come from set-up and backup mistakes, not from broken devices.

## What we don't do

- We don't sell rankings. Manufacturers cannot pay to be included, to move up a list, or to change a score.
- We don't claim to have tested devices we haven't tested. Where an assessment is based on documentation and public research rather than hands-on testing, we say so on the page.
- We never ask for your recovery phrase, private keys or passwords. Nobody legitimate ever will.

## How we make money

Some links to manufacturers and retailers are affiliate links: if you buy through them, we may earn a commission at no extra cost to you. Commission rates are never an input to our scores, rankings or the [wallet finder](/en/quiz). Read the full [affiliate disclosure](/en/affiliate-disclosure).

## Who is behind ColdCompare

[[legal]]

## Contact

Spotted an error or an outdated spec? We want to know — see [contact](/en/contact).
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "about",
    translationKey: "page-about",
    title: "Über ColdCompare",
    metaDescription: "Wer wir sind, warum wir Hardware Wallets vergleichen und wie wir unsere Empfehlungen unabhängig halten.",
    body: `
ColdCompare hilft Menschen, Hardware Wallets auszuwählen und richtig zu nutzen, um Bitcoin und andere Kryptowerte selbst zu verwahren – sicher und ohne sich durch Werbeversprechen kämpfen zu müssen.

## Was wir tun

- **Strukturierte Vergleiche.** Jede Wallet hat ein Profil mit denselben Merkmalen: Secure Element, Open Source, Verbindungen, Backup-Methoden, Multisig und mehr.
- **Transparente Wertungen.** Bewertungen folgen einem [veröffentlichten, gewichteten Modell](/de/methodology). Sie sehen jede Teilwertung und ihren Anteil am Gesamtergebnis.
- **Datierte Fakten mit Quelle.** Jedes Merkmal ist als *unabhängig geprüft*, *Herstellerangabe* oder *noch nicht geprüft* gekennzeichnet – mit Datum der letzten Prüfung.
- **Bildung zuerst.** Unsere [Akademie](/de/learn) erklärt Seed-Phrasen, Passphrasen, Multisig und Erbfolge verständlich. Die meisten Verluste entstehen durch Fehler bei Einrichtung und Backup, nicht durch defekte Geräte.

## Was wir nicht tun

- Wir verkaufen keine Platzierungen. Hersteller können sich weder Aufnahme noch bessere Ränge oder Wertungen erkaufen.
- Wir behaupten keine Tests, die wir nicht durchgeführt haben. Beruht eine Bewertung auf Dokumentation und öffentlicher Forschung statt auf eigenen Tests, steht das auf der Seite.
- Wir fragen nie nach Ihrer Wiederherstellungsphrase, privaten Schlüsseln oder Passwörtern. Seriöse Anbieter tun das nie.

## Wie wir uns finanzieren

Einige Links zu Herstellern und Händlern sind Affiliate-Links: Kaufen Sie darüber, erhalten wir ggf. eine Provision – für Sie ohne Mehrkosten. Provisionen fließen nie in Wertungen, Rankings oder den [Wallet-Finder](/de/quiz) ein. Mehr im [Affiliate-Hinweis](/de/affiliate-disclosure).

## Wer hinter ColdCompare steht

[[legal]]

## Kontakt

Fehler oder veraltete Angaben entdeckt? Bitte melden Sie sich – siehe [Kontakt](/de/contact).
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "methodology",
    translationKey: "page-methodology",
    title: "Review methodology",
    metaDescription: "How ColdCompare scores hardware wallets: the weighted model, what each category measures, and the limits of our assessments.",
    body: `
Our goal is a scoring model that anyone can read, check and reproduce. This page explains exactly how it works — and what it cannot tell you.

## The weighted model

Each wallet receives a score from 0 to 10 in six categories. The overall score is the weighted average:

**overall = Σ (category score × weight) ÷ Σ weights**, rounded to one decimal.

[[weights]]

Weights are set by the editorial team and published here. If we change them, every overall score on the site updates at the same time.

## What each category measures

### Security architecture
How keys are generated, stored and used. We consider whether a secure element protects secrets against physical extraction, whether firmware can be independently reviewed, the size of the attack surface (e.g. Bitcoin-only firmware, radios), how firmware updates are authenticated, and — importantly — **the vendor's track record**, including published vulnerabilities and how they were handled. A serious flaw in key generation weighs heavily, because it undermines everything else.

### Backup and recovery
Standard BIP39 support (so you are not locked in to one vendor), multi-share options such as SLIP-39, microSD or card backups, passphrase support, and how clearly the device guides you through backing up and testing a recovery.

### Ease of use
Set-up guidance, screen size and readability for verifying addresses and transactions, input method, and the quality of companion software.

### Privacy and transparency
Open-source firmware and hardware, the ability to use your own node or privacy-preserving software, the amount of data the companion app requires, and the vendor's history of data handling.

### Features and compatibility
Supported assets, platforms (desktop, Android, iOS), connectivity options, multisig and compatibility with independent wallet software.

### Price and value
Recommended retail price relative to what the device offers. It carries the lowest weight by design: saving money is never a good reason to compromise on security.

## Fact status labels

Every attribute on a profile carries one of three labels:

- **Independently verified** — an editor confirmed it against a primary source (official documentation, source code, a certificate) or by hands-on checking.
- **Manufacturer claim** — taken from the manufacturer's materials and not independently confirmed.
- **Not yet verified** — we have a value, but it is pending confirmation (common for prices, which change often).

Each profile also shows the date specifications were last verified.

## Desk research vs. hands-on testing

Unless a review explicitly says otherwise, our assessments are **desk research**: manufacturer documentation, published audits, source code, certification records and public security research. We do not present such assessments as lab results. When we test a device hands-on, the review says so and describes what was tested.

## Things a score cannot capture

Different people have different threat models. A device that is ideal for someone holding a small amount on a phone may be wrong for someone securing a family's savings. **No wallet is universally "the most secure".** Read the "who should buy it" and "who should avoid it" sections, and consider how you will back up and protect your keys — that matters more than the device.

## Independence

Affiliate relationships and commission rates are not inputs to scores, rankings or the wallet finder. See our [editorial policy](/en/editorial-policy) and [affiliate disclosure](/en/affiliate-disclosure).
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "methodology",
    translationKey: "page-methodology",
    title: "Bewertungsmethodik",
    metaDescription: "So bewertet ColdCompare Hardware Wallets: das gewichtete Modell, die Kategorien und die Grenzen unserer Einschätzungen.",
    body: `
Unser Ziel ist ein Bewertungsmodell, das jeder lesen, prüfen und nachvollziehen kann. Diese Seite erklärt, wie es funktioniert – und was es nicht leisten kann.

## Das gewichtete Modell

Jede Wallet erhält in sechs Kategorien eine Wertung von 0 bis 10. Die Gesamtwertung ist der gewichtete Durchschnitt:

**Gesamt = Σ (Kategoriewertung × Gewicht) ÷ Σ Gewichte**, auf eine Nachkommastelle gerundet.

[[weights]]

Die Gewichte legt die Redaktion fest und veröffentlicht sie hier. Ändern wir sie, aktualisieren sich alle Gesamtwertungen gleichzeitig.

## Was die Kategorien messen

### Sicherheitsarchitektur
Wie Schlüssel erzeugt, gespeichert und genutzt werden: Schutz durch ein Secure Element, unabhängig prüfbare Firmware, Größe der Angriffsfläche (z. B. Bitcoin-only-Firmware, Funk), Absicherung von Updates – und vor allem **die Erfahrungen mit dem Hersteller**, einschließlich veröffentlichter Schwachstellen und deren Behandlung. Ein schwerer Fehler bei der Schlüsselerzeugung wiegt besonders schwer.

### Backup und Wiederherstellung
BIP39-Standard (keine Herstellerbindung), Multi-Share-Optionen wie SLIP-39, microSD- oder Karten-Backups, Passphrase-Unterstützung und wie gut das Gerät durch Sicherung und Testwiederherstellung führt.

### Bedienbarkeit
Einrichtung, Displaygröße und Lesbarkeit beim Prüfen von Adressen und Transaktionen, Eingabe und Qualität der Begleitsoftware.

### Privatsphäre und Transparenz
Open-Source-Firmware und -Hardware, Nutzung eigener Nodes oder datensparsamer Software, Datenbedarf der App und der Umgang des Herstellers mit Kundendaten.

### Funktionen und Kompatibilität
Unterstützte Assets, Plattformen (Desktop, Android, iOS), Verbindungen, Multisig und Kompatibilität mit unabhängiger Wallet-Software.

### Preis-Leistung
Unverbindliche Preisempfehlung im Verhältnis zum Gebotenen. Sie hat bewusst das geringste Gewicht: Sparen ist nie ein guter Grund für Abstriche bei der Sicherheit.

## Faktenstatus

Jedes Merkmal trägt eine von drei Kennzeichnungen:

- **Unabhängig geprüft** – von der Redaktion anhand einer Primärquelle (Dokumentation, Quellcode, Zertifikat) oder praktisch bestätigt.
- **Herstellerangabe** – aus Herstellerunterlagen übernommen, nicht unabhängig bestätigt.
- **Noch nicht geprüft** – ein Wert liegt vor, die Bestätigung steht aus (häufig bei Preisen).

Jedes Profil zeigt außerdem, wann die Daten zuletzt geprüft wurden.

## Recherche statt Labortest

Sofern ein Testbericht nichts anderes sagt, beruhen unsere Einschätzungen auf **Recherche**: Herstellerdokumentation, veröffentlichte Audits, Quellcode, Zertifizierungen und öffentliche Sicherheitsforschung. Wir geben solche Einschätzungen nicht als Laborergebnisse aus. Testen wir ein Gerät selbst, steht das ausdrücklich im Bericht.

## Was eine Wertung nicht erfasst

Menschen haben unterschiedliche Bedrohungsmodelle. Ein Gerät, das für kleine Beträge auf dem Smartphone ideal ist, kann für die Ersparnisse einer Familie falsch sein. **Keine Wallet ist für alle „die sicherste“.** Lesen Sie die Abschnitte „Für wen“ und „Wer sollte sie meiden“ – und planen Sie Ihr Backup sorgfältig. Das ist wichtiger als das Gerät.

## Unabhängigkeit

Affiliate-Beziehungen und Provisionen fließen nicht in Wertungen, Rankings oder den Wallet-Finder ein. Siehe [Redaktionsrichtlinien](/de/editorial-policy) und [Affiliate-Hinweis](/de/affiliate-disclosure).
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "editorial-policy",
    translationKey: "page-editorial-policy",
    title: "Editorial policy",
    metaDescription: "How ColdCompare researches, fact-checks, corrects and separates editorial content from commercial relationships.",
    body: `
## Independence

Editorial decisions — what we cover, how we score it and what we recommend — are made by the editorial team alone. Commercial staff and partners have no say. Manufacturers cannot review or approve content before publication.

## Research and fact-checking

1. Specifications are taken from primary sources wherever possible: official documentation, source-code repositories, certification records and published audits.
2. Each attribute is labelled *independently verified*, *manufacturer claim* or *not yet verified*.
3. Before publication, a second editor checks every factual claim against its source using our editorial checklist. Content that has not passed this check stays in draft and is not public.
4. Security advisories and incidents are reported factually, with links to the vendor's own disclosure where available.

## Hands-on testing

We only describe a device as tested if we have used it ourselves, and we state what was tested. Otherwise, reviews are clearly labelled as desk-research assessments.

## Corrections

If we get something wrong, we fix it promptly and update the "fact-checked" date. Material corrections — for example, a changed recommendation — are noted at the end of the article. Report errors via our [contact page](/en/contact).

## Updates

Hardware wallets change through firmware updates, price changes and new security research. We review every published profile at least quarterly and immediately after a significant security advisory.

## Sponsored content

We do not currently publish sponsored content. If we ever do, it will be clearly labelled "Sponsored", visually separated from editorial content, and never presented as a review or ranking.

## Safety

We will never ask readers for recovery phrases, private keys or passwords, and we will never publish content that encourages entering them anywhere online.
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "editorial-policy",
    translationKey: "page-editorial-policy",
    title: "Redaktionsrichtlinien",
    metaDescription: "Wie ColdCompare recherchiert, Fakten prüft, korrigiert und redaktionelle Inhalte von Geschäftsbeziehungen trennt.",
    body: `
## Unabhängigkeit

Redaktionelle Entscheidungen – Themen, Wertungen und Empfehlungen – trifft allein die Redaktion. Partner und kaufmännische Mitarbeiter haben kein Mitspracherecht. Hersteller können Inhalte vor der Veröffentlichung weder einsehen noch freigeben.

## Recherche und Faktenprüfung

1. Spezifikationen stammen möglichst aus Primärquellen: offizielle Dokumentation, Quellcode, Zertifizierungen und veröffentlichte Audits.
2. Jedes Merkmal ist als *unabhängig geprüft*, *Herstellerangabe* oder *noch nicht geprüft* gekennzeichnet.
3. Vor der Veröffentlichung prüft eine zweite Person jede Tatsachenbehauptung anhand unserer Checkliste. Inhalte ohne diese Prüfung bleiben Entwurf und sind nicht öffentlich.
4. Sicherheitshinweise und Vorfälle berichten wir sachlich, wenn möglich mit Link zur Meldung des Herstellers.

## Praxistests

Wir bezeichnen ein Gerät nur als getestet, wenn wir es selbst genutzt haben, und beschreiben, was getestet wurde. Andernfalls sind Berichte klar als Recherche-Bewertungen gekennzeichnet.

## Korrekturen

Fehler korrigieren wir umgehend und aktualisieren das Prüfdatum. Wesentliche Korrekturen – etwa eine geänderte Empfehlung – vermerken wir am Ende des Artikels. Fehler melden Sie über unsere [Kontaktseite](/de/contact).

## Aktualisierungen

Hardware Wallets verändern sich durch Firmware-Updates, Preisänderungen und neue Sicherheitsforschung. Wir prüfen jedes veröffentlichte Profil mindestens vierteljährlich und sofort nach wichtigen Sicherheitshinweisen.

## Gesponserte Inhalte

Derzeit veröffentlichen wir keine gesponserten Inhalte. Sollte sich das ändern, werden sie deutlich als „Anzeige“ gekennzeichnet, optisch getrennt und nie als Test oder Ranking dargestellt.

## Sicherheit

Wir fragen Leser nie nach Wiederherstellungsphrasen, privaten Schlüsseln oder Passwörtern und veröffentlichen keine Inhalte, die zur Eingabe solcher Daten im Internet verleiten.
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "affiliate-disclosure",
    translationKey: "page-affiliate-disclosure",
    title: "Affiliate disclosure",
    metaDescription: "How affiliate links work on ColdCompare and why they never influence our rankings.",
    body: `
Some links on this website are affiliate links. We may earn a commission when you purchase through them, at no additional cost to you. Our reviews and recommendations remain editorially independent.

## How it works

When you click a "Visit store" or "Check price" button, you pass through a short redirect on our domain (\`/go/…\`) before reaching the retailer. This lets us count clicks per product and page — without storing your IP address or setting tracking cookies — and lets us update a retailer link in one place.

Links that are affiliate links are marked with \`rel="sponsored"\` for search engines. Where we do not yet have an affiliate agreement with a manufacturer, the button links to the manufacturer's official store and earns us nothing. We never invent tracking links or relationships.

## What affiliate relationships do not affect

- Scores and rankings, which come from our [published methodology](/en/methodology).
- The [wallet finder](/en/quiz), which only uses product characteristics and editorial scores.
- Which products we cover or what we say about them, including security advisories.

## Where we send you

We link to official manufacturer stores and verified authorised resellers only. Buying from marketplaces or second-hand sellers increases the risk of receiving a tampered device.
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "affiliate-disclosure",
    translationKey: "page-affiliate-disclosure",
    title: "Affiliate-Hinweis",
    metaDescription: "Wie Affiliate-Links bei ColdCompare funktionieren und warum sie unsere Rankings nie beeinflussen.",
    body: `
Einige Links auf dieser Website sind Affiliate-Links. Wenn Sie darüber einkaufen, erhalten wir möglicherweise eine Provision – für Sie ohne Mehrkosten. Unsere Testberichte und Empfehlungen bleiben redaktionell unabhängig.

## So funktioniert es

Klicken Sie auf „Zum Shop“ oder „Preis prüfen“, gelangen Sie über eine kurze Weiterleitung auf unserer Domain (\`/go/…\`) zum Händler. So zählen wir Klicks pro Produkt und Seite – ohne Ihre IP-Adresse zu speichern oder Tracking-Cookies zu setzen – und können Händlerlinks zentral aktualisieren.

Affiliate-Links sind für Suchmaschinen mit \`rel="sponsored"\` gekennzeichnet. Haben wir mit einem Hersteller (noch) keine Vereinbarung, verlinken wir auf den offiziellen Shop ohne Vergütung. Wir erfinden weder Tracking-Links noch Partnerschaften.

## Was Affiliate-Beziehungen nicht beeinflussen

- Wertungen und Rankings, die unserer [veröffentlichten Methodik](/de/methodology) folgen.
- Den [Wallet-Finder](/de/quiz), der nur Produktmerkmale und redaktionelle Wertungen nutzt.
- Welche Produkte wir behandeln und was wir darüber schreiben – inklusive Sicherheitshinweisen.

## Wohin wir verlinken

Wir verlinken ausschließlich auf offizielle Hersteller-Shops und geprüfte autorisierte Händler. Käufe auf Marktplätzen oder aus zweiter Hand erhöhen das Risiko manipulierter Geräte.
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "privacy",
    translationKey: "page-privacy",
    title: "Privacy policy",
    metaDescription: "What personal data ColdCompare processes, why, and your rights under UK GDPR and EU GDPR.",
    data: { noindex: false },
    body: `
> **Operator note:** this policy describes how the ColdCompare software processes data by default. Complete the controller details in Admin → Settings, list your actual hosting and service providers, and have the final text reviewed by a qualified data-protection lawyer before launch.

## Controller

[[legal]]

## What we process and why

| Processing | Data | Purpose | Legal basis (UK/EU GDPR) | Retention |
|---|---|---|---|---|
| Serving the website | IP address, browser data in server logs of our hosting provider | Delivering pages, security | Legitimate interests (Art. 6(1)(f)) | Per hosting provider's log retention |
| Outbound click counting | Product, page, country (derived from your choice or approximate geo header), device type (mobile/desktop), time. **No IP address, no cookies identifiers.** | Understanding which content helps readers; affiliate reporting | Legitimate interests (Art. 6(1)(f)) | 26 months |
| Preferences | Language, country and consent choices stored in first-party cookies | Remembering your settings | Strictly necessary / legitimate interests | Up to 12 months |
| Analytics (optional) | Pseudonymous usage data via Google Analytics 4, only after you opt in | Measuring content performance | Consent (Art. 6(1)(a)) | Per GA4 retention setting |
| Privacy-friendly analytics (optional) | Aggregated, cookieless page statistics | Measuring content performance | Legitimate interests (Art. 6(1)(f)) | Aggregated |
| Newsletter (optional) | Email address, language, time of signup and confirmation, consent wording | Sending the newsletter you requested (double opt-in) | Consent (Art. 6(1)(a)) | Until you unsubscribe |
| Contact | The data you include in your message | Answering you | Legitimate interests / pre-contractual | Up to 12 months after resolution |

We never ask for, and you must never send us, recovery phrases, private keys or passwords.

## Recipients

Hosting and database providers process data on our behalf under data-processing agreements. If you consent to analytics, Google may process data in the United States; transfers rely on the EU–US Data Privacy Framework / UK Extension or standard contractual clauses. When you follow a link to a retailer, that retailer's privacy policy applies.

## Your rights

You have the right to access, rectify, erase, restrict and port your data, to object to processing based on legitimate interests, and to withdraw consent at any time (for example via "Cookie settings" in the footer or the unsubscribe link in any newsletter). You can complain to a supervisory authority — in the UK the Information Commissioner's Office (ICO); in Germany the data-protection authority of your federal state.

## Changes

We will update this page when our processing changes and show the date of the last update.
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "privacy",
    translationKey: "page-privacy",
    title: "Datenschutzerklärung",
    metaDescription: "Welche personenbezogenen Daten ColdCompare verarbeitet, warum, und Ihre Rechte nach DSGVO und UK GDPR.",
    body: `
> **Hinweis für den Betreiber:** Diese Erklärung beschreibt die Standard-Datenverarbeitung der ColdCompare-Software. Ergänzen Sie die Angaben zum Verantwortlichen unter Admin → Einstellungen, nennen Sie Ihre tatsächlichen Dienstleister und lassen Sie den Text vor dem Start anwaltlich prüfen.

## Verantwortlicher

[[legal]]

## Welche Daten wir verarbeiten und warum

| Verarbeitung | Daten | Zweck | Rechtsgrundlage (DSGVO) | Speicherdauer |
|---|---|---|---|---|
| Bereitstellung der Website | IP-Adresse, Browserdaten in Server-Logs des Hosters | Auslieferung, Sicherheit | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f) | Gemäß Log-Aufbewahrung des Hosters |
| Zählung ausgehender Klicks | Produkt, Seite, Land (aus Ihrer Auswahl oder ungefährem Geo-Header), Gerätetyp, Zeit. **Keine IP-Adresse, keine Cookie-Kennungen.** | Verstehen, welche Inhalte helfen; Affiliate-Abrechnung | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f) | 26 Monate |
| Einstellungen | Sprache, Land und Einwilligungen in eigenen Cookies | Speichern Ihrer Einstellungen | Technisch notwendig (§ 25 Abs. 2 TDDDG) | Bis zu 12 Monate |
| Analyse (optional) | Pseudonyme Nutzungsdaten über Google Analytics 4, nur nach Einwilligung | Messung der Inhaltsleistung | Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG) | Gemäß GA4-Einstellung |
| Datensparsame Analyse (optional) | Aggregierte, cookielose Seitenstatistik | Messung der Inhaltsleistung | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f) | Aggregiert |
| Newsletter (optional) | E-Mail-Adresse, Sprache, Zeitpunkt von Anmeldung und Bestätigung, Einwilligungstext | Versand des angeforderten Newsletters (Double-Opt-in) | Einwilligung (Art. 6 Abs. 1 lit. a) | Bis zur Abmeldung |
| Kontakt | Angaben in Ihrer Nachricht | Beantwortung | Berechtigtes Interesse / vorvertraglich | Bis 12 Monate nach Erledigung |

Wir fragen nie nach Wiederherstellungsphrasen, privaten Schlüsseln oder Passwörtern – senden Sie uns diese niemals.

## Empfänger

Hosting- und Datenbankanbieter verarbeiten Daten in unserem Auftrag auf Grundlage von Auftragsverarbeitungsverträgen. Willigen Sie in Analyse ein, kann Google Daten in den USA verarbeiten; Grundlage ist das EU-US Data Privacy Framework bzw. Standardvertragsklauseln. Folgen Sie einem Link zu einem Händler, gilt dessen Datenschutzerklärung.

## Ihre Rechte

Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit, auf Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen sowie auf jederzeitigen Widerruf erteilter Einwilligungen (z. B. über „Cookie-Einstellungen“ im Footer oder den Abmeldelink im Newsletter). Sie können sich bei einer Aufsichtsbehörde beschweren, etwa der Datenschutzbehörde Ihres Bundeslandes.

## Änderungen

Wir aktualisieren diese Seite, wenn sich unsere Verarbeitung ändert, und nennen das Datum der letzten Änderung.
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "cookies",
    translationKey: "page-cookies",
    title: "Cookie policy",
    metaDescription: "The cookies ColdCompare uses and how to change your choices.",
    body: `
We keep cookies to a minimum. You can change your choices at any time via **Cookie settings** in the footer.

| Cookie | Type | Purpose | Duration |
|---|---|---|---|
| \`cc_locale\` | Strictly necessary | Remembers your language | 12 months |
| \`cc_country\` | Strictly necessary | Remembers your country for prices and local retailers | 12 months |
| \`cc_consent\` | Strictly necessary | Stores your cookie choices | 12 months |
| \`_ga\`, \`_ga_*\` | Analytics (opt-in) | Google Analytics 4, only set if you accept analytics | Up to 14 months |
| \`cc_admin\` | Strictly necessary | Administrator login (admin area only) | 12 hours |

If privacy-friendly analytics is enabled, it does not use cookies.

Our affiliate redirect (\`/go/…\`) does not set cookies. Retailers you visit may set their own cookies, including affiliate cookies; their cookie policies apply.
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "cookies",
    translationKey: "page-cookies",
    title: "Cookie-Richtlinie",
    metaDescription: "Welche Cookies ColdCompare nutzt und wie Sie Ihre Auswahl ändern.",
    body: `
Wir setzen so wenige Cookies wie möglich. Ihre Auswahl können Sie jederzeit über **Cookie-Einstellungen** im Footer ändern.

| Cookie | Art | Zweck | Dauer |
|---|---|---|---|
| \`cc_locale\` | Technisch notwendig | Speichert Ihre Sprache | 12 Monate |
| \`cc_country\` | Technisch notwendig | Speichert Ihr Land für Preise und Händler | 12 Monate |
| \`cc_consent\` | Technisch notwendig | Speichert Ihre Cookie-Auswahl | 12 Monate |
| \`_ga\`, \`_ga_*\` | Analyse (Einwilligung) | Google Analytics 4, nur nach Zustimmung | Bis zu 14 Monate |
| \`cc_admin\` | Technisch notwendig | Administrator-Anmeldung (nur Admin-Bereich) | 12 Stunden |

Ist datensparsame Analyse aktiviert, nutzt sie keine Cookies.

Unsere Affiliate-Weiterleitung (\`/go/…\`) setzt keine Cookies. Händler können eigene Cookies setzen, auch Affiliate-Cookies; dafür gelten deren Richtlinien.
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "terms",
    translationKey: "page-terms",
    title: "Terms of use",
    metaDescription: "Terms for using the ColdCompare website.",
    body: `
> **Operator note:** template text — have it reviewed by a qualified lawyer for your jurisdiction before launch.

## Information only, not advice

Content on this website is for general information and education. It is not financial, investment, legal or tax advice. Cryptocurrencies are volatile and you can lose money. Security practices that suit one person may not suit another; you are responsible for your own decisions and for protecting your keys and backups.

## Accuracy

We work hard to keep information accurate and up to date and label every specification with its verification status. Products, prices, firmware and security research change, so information may become outdated. Always check the manufacturer's official documentation before relying on it.

## Third-party links

We link to manufacturers and retailers. We are not responsible for their products, services, content or terms. Some links are affiliate links — see the [affiliate disclosure](/en/affiliate-disclosure).

## Your recovery phrase

Never enter your recovery phrase, private keys or wallet passwords on this website or send them to us. We will never ask for them.

## Intellectual property

Text, data compilations, graphics and code on this website are protected by copyright. You may share links and quote short excerpts with attribution. Product names and trademarks belong to their owners.

## Liability

Nothing in these terms limits liability that cannot be limited by law. Otherwise, to the extent permitted by law, we are not liable for losses arising from reliance on information on this website.

## Operator

[[legal]]
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "terms",
    translationKey: "page-terms",
    title: "Nutzungsbedingungen",
    metaDescription: "Bedingungen für die Nutzung der Website ColdCompare.",
    body: `
> **Hinweis für den Betreiber:** Mustertext – vor dem Start anwaltlich prüfen lassen.

## Nur Information, keine Beratung

Die Inhalte dienen der allgemeinen Information und Bildung. Sie sind keine Finanz-, Anlage-, Rechts- oder Steuerberatung. Kryptowährungen sind volatil; Verluste sind möglich. Sicherheitspraktiken, die für eine Person passen, müssen nicht für andere passen. Sie sind für Ihre Entscheidungen sowie den Schutz Ihrer Schlüssel und Backups selbst verantwortlich.

## Richtigkeit

Wir bemühen uns um aktuelle und richtige Informationen und kennzeichnen jede Angabe mit ihrem Prüfstatus. Produkte, Preise, Firmware und Sicherheitsforschung ändern sich; Angaben können veralten. Prüfen Sie stets die offizielle Herstellerdokumentation.

## Links zu Dritten

Wir verlinken auf Hersteller und Händler und sind nicht für deren Produkte, Inhalte oder Bedingungen verantwortlich. Einige Links sind Affiliate-Links – siehe [Affiliate-Hinweis](/de/affiliate-disclosure).

## Ihre Wiederherstellungsphrase

Geben Sie Ihre Wiederherstellungsphrase, privaten Schlüssel oder Wallet-Passwörter niemals auf dieser Website ein und senden Sie sie uns nie. Wir werden nie danach fragen.

## Urheberrecht

Texte, Datensammlungen, Grafiken und Code sind urheberrechtlich geschützt. Links und kurze Zitate mit Quellenangabe sind erlaubt. Produktnamen und Marken gehören ihren Inhabern.

## Haftung

Die Haftung für Vorsatz und grobe Fahrlässigkeit sowie nach zwingenden gesetzlichen Vorschriften bleibt unberührt. Im Übrigen haften wir, soweit gesetzlich zulässig, nicht für Schäden aus dem Vertrauen auf Informationen dieser Website.

## Betreiber

[[legal]]
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "contact",
    translationKey: "page-contact",
    title: "Contact",
    metaDescription: "How to contact the ColdCompare editorial team.",
    body: `
We read every message, and we especially welcome corrections: if a spec, price or security detail on our site is wrong or outdated, please tell us and include a link to the source.

[[contact]]

**Never send us your recovery phrase, private keys or passwords.** We cannot help recover lost funds, and anyone who claims they can in exchange for your seed words is a scammer.

Manufacturers: we're happy to receive corrections with sources. We do not accept payment for coverage, rankings or scores.
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "contact",
    translationKey: "page-contact",
    title: "Kontakt",
    metaDescription: "So erreichen Sie die Redaktion von ColdCompare.",
    body: `
Wir lesen jede Nachricht und freuen uns besonders über Korrekturen: Ist eine Angabe, ein Preis oder ein Sicherheitsdetail falsch oder veraltet, schreiben Sie uns bitte mit Link zur Quelle.

[[contact]]

**Senden Sie uns niemals Ihre Wiederherstellungsphrase, privaten Schlüssel oder Passwörter.** Wir können keine verlorenen Coins wiederherstellen – wer das gegen Ihre Seed-Wörter verspricht, ist ein Betrüger.

Hersteller: Korrekturen mit Quellen sind willkommen. Für Berichterstattung, Rankings oder Wertungen nehmen wir kein Geld an.
`,
  },
  {
    type: "page",
    locale: "en",
    slug: "impressum",
    translationKey: "page-impressum",
    title: "Legal notice (Impressum)",
    metaDescription: "Legal notice for ColdCompare.",
    data: { noindex: true },
    body: `
Information pursuant to § 5 DDG (German Digital Services Act).

[[legal]]

The German version of this page is authoritative: [Impressum](/de/impressum).
`,
  },
  {
    type: "page",
    locale: "de",
    slug: "impressum",
    translationKey: "page-impressum",
    title: "Impressum",
    metaDescription: "Impressum von ColdCompare.",
    data: { noindex: true },
    body: `
Angaben gemäß § 5 DDG.

[[legal]]

**Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:** siehe Vertretungsberechtigte Person oben.

**Verbraucherstreitbeilegung:** Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

**Haftung für Links:** Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese Inhalte ist stets der jeweilige Anbieter verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.
`,
  },
];

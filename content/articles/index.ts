import { comparisons } from "./comparisons";
import { guides } from "./guides";
import { learn } from "./learn";
import { pages } from "./pages";
import { reviews } from "./reviews";
import type { SeedArticle } from "./types";

export const authors = [
  {
    id: "editorial-team",
    name: "ColdCompare Editorial Team",
    role: { en: "Editorial team", de: "Redaktion" },
    bio: {
      en: "Placeholder author. Replace with named, real editors and their credentials in Admin → Authors before launch.",
      de: "Platzhalter. Vor dem Start unter Admin → Autoren durch namentlich genannte Redakteure mit Qualifikationen ersetzen.",
    },
    isPlaceholder: true,
  },
];

export const articles: SeedArticle[] = [...pages, ...reviews, ...comparisons, ...guides, ...learn];

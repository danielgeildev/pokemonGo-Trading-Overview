import type { Partner } from "@/lib/db";

/** Erweiterung für die Anzeige: Trade-Datum und Pokemon-Bild (Daten kannst du später einbinden) */
export type PartnerDisplay = Partner & {
  tradeDate?: string;
  imageUrl?: string;
};

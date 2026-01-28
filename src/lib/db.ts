// db.ts
import Dexie, { type EntityTable } from "dexie";

export type Direction = "give" | "receive";
export type TradeStatus = "open" | "done";

export type Partner = {
  id: string;
  displayName: string;
  redditUrl?: string;
  inGameName?: string;
  friendCode?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type PartnerPokemon = {
  id: string;
  partnerId: string;
  pokemonName: string;
  direction: Direction;
  spriteUrl?: string;
  status: TradeStatus;
  createdAt: string; // ISO
  // tradeDate?: string; // ISO (nur wenn du wirklich Termine brauchst)
};

export const db = new Dexie("trade_partner_db") as Dexie & {
  partners: EntityTable<Partner, "id">;
  partnerPokemon: EntityTable<PartnerPokemon, "id">;
};

// Schema declaration (runtime!)
db.version(1).stores({
  partners: "id, displayName, updatedAt, createdAt",
  partnerPokemon: "id, partnerId, direction, status, createdAt",
});

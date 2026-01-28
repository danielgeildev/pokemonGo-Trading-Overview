import { db, Partner } from "./db";

export type NewPartner = {
  displayName: string;
  friendCode: string;
  redditUrl: string;
  inGameName: string;
};

export function addPartner({
  displayName,
  friendCode,
  redditUrl,
  inGameName,
}: NewPartner) {
  const now = new Date().toISOString();

  db.partners.add({
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    displayName: displayName,
    friendCode: friendCode,
    redditUrl: redditUrl,
    inGameName: inGameName,
  });
}

export function deletePartner(id: string) {
  console.log("detected delete with id", id);
  db.partners.delete(id);
}

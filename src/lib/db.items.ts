import { db, Partner } from "./db";

export function addPartner({
  displayName,
  friendCode,
  redditUrl,
  inGameName,
}: Partner) {
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

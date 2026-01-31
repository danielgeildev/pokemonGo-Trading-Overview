"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PartnerDisplay } from "@/types/partner";
import { cn } from "@/lib/utils";
import { db, Partner } from "@/lib/db";

function formatDate(iso?: string) {
  if (!iso) return "–";
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "–";
  }
}

interface PartnerCardProps {
  partner: PartnerDisplay;
  onEdit: (partner: PartnerDisplay) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export function PartnerCard({ partner, onEdit, onDelete, index = 0 }: PartnerCardProps) {
  const displayDate = partner.tradeDate ?? partner.createdAt;

  // Lokaler State für das Bild
  const [imageUrl, setImageUrl] = useState<string | null>(partner.imageUrl ?? null);

  // Bild aus der Dexie DB laden, falls vorhanden
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const dbPartner: Partner | undefined = await db.partners.get(partner.id);
        if (dbPartner?.pokemonSprite) {
          setImageUrl(dbPartner.pokemonSprite);
        }
      } catch (error) {
        console.error("Fehler beim Laden des Pokémon-Bildes:", error);
      }
    };
    fetchImage();
  }, [partner.id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/partner/${partner.id}`} className="block outline-none">
        <div
          className={cn(
            "flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200",
            "bg-[var(--pokemon-card-bg)] border-[var(--pokemon-card-border)]",
            "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
        >
          {/* Pokémon-Bild */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted ring-2 ring-border">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${partner.displayName} Pokémon`}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="text-2xl" aria-hidden>
                  ⚡
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{partner.displayName}</p>
            <p className="text-sm text-muted-foreground">Trade: {formatDate(displayDate)}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Bearbeiten"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(partner);
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Löschen"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(partner.id);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { usePartners } from "@/hooks/usePartners";
import type { PartnerDisplay } from "@/types/partner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { db, Partner } from "@/lib/db";
import React from "react";

function formatDate(iso?: string) {
  if (!iso) return "–";
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "–";
  }
}

export default function PartnerDetailPage() {
  const params = useParams();
  const { partners } = usePartners();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  const [partner, setPartner] = React.useState<Partner | undefined>();

  React.useEffect(() => {
    if (!id) return;

    const fetchPartner = async () => {
      const p = await db.partners.get(id);
      setPartner(p);
    };

    fetchPartner();
  }, [id]);

  if (!id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-muted-foreground">Ungültige ID.</p>
        <Button variant="link" asChild className="mt-2 pl-0">
          <Link href="/">← Zurück zur Übersicht</Link>
        </Button>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-muted-foreground">Partner nicht gefunden.</p>
        <Button variant="link" asChild className="mt-2 pl-0">
          <Link href="/">← Zurück zur Übersicht</Link>
        </Button>
      </div>
    );
  }

  const displayDate =  partner.createdAt;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4 sm:px-6">
          <Button variant="ghost" size="icon" asChild aria-label="Zurück">
            <Link href="/">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold truncate">Detail</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div
          className={cn(
            "rounded-2xl border-2 border-[var(--pokemon-card-border)] bg-[var(--pokemon-card-bg)] p-6 shadow-sm"
          )}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Pokemon-Bild */}
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted ring-2 ring-border">
              {partner.pokemonSprite ? (
                <img
                  src={partner.pokemonSprite} // hier dein Bildfeld aus DB
                  alt={partner.pokemon || "Pokemon"}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="text-4xl" aria-hidden>
                    ⚡
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                {partner.displayName}
              </h2>
              <dl className="mt-4 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Trade-Datum
                  </dt>
                  <dd className="text-foreground">{formatDate(displayDate)}</dd>
                </div>
                {/* weitere Felder hier */}
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center sm:justify-start">
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Zurück zur Übersicht
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

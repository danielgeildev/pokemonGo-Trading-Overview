"use client";

import { useState } from "react";
import { usePartners } from "@/hooks/usePartners";
import { deletePartner, updatePartner } from "@/lib/db.items";
import type { Partner } from "@/lib/db";
import type { PartnerDisplay } from "@/types/partner";
import { PartnerCard } from "@/components/PartnerCard";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const { partners } = usePartners();
  const [editData, setEditData] = useState<Partner | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const displayPartners: PartnerDisplay[] = partners.map((p) => ({
    ...p,
    tradeDate: undefined,
    imageUrl: undefined,
  }));

  const showForm = showAddForm || editData !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>🎮</span>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Pokemon Go Trading
            </h1>
          </div>
          <Button
            onClick={() => {
              setEditData(null);
              setShowAddForm(true);
            }}
            className="gap-2"
          >
            <Plus className="size-4" />
            Hinzufügen
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Form (Add/Edit) */}
        {showForm && (
          <div className="mb-8">
            <Form
              editData={editData ?? undefined}
              onEdit={(id, updatedData) => {
                updatePartner(id, updatedData);
                setEditData(null);
              }}
              onAddSuccess={() => setShowAddForm(false)}
            />
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setEditData(null);
                  setShowAddForm(false);
                }}
              >
                Abbrechen
              </Button>
            </div>
          </div>
        )}

        {/* Partner-Liste */}
        <section aria-label="Trading-Partner">
          {displayPartners.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 py-12 text-center">
              <p className="text-muted-foreground">
                Noch keine Partner. Klicke auf &quot;Hinzufügen&quot;, um jemanden anzulegen.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {displayPartners.map((partner, index) => (
                <li key={partner.id}>
                  <PartnerCard
                    partner={partner}
                    index={index}
                    onEdit={(p) => {
                      setShowAddForm(false);
                      setEditData(p);
                    }}
                    onDelete={(id) => deletePartner(id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

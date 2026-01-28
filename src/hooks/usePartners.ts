// src/hooks/usePartners.ts
"use client";

import { useEffect, useState } from "react";
import { liveQuery } from "dexie";
import { db, type Partner } from "@/lib/db";

type UsePartnersResult = {
  partners: Partner[];
  loading: boolean;
  error: string | null;
};

export function usePartners(): UsePartnersResult {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const obs = liveQuery(() => db.partners.toArray());

    const sub = obs.subscribe({
      next: (result) => {
        setPartners(result ?? []);
        setLoading(false);
      },
      error: (err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      },
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return { partners, loading, error };
}

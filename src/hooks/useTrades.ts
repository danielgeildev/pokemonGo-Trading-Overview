"use client";

import { useState, useEffect } from "react";
import { Trade } from "@/types/trade";

const STORAGE_KEY = "pokemon-go-trades";

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed: any[] = JSON.parse(stored);
        // Migrate old trades that used traderName instead of ingameName
        const migrated = parsed.map((t) => ({
          ...t,
          ingameName: t.ingameName ?? t.traderName ?? "",
          tags: t.tags ?? [],
          variant: t.variant ?? "normal",
        }));
        setTrades(migrated);
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    }
  }, [trades, loaded]);

  function addTrade(trade: Trade) {
    setTrades((prev) => [trade, ...prev]);
  }

  function deleteTrade(id: string) {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTrade(id: string, updates: Partial<Trade>) {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  function getTradeById(id: string): Trade | undefined {
    return trades.find((t) => t.id === id);
  }

  return { trades, addTrade, deleteTrade, updateTrade, getTradeById, loaded };
}

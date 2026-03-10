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
        const validTags = new Set(["lucky", "costume", "dynamax", "gigantamax"]);
        const migrated = parsed.map((t) => ({
          ...t,
          ingameName: t.ingameName ?? t.traderName ?? "",
          // Strip removed tags (shadow, purified) and keep only valid ones
          theirPokemon: {
            ...t.theirPokemon,
            variant: ["normal", "shiny"].includes(t.theirPokemon?.variant) ? t.theirPokemon.variant : "normal",
            tags: (t.theirPokemon?.tags ?? []).filter((tag: string) => validTags.has(tag)),
          },
          myPokemon: {
            ...t.myPokemon,
            variant: ["normal", "shiny"].includes(t.myPokemon?.variant) ? t.myPokemon.variant : "normal",
            tags: (t.myPokemon?.tags ?? []).filter((tag: string) => validTags.has(tag)),
          },
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

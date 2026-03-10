"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTrades } from "@/hooks/useTrades";
import AddTradeModal from "@/components/AddTradeModal";
import { Trade, PokemonVariant, PokemonTag } from "@/types/trade";

const VARIANT_CONFIG: Record<
  PokemonVariant,
  { label: string; color: string; bg: string }
> = {
  normal: {
    label: "Normal",
    color: "var(--text-secondary)",
    bg: "var(--bg-elevated)",
  },
  shiny: { label: "✨ Shiny", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
};

const TAG_CONFIG: Record<
  PokemonTag,
  { label: string; color: string; bg: string }
> = {
  lucky: { label: "⭐ Lucky", color: "#fcd34d", bg: "rgba(252,211,77,0.15)" },
  costume: {
    label: "🎭 Costume",
    color: "#f9a8d4",
    bg: "rgba(249,168,212,0.15)",
  },
  dynamax: {
    label: "◆ Dynamax",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.15)",
  },
  gigantamax: {
    label: "◈ Gigantamax",
    color: "#e879f9",
    bg: "rgba(232,121,249,0.2)",
  },
};

const STATUS_CONFIG = {
  planned: {
    label: "Geplant",
    color: "var(--blue)",
    bg: "var(--blue-bg)",
    dot: "#60a5fa",
  },
  completed: {
    label: "Abgeschlossen",
    color: "var(--green)",
    bg: "var(--green-bg)",
    dot: "#34d399",
  },
  cancelled: {
    label: "Abgebrochen",
    color: "var(--red)",
    bg: "var(--red-bg)",
    dot: "#f87171",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function TradeCard({ trade }: { trade: Trade }) {
  const status = STATUS_CONFIG[trade.status];

  return (
    <Link href={`/trade/${trade.id}`}>
      <div
        className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--accent)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px var(--accent)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--border)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 2px 12px rgba(0,0,0,0.3)";
        }}
      >
        {/* Card Header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "var(--accent-glow)",
                color: "var(--accent)",
              }}
            >
              {trade.ingameName
                ? trade.ingameName.charAt(0).toUpperCase()
                : null}
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="font-semibold text-sm leading-tight truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {trade.ingameName}
              </span>
              {trade.redditName && (
                <span
                  className="text-xs leading-tight truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  u/{trade.redditName}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {formatDate(trade.date)}
          </span>
        </div>

        {/* Pokemon Trade Display */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Their Pokemon */}
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Erhalte
              </p>
              <div className="w-[72px] h-[72px] relative">
                {trade.theirPokemon.spriteUrl ? (
                  <Image
                    src={trade.theirPokemon.spriteUrl}
                    alt={trade.theirPokemon.displayName}
                    fill
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    ?
                  </div>
                )}
              </div>
              <p
                className="text-sm font-bold text-center leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {trade.theirPokemon.displayName}
              </p>
              {trade.theirPokemon.variant &&
                trade.theirPokemon.variant !== "normal" && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: VARIANT_CONFIG[trade.theirPokemon.variant].bg,
                      color: VARIANT_CONFIG[trade.theirPokemon.variant].color,
                    }}
                  >
                    {VARIANT_CONFIG[trade.theirPokemon.variant].label}
                  </span>
                )}
              {(trade.theirPokemon.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: TAG_CONFIG[tag].bg,
                    color: TAG_CONFIG[tag].color,
                  }}
                >
                  {TAG_CONFIG[tag].label}
                </span>
              ))}
            </div>

            {/* Arrow */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>

            {/* My Pokemon */}
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Gebe
              </p>
              <div className="w-[72px] h-[72px] relative">
                {trade.myPokemon.spriteUrl ? (
                  <Image
                    src={trade.myPokemon.spriteUrl}
                    alt={trade.myPokemon.displayName}
                    fill
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    ?
                  </div>
                )}
              </div>
              <p
                className="text-sm font-bold text-center leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {trade.myPokemon.displayName}
              </p>
              {trade.myPokemon.variant &&
                trade.myPokemon.variant !== "normal" && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: VARIANT_CONFIG[trade.myPokemon.variant].bg,
                      color: VARIANT_CONFIG[trade.myPokemon.variant].color,
                    }}
                  >
                    {VARIANT_CONFIG[trade.myPokemon.variant].label}
                  </span>
                )}
              {(trade.myPokemon.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: TAG_CONFIG[tag].bg,
                    color: TAG_CONFIG[tag].color,
                  }}
                >
                  {TAG_CONFIG[tag].label}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-4 pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: status.dot }}
              />
              {status.label}
            </span>
            {trade.notes && (
              <span
                className="text-xs truncate max-w-[130px]"
                style={{ color: "var(--text-muted)" }}
                title={trade.notes}
              >
                {trade.notes}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { trades, addTrade, loaded } = useTrades();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Trade["status"] | "all">(
    "all",
  );

  const filtered =
    filterStatus === "all"
      ? trades
      : trades.filter((t) => t.status === filterStatus);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header
        className="px-4 py-4 sticky top-0 z-40"
        style={{
          background: "rgba(15, 17, 23, 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/132.svg"
              alt="Ditto"
              style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }}
            />
            <div>
              <h1
                className="font-bold text-base leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Trade Tracker
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Pokémon GO
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
            style={{
              background: "var(--accent)",
              color: "#fff",
              boxShadow: "0 2px 12px var(--accent-glow)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)")
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Neuer Trade
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Stats */}
        {loaded && trades.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["planned", "completed", "cancelled"] as Trade["status"][]).map(
              (s) => {
                const count = trades.filter((t) => t.status === s).length;
                const cfg = STATUS_CONFIG[s];
                const active = filterStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(active ? "all" : s)}
                    className="rounded-xl p-3.5 text-center transition-all duration-150"
                    style={{
                      background: active ? cfg.bg : "var(--bg-surface)",
                      border: `1px solid ${active ? cfg.color + "55" : "var(--border)"}`,
                      outline: "none",
                    }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color: active ? cfg.color : "var(--text-primary)",
                      }}
                    >
                      {count}
                    </p>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{
                        color: active ? cfg.color : "var(--text-secondary)",
                      }}
                    >
                      {cfg.label}
                    </p>
                  </button>
                );
              },
            )}
          </div>
        )}

        {/* List */}
        {!loaded ? (
          <div className="flex justify-center py-24">
            <div
              className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: "var(--border)",
                borderTopColor: "var(--accent)",
              }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 text-4xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              ⚡
            </div>
            <h2
              className="font-bold text-xl mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {trades.length === 0 ? "Noch keine Trades" : "Keine Ergebnisse"}
            </h2>
            <p
              className="text-sm max-w-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {trades.length === 0
                ? "Füge deinen ersten Trade hinzu, um loszulegen."
                : "Versuche einen anderen Filter."}
            </p>
            {trades.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Ersten Trade hinzufügen
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddTradeModal onClose={() => setShowModal(false)} onAdd={addTrade} />
      )}
    </div>
  );
}

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTrades } from "@/hooks/useTrades";
import { Trade, PokemonInfo, PokemonVariant, PokemonTag } from "@/types/trade";

const VARIANT_CONFIG: Record<PokemonVariant, { label: string; color: string; bg: string; border: string }> = {
  normal: { label: "Normal",   color: "var(--text-secondary)", bg: "var(--bg-elevated)",    border: "var(--border)" },
  shiny:  { label: "✨ Shiny", color: "#fbbf24",               bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)" },
};

const TAG_CONFIG: Record<PokemonTag, { label: string; color: string; bg: string; border: string }> = {
  lucky:   { label: "⭐ Lucky",    color: "#fcd34d", bg: "rgba(252,211,77,0.15)",  border: "rgba(252,211,77,0.4)" },
  costume: { label: "🎭 Costume", color: "#f9a8d4", bg: "rgba(249,168,212,0.15)", border: "rgba(249,168,212,0.4)" },
  dynamax:    { label: "◆ Dynamax",    color: "#c084fc", bg: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.4)" },
  gigantamax: { label: "◈ Gigantamax", color: "#e879f9", bg: "rgba(232,121,249,0.2)",  border: "rgba(232,121,249,0.6)" },
};

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const STATUS_CONFIG = {
  planned: {
    label: "Geplant",
    color: "var(--blue)",
    bg: "var(--blue-bg)",
    border: "rgba(96,165,250,0.3)",
  },
  completed: {
    label: "Abgeschlossen",
    color: "var(--green)",
    bg: "var(--green-bg)",
    border: "rgba(52,211,153,0.3)",
  },
  cancelled: {
    label: "Abgebrochen",
    color: "var(--red)",
    bg: "var(--red-bg)",
    border: "rgba(248,113,113,0.3)",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PokemonCard({ pokemon, label }: { pokemon: PokemonInfo; label: string }) {
  const mainType = pokemon.types[0] || "normal";
  const typeColor = TYPE_COLORS[mainType] || "#888";

  return (
    <div
      className="flex-1 rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${typeColor}18 0%, var(--bg-elevated) 60%)`,
        border: `1px solid ${typeColor}33`,
      }}
    >
      <div className="px-4 pt-4 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: typeColor }}>
          {label}
        </p>

        <div className="flex justify-center my-1">
          {pokemon.spriteUrl ? (
            <Image
              src={pokemon.spriteUrl}
              alt={pokemon.displayName}
              width={110}
              height={110}
              className="object-contain"
              style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: "var(--bg-surface)" }}
            >
              ?
            </div>
          )}
        </div>

        <h3 className="text-center font-bold text-base mt-2" style={{ color: "var(--text-primary)" }}>
          {pokemon.displayName}
        </h3>
        <p className="text-center text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
          #{String(pokemon.id).padStart(4, "0")}
        </p>
        {pokemon.variant && pokemon.variant !== "normal" && (
          <div className="flex justify-center mt-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{ background: VARIANT_CONFIG[pokemon.variant].bg, color: VARIANT_CONFIG[pokemon.variant].color, border: `1px solid ${VARIANT_CONFIG[pokemon.variant].border}` }}>
              {VARIANT_CONFIG[pokemon.variant].label}
            </span>
          </div>
        )}

        {/* Tags */}
        {(pokemon.tags ?? []).length > 0 && (
          <div className="flex justify-center gap-1.5 mt-1.5 flex-wrap">
            {(pokemon.tags ?? []).map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{ background: TAG_CONFIG[tag].bg, color: TAG_CONFIG[tag].color, border: `1px solid ${TAG_CONFIG[tag].border}` }}>
                {TAG_CONFIG[tag].label}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-1.5 mt-2.5">
          {pokemon.types.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-0.5 rounded-full font-bold text-white"
              style={{ backgroundColor: TYPE_COLORS[t] || "#888" }}
            >
              {t.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getTradeById, deleteTrade, updateTrade, loaded } = useTrades();

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
        />
      </div>
    );
  }

  const trade = getTradeById(id);

  if (!trade) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--bg-base)" }}
      >
        <span className="text-5xl font-black" style={{ color: "var(--text-muted)" }}>404</span>
        <p className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Trade nicht gefunden</p>
        <Link
          href="/"
          className="px-5 py-2 rounded-xl font-bold text-sm"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[trade.status];

  function handleDelete() {
    if (confirm("Diesen Trade wirklich löschen?")) {
      deleteTrade(trade!.id);
      router.push("/");
    }
  }

  function handleStatusChange(newStatus: Trade["status"]) {
    updateTrade(trade!.id, { status: newStatus });
  }

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
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="font-bold text-base leading-tight" style={{ color: "var(--text-primary)" }}>
              Trade Details
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Pokémon GO</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Trainer Card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
                style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
              >
                {trade.ingameName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Trainer
                </p>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {trade.ingameName}
                </h2>
                {trade.redditName && (
                  <a
                    href={`https://reddit.com/user/${trade.redditName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-0.5 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#ff4500")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)")}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm5.93 9.418a1.33 1.33 0 0 1 .57 1.082c0 1.55-1.804 2.8-4.026 2.8-2.223 0-4.027-1.25-4.027-2.8 0-.41.167-.8.458-1.126a.83.83 0 0 1-.338-.666.84.84 0 0 1 .84-.84c.22 0 .42.085.57.224A5.46 5.46 0 0 1 12.474 8a.3.3 0 0 1 .01-.074l1.264-1.97a.6.6 0 0 1 .83-.183.6.6 0 0 1 .183.83l-1.153 1.795a1.328 1.328 0 0 1 2.322 1.02zm-8.6.832a.84.84 0 1 0 1.68 0 .84.84 0 0 0-1.68 0zm4.79.84a.84.84 0 1 0 0-1.68.84.84 0 0 0 0 1.68zm-.88 1.47c-.362.36-.95.36-1.31 0l-.207-.206a.24.24 0 0 0-.34.34l.207.206a1.32 1.32 0 0 0 1.99 0l.207-.206a.24.24 0 1 0-.34-.34l-.207.206z"/>
                    </svg>
                    u/{trade.redditName}
                  </a>
                )}
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {formatDate(trade.date)}
                </p>
              </div>
            </div>
            <span
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
              style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
            >
              {status.label}
            </span>
          </div>

          {trade.notes && (
            <div
              className="mt-4 rounded-xl px-4 py-3"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                Notizen
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {trade.notes}
              </p>
            </div>
          )}
        </div>

        {/* Pokemon Cards */}
        <div className="flex gap-3 items-stretch">
          <PokemonCard pokemon={trade.theirPokemon} label="Ich erhalte" />

          <div className="flex flex-col items-center justify-center px-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>

          <PokemonCard pokemon={trade.myPokemon} label="Ich gebe" />
        </div>

        {/* Status Change */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Status ändern
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(["planned", "completed", "cancelled"] as Trade["status"][]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = trade.status === s;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                  style={
                    active
                      ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }
                      : { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                  }
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-all"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid rgba(248,113,113,0.2)",
            color: "var(--red)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--red-bg)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)")}
        >
          Trade löschen
        </button>
      </main>
    </div>
  );
}

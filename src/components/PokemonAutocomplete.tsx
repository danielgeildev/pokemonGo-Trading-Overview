"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { PokemonInfo, PokemonVariant, PokemonTag, PokemonForm } from "@/types/trade";

interface PokemonSuggestion {
  name: string;
  url: string;
}

interface RawPokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    front_female: string | null;
    front_shiny_female: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  types: { type: { name: string } }[];
  species: { url: string };
}

interface Props {
  label: string;
  value: PokemonInfo | null;
  onChange: (pokemon: PokemonInfo | null) => void;
}

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
  grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC",
};

const VARIANT_CONFIG: Record<PokemonVariant, { label: string; color: string; bg: string; border: string }> = {
  normal:        { label: "Normal",       color: "var(--text-secondary)", bg: "var(--bg-elevated)",       border: "var(--border)" },
  shiny:         { label: "✨ Shiny",      color: "#fbbf24",               bg: "rgba(251,191,36,0.15)",    border: "rgba(251,191,36,0.4)" },
  female:        { label: "♀ Female",     color: "#e879f9",               bg: "rgba(232,121,249,0.15)",   border: "rgba(232,121,249,0.4)" },
  "shiny-female":{ label: "✨♀ Shiny F.", color: "#f0abfc",               bg: "rgba(240,171,252,0.15)",   border: "rgba(240,171,252,0.4)" },
};

const TAG_CONFIG: Record<PokemonTag, { label: string; color: string; bg: string; border: string }> = {
  lucky:    { label: "⭐ Lucky",     color: "#fcd34d", bg: "rgba(252,211,77,0.15)",  border: "rgba(252,211,77,0.4)" },
  shadow:   { label: "🌑 Shadow",   color: "#a78bfa", bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.4)" },
  purified: { label: "✦ Purified",  color: "#67e8f9", bg: "rgba(103,232,249,0.15)", border: "rgba(103,232,249,0.4)" },
  costume:  { label: "🎭 Costume",  color: "#f9a8d4", bg: "rgba(249,168,212,0.15)", border: "rgba(249,168,212,0.4)" },
};

/** Convert raw API name to readable display name */
function toDisplayName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/ Gmax$/, " Gigantamax")
    .replace(/ Mega X$/, " Mega X")
    .replace(/ Mega Y$/, " Mega Y")
    .replace(/ Mega$/, " Mega");
}

function getSpriteUrl(data: RawPokemonData, variant: PokemonVariant): string {
  switch (variant) {
    case "shiny":
      return data.sprites?.other?.["official-artwork"]?.front_shiny
        || data.sprites?.front_shiny
        || data.sprites?.other?.["official-artwork"]?.front_default
        || data.sprites?.front_default || "";
    case "female":
      return data.sprites?.front_female
        || data.sprites?.other?.["official-artwork"]?.front_default
        || data.sprites?.front_default || "";
    case "shiny-female":
      return data.sprites?.front_shiny_female
        || data.sprites?.front_shiny
        || data.sprites?.other?.["official-artwork"]?.front_shiny || "";
    default:
      return data.sprites?.other?.["official-artwork"]?.front_default
        || data.sprites?.front_default || "";
  }
}

/** Fetch all alternate forms for a species (Mega, Gmax, regional, etc.) */
async function fetchForms(speciesUrl: string, baseName: string): Promise<PokemonForm[]> {
  try {
    const res = await fetch(speciesUrl);
    const species = await res.json();
    // Filter to forms that are different from the base
    const varieties: { is_default: boolean; pokemon: { name: string; url: string } }[] =
      species.varieties || [];
    const alts = varieties.filter((v) => !v.is_default);
    const forms: PokemonForm[] = [];
    for (const alt of alts) {
      try {
        const pr = await fetch(alt.pokemon.url);
        const pd = await pr.json();
        forms.push({
          name: pd.name,
          displayName: toDisplayName(pd.name),
          spriteUrl:
            pd.sprites?.other?.["official-artwork"]?.front_default ||
            pd.sprites?.front_default || "",
          shinyUrl:
            pd.sprites?.other?.["official-artwork"]?.front_shiny ||
            pd.sprites?.front_shiny || "",
        });
      } catch { /* skip broken forms */ }
    }
    return forms;
  } catch {
    return [];
  }
}

function buildInfo(
  data: RawPokemonData,
  variant: PokemonVariant,
  tags: PokemonTag[],
  forms: PokemonForm[],
): PokemonInfo {
  return {
    id: data.id,
    name: data.name,
    displayName: toDisplayName(data.name),
    spriteUrl: getSpriteUrl(data, variant),
    types: data.types.map((t) => t.type.name),
    variant,
    hasFemaleDiff: !!data.sprites?.front_female,
    tags,
    forms,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PillButton({
  active,
  color, bg, border,
  onClick,
  children,
}: {
  active: boolean;
  color: string; bg: string; border: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
      style={
        active
          ? { background: bg, color, border: `1px solid ${border}` }
          : { background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
      }
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PokemonAutocomplete({ label, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [allPokemon, setAllPokemon] = useState<PokemonSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingForms, setLoadingForms] = useState(false);
  const [open, setOpen] = useState(false);
  const [rawData, setRawData] = useState<RawPokemonData | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1302")
      .then((r) => r.json())
      .then((data) => setAllPokemon(data.results))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback((q: string) => {
    if (!q.trim()) { setSuggestions([]); setOpen(false); return; }
    const lower = q.toLowerCase();
    const filtered = allPokemon.filter((p) => p.name.includes(lower)).slice(0, 8);
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }, [allPokemon]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (value) { onChange(null); setRawData(null); }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 200);
  }

  async function selectPokemon(suggestion: PokemonSuggestion) {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch(suggestion.url);
      const data: RawPokemonData = await res.json();
      setRawData(data);
      // Fetch alternate forms in background
      setLoadingForms(true);
      const info = buildInfo(data, "normal", [], []);
      onChange(info);
      setQuery(info.displayName);
      const forms = await fetchForms(data.species.url, data.name);
      onChange(buildInfo(data, "normal", [], forms));
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setLoadingForms(false);
    }
  }

  function handleVariantChange(variant: PokemonVariant) {
    if (!rawData || !value) return;
    onChange(buildInfo(rawData, variant, value.tags, value.forms ?? []));
  }

  function handleTagToggle(tag: PokemonTag) {
    if (!rawData || !value) return;
    let tags: PokemonTag[];
    if (value.tags.includes(tag)) {
      // Deselect
      tags = value.tags.filter((t) => t !== tag);
    } else {
      // Shadow and purified are mutually exclusive
      if (tag === "shadow") {
        tags = [...value.tags.filter((t) => t !== "purified"), tag];
      } else if (tag === "purified") {
        tags = [...value.tags.filter((t) => t !== "shadow"), tag];
      } else {
        tags = [...value.tags, tag];
      }
    }
    onChange(buildInfo(rawData, value.variant, tags, value.forms ?? []));
  }

  /** Switch to an alternate form (Mega, Gmax, etc.) by fetching its data */
  async function switchToForm(form: PokemonForm) {
    if (!value) return;
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${form.name}`);
      const data: RawPokemonData = await res.json();
      setRawData(data);
      const isShiny = value.variant === "shiny" || value.variant === "shiny-female";
      const newVariant: PokemonVariant = isShiny ? "shiny" : "normal";
      const forms = value.forms ?? [];
      onChange(buildInfo(data, newVariant, value.tags, forms));
      setQuery(toDisplayName(form.name));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const availableVariants: PokemonVariant[] = rawData
    ? ["normal", "shiny", ...(rawData.sprites?.front_female ? (["female", "shiny-female"] as PokemonVariant[]) : [])]
    : [];

  const ALL_TAGS: PokemonTag[] = ["lucky", "shadow", "purified", "costume"];

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>

      {/* ── Selected Preview ── */}
      {value && (
        <div className="mb-2 p-3 rounded-xl space-y-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
          {/* Pokemon header */}
          <div className="flex items-center gap-3">
            {value.spriteUrl && (
              <div className="relative flex-shrink-0" style={{ width: 56, height: 56 }}>
                <Image src={value.spriteUrl} alt={value.displayName} fill className="object-contain"
                  style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                {value.displayName}
              </p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {value.types.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                    style={{ backgroundColor: TYPE_COLORS[t] || "#888" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Variant ── */}
          {availableVariants.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
              <p className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Variante</p>
              <div className="flex gap-1.5 flex-wrap">
                {availableVariants.map((v) => {
                  const cfg = VARIANT_CONFIG[v];
                  return (
                    <PillButton key={v} active={value.variant === v}
                      color={cfg.color} bg={cfg.bg} border={cfg.border}
                      onClick={() => handleVariantChange(v)}>
                      {cfg.label}
                    </PillButton>
                  );
                })}
              </div>
              {(value.variant === "female" || value.variant === "shiny-female") && (
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  Kein Official Artwork für female — Game-Sprite wird verwendet.
                </p>
              )}
            </div>
          )}

          {/* ── Alternate Forms (Mega, Gigantamax, Regional, etc.) ── */}
          {loadingForms ? (
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
              <p className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Formen</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-t-transparent animate-spin"
                  style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Lade Formen…</span>
              </div>
            </div>
          ) : (value.forms ?? []).length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
              <p className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Weitere Formen</p>
              <div className="flex gap-2 flex-wrap">
                {/* Base form button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (!value.forms) return;
                    setLoading(true);
                    try {
                      // find base name — strip known suffixes
                      const baseName = rawData?.name || value.name;
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseName}`);
                      const data: RawPokemonData = await res.json();
                      setRawData(data);
                      onChange(buildInfo(data, value.variant === "shiny" ? "shiny" : "normal", value.tags, value.forms ?? []));
                      setQuery(toDisplayName(data.name));
                    } catch { /* */ } finally { setLoading(false); }
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold"
                  style={{
                    background: !(value.forms ?? []).some(f => f.name === value.name)
                      ? "var(--accent-glow)" : "var(--bg-elevated)",
                    border: `1px solid ${!(value.forms ?? []).some(f => f.name === value.name)
                      ? "var(--accent)" : "var(--border)"}`,
                    color: !(value.forms ?? []).some(f => f.name === value.name)
                      ? "var(--accent)" : "var(--text-secondary)",
                    minWidth: 64,
                  }}
                >
                  <div className="relative w-10 h-10">
                    {(value.forms ?? [])[0] && (
                      <Image
                        src={(value.variant === "shiny"
                          ? (value.forms ?? [])[0].shinyUrl || (value.forms ?? [])[0].spriteUrl
                          : (value.forms ?? [])[0].spriteUrl) || ""}
                        alt="base"
                        fill
                        className="object-contain opacity-40"
                      />
                    )}
                  </div>
                  Base
                </button>

                {(value.forms ?? []).map((form) => {
                  const isActive = value.name === form.name;
                  const imgSrc = value.variant === "shiny" ? form.shinyUrl || form.spriteUrl : form.spriteUrl;
                  return (
                    <button
                      key={form.name}
                      type="button"
                      onClick={() => switchToForm(form)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold"
                      style={{
                        background: isActive ? "var(--accent-glow)" : "var(--bg-elevated)",
                        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                        color: isActive ? "var(--accent)" : "var(--text-secondary)",
                        minWidth: 64,
                      }}
                    >
                      {imgSrc ? (
                        <div className="relative w-10 h-10">
                          <Image src={imgSrc} alt={form.displayName} fill className="object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{ background: "var(--bg-surface)" }}>?</div>
                      )}
                      <span className="text-center leading-tight" style={{ maxWidth: 72 }}>
                        {form.displayName.replace(value.displayName.split(" ")[0] + " ", "")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Tags (Lucky, Shadow, etc.) ── */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
            <p className="text-xs mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Eigenschaften</p>
            <div className="flex gap-1.5 flex-wrap">
              {ALL_TAGS.map((tag) => {
                const cfg = TAG_CONFIG[tag];
                const active = value.tags.includes(tag);
                return (
                  <PillButton key={tag} active={active}
                    color={cfg.color} bg={cfg.bg} border={cfg.border}
                    onClick={() => handleTagToggle(tag)}>
                    {cfg.label}
                  </PillButton>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Search Input ── */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Pokemon suchen…"
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        {(loading) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
          </div>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
          {suggestions.map((s) => {
            const id = s.url.split("/").filter(Boolean).pop();
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            return (
              <li key={s.name} onMouseDown={() => selectPokemon(s)}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLLIElement).style.background = "var(--bg-surface)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLLIElement).style.background = "transparent")}>
                <Image src={spriteUrl} alt={s.name} width={32} height={32} className="object-contain" />
                <span className="capitalize text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {s.name}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

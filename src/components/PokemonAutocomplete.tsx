"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { PokemonInfo } from "@/types/trade";

interface PokemonSuggestion {
  name: string;
  url: string;
}

interface Props {
  label: string;
  value: PokemonInfo | null;
  onChange: (pokemon: PokemonInfo | null) => void;
}

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

export default function PokemonAutocomplete({ label, value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PokemonSuggestion[]>([]);
  const [allPokemon, setAllPokemon] = useState<PokemonSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) { setSuggestions([]); setOpen(false); return; }
      const lower = q.toLowerCase();
      const filtered = allPokemon.filter((p) => p.name.includes(lower)).slice(0, 8);
      setSuggestions(filtered);
      setOpen(filtered.length > 0);
    },
    [allPokemon]
  );

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (value) onChange(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 200);
  }

  async function selectPokemon(suggestion: PokemonSuggestion) {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch(suggestion.url);
      const data = await res.json();
      const info: PokemonInfo = {
        id: data.id,
        name: data.name,
        displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        spriteUrl:
          data.sprites?.other?.["official-artwork"]?.front_default ||
          data.sprites?.front_default ||
          "",
        types: data.types.map((t: { type: { name: string } }) => t.type.name),
      };
      onChange(info);
      setQuery(info.displayName);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>

      {/* Selected Preview */}
      {value && (
        <div
          className="flex items-center gap-3 mb-2 p-3 rounded-xl"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
          }}
        >
          {value.spriteUrl && (
            <Image
              src={value.spriteUrl}
              alt={value.displayName}
              width={52}
              height={52}
              className="object-contain"
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
            />
          )}
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              {value.displayName}
            </p>
            <div className="flex gap-1 mt-1">
              {value.types.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                  style={{ backgroundColor: TYPE_COLORS[t] || "#888" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Pokemon suchen..."
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
            />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          {suggestions.map((s) => {
            const id = s.url.split("/").filter(Boolean).pop();
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            return (
              <li
                key={s.name}
                onMouseDown={() => selectPokemon(s)}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLLIElement).style.background = "var(--bg-surface)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLLIElement).style.background = "transparent")}
              >
                <Image
                  src={spriteUrl}
                  alt={s.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
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

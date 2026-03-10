"use client";

import { useState } from "react";
import { Trade, PokemonInfo } from "@/types/trade";
import PokemonAutocomplete from "./PokemonAutocomplete";

interface Props {
  onClose: () => void;
  onAdd: (trade: Trade) => void;
}

const inputClass = `
  w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all
`;
const inputStyle = {
  background: "var(--bg-input)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
};

export default function AddTradeModal({ onClose, onAdd }: Props) {
  const [ingameName, setIngameName] = useState("");
  const [redditName, setRedditName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [theirPokemon, setTheirPokemon] = useState<PokemonInfo | null>(null);
  const [myPokemon, setMyPokemon] = useState<PokemonInfo | null>(null);
  const [status, setStatus] = useState<Trade["status"]>("planned");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ingameName.trim()) {
      setError("Bitte gib den Ingame-Namen an.");
      return;
    }
    if (!theirPokemon) {
      setError("Bitte wähle das Pokemon des Traders aus.");
      return;
    }
    if (!myPokemon) {
      setError("Bitte wähle dein Pokemon aus.");
      return;
    }
    const trade: Trade = {
      id: crypto.randomUUID(),
      ingameName: ingameName.trim(),
      redditName: redditName.trim() || undefined,
      date: new Date(date).toISOString(),
      notes: notes.trim() || undefined,
      theirPokemon,
      myPokemon,
      status,
    };
    onAdd(trade);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto sm:rounded-2xl rounded-t-2xl"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl"
          style={{
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
            Neuer Trade
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--text-muted)", background: "var(--bg-elevated)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div
              className="text-sm rounded-xl px-4 py-3"
              style={{ background: "var(--red-bg)", color: "var(--red)", border: "1px solid rgba(248,113,113,0.3)" }}
            >
              {error}
            </div>
          )}

          {/* Ingame Name + Reddit Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                Ingame Name
              </label>
              <input
                type="text"
                value={ingameName}
                onChange={(e) => setIngameName(e.target.value)}
                placeholder="AshKetchum99"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
                Reddit Name <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold select-none"
                  style={{ color: "var(--text-muted)" }}
                >
                  u/
                </span>
                <input
                  type="text"
                  value={redditName}
                  onChange={(e) => setRedditName(e.target.value)}
                  placeholder="username"
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: "2rem" }}
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Trade["status"])}
              className={inputClass}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="planned">Geplant</option>
              <option value="completed">Abgeschlossen</option>
              <option value="cancelled">Abgebrochen</option>
            </select>
          </div>

          {/* Pokemon Section */}
          <div className="space-y-3">
            {/* Ich erhalte */}
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--blue)" }}>
                Ich erhalte
              </p>
              <PokemonAutocomplete
                label="Pokemon des Traders"
                value={theirPokemon}
                onChange={setTheirPokemon}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            {/* Ich gebe */}
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--yellow)" }}>
                Ich gebe
              </p>
              <PokemonAutocomplete
                label="Mein Pokemon"
                value={myPokemon}
                onChange={setMyPokemon}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>
              Notizen <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Shiny, Lucky Trade, ..."
              rows={2}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: "var(--accent)",
                color: "#fff",
                boxShadow: "0 4px 16px var(--accent-glow)",
              }}
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

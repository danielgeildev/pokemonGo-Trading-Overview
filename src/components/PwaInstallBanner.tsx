"use client";

import { useEffect, useState } from "react";


const DISMISSED_KEY = "pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Don't show if already dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Don't show if already installed (running as standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.then(() => {
      setVisible(false);
      setPrompt(null);
    });
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 flex items-center gap-3"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/132.svg" alt="Ditto" style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0 }} />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
          App installieren
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Zum Homescreen hinzufügen für schnellen Zugriff
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--text-muted)", background: "var(--bg-elevated)" }}
          aria-label="Schließen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: "var(--accent)", color: "#fff", boxShadow: "0 2px 8px var(--accent-glow)" }}
        >
          Installieren
        </button>
      </div>
    </div>
  );
}

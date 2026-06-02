"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const sections = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Global Reach", id: "global-reach" },
  { label: "Opportunities", id: "opportunities" },
  { label: "Contact", id: "contact" },
  { label: "Network", id: "network" },
  { label: "Insights", id: "insights" },
];

const priorities = [
  "Global connectivity",
  "Discrete coordination",
  "Cross-border adaptability",
];

type ThemeKey = "midnight" | "harbor" | "mist" | "ember";
type ThemeMode = "dark" | "light";

const themes: Record<
  ThemeKey,
  {
    name: string;
    variants: Record<
      ThemeMode,
      {
        name: string;
        colors: {
          bg: string;
          bg2: string;
          surface: string;
          border: string;
          text: string;
          muted: string;
          accent: string;
          accent2: string;
          buttonText: string;
        };
      }
    >;
  }
> = {
  midnight: {
    name: "Midnight",
    variants: {
      dark: {
        name: "Dark",
        colors: {
          bg: "#02002F",
          bg2: "#11131A",
          surface: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.10)",
          text: "#F4F0E8",
          muted: "rgba(244,240,232,0.68)",
          accent: "#798DB8",
          accent2: "#2632A0",
          buttonText: "#02002F",
        },
      },
      light: {
        name: "Light",
        colors: {
          bg: "#F4F0E8",
          bg2: "#D8DCE5",
          surface: "rgba(255,255,255,0.60)",
          border: "rgba(2,0,47,0.10)",
          text: "#02002F",
          muted: "rgba(2,0,47,0.68)",
          accent: "#2632A0",
          accent2: "#798DB8",
          buttonText: "#F4F0E8",
        },
      },
    },
  },
  harbor: {
    name: "Harbor Light",
    variants: {
      dark: {
        name: "Dark",
        colors: {
          bg: "#517891",
          bg2: "#384959",
          surface: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.16)",
          text: "#BDDDFC",
          muted: "rgba(189,221,252,0.74)",
          accent: "#90D5FF",
          accent2: "#88BDF2",
          buttonText: "#10324A",
        },
      },
      light: {
        name: "Light",
        colors: {
          bg: "#90D5FF",
          bg2: "#77B1D4",
          surface: "rgba(255,255,255,0.55)",
          border: "rgba(81,120,145,0.18)",
          text: "#10324A",
          muted: "rgba(16,50,74,0.72)",
          accent: "#517891",
          accent2: "#6A89A7",
          buttonText: "#FFFFFF",
        },
      },
    },
  },
  mist: {
    name: "Blue Mist",
    variants: {
      dark: {
        name: "Dark",
        colors: {
          bg: "#384959",
          bg2: "#203244",
          surface: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.14)",
          text: "#BDDDFC",
          muted: "rgba(189,221,252,0.72)",
          accent: "#88BDF2",
          accent2: "#6A89A7",
          buttonText: "#203244",
        },
      },
      light: {
        name: "Light",
        colors: {
          bg: "#BDDDFC",
          bg2: "#88BDF2",
          surface: "rgba(255,255,255,0.60)",
          border: "rgba(56,73,89,0.18)",
          text: "#203244",
          muted: "rgba(32,50,68,0.70)",
          accent: "#384959",
          accent2: "#6A89A7",
          buttonText: "#FFFFFF",
        },
      },
    },
  },
  ember: {
    name: "Ember Mark",
    variants: {
      dark: {
        name: "Dark",
        colors: {
          bg: "#262729",
          bg2: "#131314",
          surface: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.12)",
          text: "#F4EFEA",
          muted: "rgba(244,239,234,0.70)",
          accent: "#B91E39",
          accent2: "#7A1B2A",
          buttonText: "#F4EFEA",
        },
      },
      light: {
        name: "Light",
        colors: {
          bg: "#F4EFEA",
          bg2: "#E6DEDA",
          surface: "rgba(255,255,255,0.72)",
          border: "rgba(38,39,41,0.12)",
          text: "#262729",
          muted: "rgba(38,39,41,0.70)",
          accent: "#B91E39",
          accent2: "#262729",
          buttonText: "#F4EFEA",
        },
      },
    },
  },
};

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>("midnight");
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("utsite-theme");
    if (
      stored === "midnight-dark" ||
      stored === "midnight-light" ||
      stored === "harbor-dark" ||
      stored === "harbor-light" ||
      stored === "mist-dark" ||
      stored === "mist-light" ||
      stored === "ember-dark" ||
      stored === "ember-light"
    ) {
      const [storedTheme, storedMode] = stored.split("-") as [ThemeKey, ThemeMode];
      setTheme(storedTheme);
      setMode(storedMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("utsite-theme", `${theme}-${mode}`);
  }, [theme, mode]);

  const activeTheme = themes[theme].variants[mode];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiry", {
      method: "POST",
      body: formData,
    });

    setStatus(response.ok ? "sent" : "error");
    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <main
      className="min-h-screen bg-transparent transition-colors duration-500"
      style={
        {
          background:
            `radial-gradient(circle at top, color-mix(in srgb, ${activeTheme.colors.accent} 18%, transparent), transparent 36%),` +
            `radial-gradient(circle at 20% 20%, color-mix(in srgb, ${activeTheme.colors.accent2} 14%, transparent), transparent 28%),` +
            `linear-gradient(180deg, ${activeTheme.colors.bg} 0%, ${activeTheme.colors.bg2} 55%, ${activeTheme.colors.bg2} 100%)`,
          color: activeTheme.colors.text,
          ["--ut-surface" as string]: activeTheme.colors.surface,
          ["--ut-border" as string]: activeTheme.colors.border,
          ["--ut-text" as string]: activeTheme.colors.text,
          ["--ut-muted" as string]: activeTheme.colors.muted,
          ["--ut-accent" as string]: activeTheme.colors.accent,
          ["--ut-accent-2" as string]: activeTheme.colors.accent2,
          ["--ut-button-text" as string]: activeTheme.colors.buttonText,
        } as CSSProperties
      }
    >
      <header className="sticky top-0 z-20 border-b border-[var(--ut-border)] bg-[color-mix(in_srgb,var(--ut-accent)_12%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)]">
              <img
                alt="Unique Trades logo"
                className="h-full w-full object-contain p-1"
                src="/ut-logo.svg"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ut-accent)]">
                Unique Trades
              </p>
              <p className="text-sm text-[var(--ut-muted)]">Beyond conventional trade</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden gap-5 text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)] md:flex">
              {sections.map((item) => (
                <a key={item.id} className="transition hover:text-[var(--ut-text)]" href={`#${item.id}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="fixed bottom-4 left-4 right-4 z-30 md:bottom-auto md:left-auto md:right-4 md:top-1/2 md:-translate-y-1/2">
        {themeMenuOpen ? (
          <div
            className="mb-3 w-full rounded-3xl border p-4 shadow-soft backdrop-blur-xl md:mb-3 md:w-72"
            style={{
              borderColor: "var(--ut-border)",
              background: "var(--ut-surface)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ut-accent)]">
                Theme
              </p>
              <button
                type="button"
                onClick={() => setThemeMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)] transition hover:text-[var(--ut-text)]"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(Object.entries(themes) as Array<[ThemeKey, (typeof themes)[ThemeKey]]>).map(
                ([key, item]) => (
                  <div
                    key={key}
                    className="rounded-2xl border p-2"
                    style={{
                      borderColor: "var(--ut-border)",
                      background: "color-mix(in srgb, var(--ut-accent) 5%, transparent)",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between px-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-[var(--ut-text)]">
                        {item.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(["dark", "light"] as ThemeMode[]).map((variant) => {
                        const isActive = theme === key && mode === variant;
                        return (
                          <button
                            key={variant}
                            type="button"
                            onClick={() => {
                              setTheme(key);
                              setMode(variant);
                            }}
                            className={`rounded-xl border px-3 py-2 text-left text-xs uppercase tracking-[0.18em] transition ${
                              isActive
                                ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                                : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
                            }`}
                          >
                            {variant}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
        <button
          className="ml-auto flex items-center gap-2 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--ut-text)] shadow-soft transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)] md:ml-auto"
          type="button"
          onClick={() => setThemeMenuOpen((value) => !value)}
        >
          <span className="h-2 w-2 rounded-full bg-[var(--ut-accent)]" />
          Themes
        </button>
      </div>

      <section
        id="home"
        className="relative mx-auto grid min-h-[88vh] max-w-6xl items-center overflow-hidden px-6 py-20"
      >
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--ut-accent)_14%,transparent)] blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--ut-accent-2)_14%,transparent)] blur-3xl" />
          <div className="absolute left-0 top-10 h-px w-full bg-gradient-to-r from-transparent via-[var(--ut-border)] to-transparent" />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">
              Global, capable, discreet
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-[var(--ut-text)] md:text-7xl">
              Unique Trades
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <img
                alt="Unique Trades logo"
                className="h-10 w-10 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] p-1"
                src="/ut-logo.svg"
              />
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--ut-muted)]">
                Quiet capability
              </p>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ut-muted)] md:text-xl">
              Beyond Conventional Trade.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--ut-muted)] md:text-lg">
              In a rapidly changing global marketplace, businesses often require more than
              standard solutions. Unique Trades works closely with clients and international
              partners to explore opportunities, identify possibilities, and support unique
              requirements across industries and regions worldwide.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                className="rounded-full px-6 py-3 text-sm font-medium text-[var(--ut-button-text)] transition hover:opacity-90"
                href="#contact"
                style={{ backgroundColor: "var(--ut-accent)" }}
              >
                Start an inquiry
              </a>
              <a
                className="rounded-full border px-6 py-3 text-sm font-medium text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_8%,transparent)]"
                href="#opportunities"
                style={{ borderColor: "var(--ut-border)" }}
              >
                Explore opportunities
              </a>
            </div>
          </div>

          <aside
            className="rounded-[2rem] border p-6 shadow-soft backdrop-blur-md"
            style={{
              borderColor: "var(--ut-border)",
              background: "var(--ut-surface)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">
              Positioning
            </p>
            <div className="mt-5 space-y-4">
              <p className="text-xl leading-8 text-[var(--ut-text)]">
                Quiet capability for unusual international requirements.
              </p>
              <p className="text-sm leading-7 text-[var(--ut-muted)]">
                A refined business presence for thoughtful opportunities, selective inquiries, and
                global relationship-building.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">About</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Unique Trades is built around relationships, global connectivity, adaptability, and the
          ability to explore opportunities beyond conventional boundaries.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ut-muted)]">
          We intentionally keep the site selective and understated, so the right visitors feel
          confidence without being overloaded with detail.
        </p>
      </section>

      <section id="global-reach" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Global Reach</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          We work through an international network of partners, associates, and industry contacts
          to support unique requirements across different markets and sectors.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {priorities.map((item) => (
            <div
              key={item}
              className="rounded-2xl border p-5"
              style={{
                borderColor: "var(--ut-border)",
                background: "var(--ut-surface)",
              }}
            >
              <p className="text-sm text-[var(--ut-text)]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="opportunities" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Opportunities</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Bring us your challenge, your sourcing need, trade requirement, logistics issue, market
          access requirement, or unique opportunity and we will explore solutions globally.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ut-muted)]">
          Not every opportunity fits inside conventional boundaries.
        </p>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Contact</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Quiet, professional inquiries are welcome. We are best suited to thoughtful, long-term,
          relationship-driven conversations.
        </p>
        <form
          className="mt-8 max-w-2xl rounded-3xl border p-6 shadow-soft"
          onSubmit={handleSubmit}
          style={{
            borderColor: "var(--ut-border)",
            background: "var(--ut-surface)",
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              className="rounded-2xl border px-4 py-3 text-sm outline-none placeholder:opacity-50"
              style={{
                borderColor: "var(--ut-border)",
                background: "color-mix(in srgb, var(--ut-accent) 8%, transparent)",
                color: "var(--ut-text)",
              }}
              placeholder="Name"
              required
            />
            <input
              name="email"
              type="email"
              className="rounded-2xl border px-4 py-3 text-sm outline-none placeholder:opacity-50"
              style={{
                borderColor: "var(--ut-border)",
                background: "color-mix(in srgb, var(--ut-accent) 8%, transparent)",
                color: "var(--ut-text)",
              }}
              placeholder="Email"
              required
            />
            <input
              name="subject"
              className="rounded-2xl border px-4 py-3 text-sm outline-none placeholder:opacity-50 md:col-span-2"
              style={{
                borderColor: "var(--ut-border)",
                background: "color-mix(in srgb, var(--ut-accent) 8%, transparent)",
                color: "var(--ut-text)",
              }}
              placeholder="Subject"
            />
            <textarea
              name="message"
              className="min-h-32 rounded-2xl border px-4 py-3 text-sm outline-none placeholder:opacity-50 md:col-span-2"
              style={{
                borderColor: "var(--ut-border)",
                background: "color-mix(in srgb, var(--ut-accent) 8%, transparent)",
                color: "var(--ut-text)",
              }}
              placeholder="Tell us about the opportunity, need, or challenge."
              required
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              className="rounded-full px-6 py-3 text-sm font-medium text-[var(--ut-button-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={status === "sending"}
              style={{ backgroundColor: "var(--ut-accent)" }}
            >
              {status === "sending" ? "Sending..." : "Send inquiry"}
            </button>
            <p className="text-sm text-[var(--ut-muted)]">
              {status === "sent"
                ? "Inquiry received. We will refine the provider later."
                : status === "error"
                  ? "Please complete the required fields and try again."
                  : "Direct, discreet initial contact is preferred."}
            </p>
          </div>
        </form>
      </section>

      <section id="network" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Network</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Reserved for future expansion.
        </p>
      </section>

      <section id="insights" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Insights</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Reserved for future expansion.
        </p>
      </section>
    </main>
  );
}

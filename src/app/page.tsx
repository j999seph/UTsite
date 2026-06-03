"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import AnnotationTool from "@/components/AnnotationTool";
import EditableBlock, { type LayoutBox } from "@/components/EditableBlock";

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
type LayoutTarget =
  | "headerBrand"
  | "navHome"
  | "navAbout"
  | "navGlobal"
  | "navOpportunities"
  | "navContact"
  | "navNetwork"
  | "navInsights"
  | "hero"
  | "heroBadge"
  | "heroLogo"
  | "heroTitleText"
  | "heroTagline"
  | "heroCopy"
  | "heroCtas"
  | "card"
  | "about"
  | "globalReach"
  | "opportunities"
  | "contact"
  | "network"
  | "insights";

type LayoutState = Record<
  LayoutTarget,
  LayoutBox
>;

type LayoutPresetMap = Record<string, LayoutState>;

const defaultLayout: LayoutState = {
  headerBrand: { x: 0, y: 0, width: 320, height: 64 },
  navHome: { x: 0, y: 0, width: 60, height: 28 },
  navAbout: { x: 0, y: 0, width: 60, height: 28 },
  navGlobal: { x: 0, y: 0, width: 120, height: 28 },
  navOpportunities: { x: 0, y: 0, width: 140, height: 28 },
  navContact: { x: 0, y: 0, width: 80, height: 28 },
  navNetwork: { x: 0, y: 0, width: 100, height: 28 },
  navInsights: { x: 0, y: 0, width: 100, height: 28 },
  hero: { x: 0, y: 0, width: 720, height: 380 },
  heroBadge: { x: 0, y: 0, width: 300, height: 24 },
  heroLogo: { x: 0, y: 0, width: 120, height: 100 },
  heroTitleText: { x: 0, y: 0, width: 720, height: 92 },
  heroTagline: { x: 0, y: 0, width: 420, height: 44 },
  heroCopy: { x: 0, y: 0, width: 720, height: 180 },
  heroCtas: { x: 0, y: 0, width: 420, height: 64 },
  card: { x: 0, y: 0, width: 480, height: 208 },
  about: { x: 0, y: 0, width: 720, height: 140 },
  globalReach: { x: 0, y: 0, width: 720, height: 220 },
  opportunities: { x: 0, y: 0, width: 720, height: 140 },
  contact: { x: 0, y: 0, width: 720, height: 480 },
  network: { x: 0, y: 0, width: 720, height: 120 },
  insights: { x: 0, y: 0, width: 720, height: 120 },
};

const defaultLayoutPresets: LayoutPresetMap = {
  Default: defaultLayout,
};

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
  const [devToolsEnabled, setDevToolsEnabled] = useState(false);
  const [layoutEditEnabled, setLayoutEditEnabled] = useState(false);
  const [layout, setLayout] = useState<LayoutState>(defaultLayout);
  const [layoutBaseline, setLayoutBaseline] = useState<LayoutState>(defaultLayout);
  const [layoutUndoStack, setLayoutUndoStack] = useState<LayoutState[]>([]);
  const [layoutPresets, setLayoutPresets] = useState<LayoutPresetMap>(defaultLayoutPresets);
  const [layoutSelected, setLayoutSelected] = useState<LayoutTarget | "">("heroTitleText");
  const [layoutHighlightColor, setLayoutHighlightColor] = useState("#00E5FF");
  const [layoutHighlightOpacity, setLayoutHighlightOpacity] = useState(0.5);
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

  useEffect(() => {
    const storedPresetRaw = window.localStorage.getItem("utsite-layout-presets");
    if (storedPresetRaw) {
      try {
        const parsed = JSON.parse(storedPresetRaw) as Partial<LayoutPresetMap>;
        const nextPresets = {
          ...defaultLayoutPresets,
          ...Object.fromEntries(
            Object.entries(parsed).filter(([, value]) => value && typeof value === "object"),
          ),
          Default: defaultLayout,
        } as LayoutPresetMap;
        setLayoutPresets(nextPresets);
        window.localStorage.setItem("utsite-layout-presets", JSON.stringify(nextPresets));
      } catch {
        window.localStorage.setItem("utsite-layout-presets", JSON.stringify(defaultLayoutPresets));
      }
    } else {
      window.localStorage.setItem("utsite-layout-presets", JSON.stringify(defaultLayoutPresets));
    }

    const storedPresets = window.localStorage.getItem("utsite-layout-presets");
    if (storedPresets) return;
    const stored = window.localStorage.getItem("utsite-layout");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Partial<LayoutState>;
      const merged = {
        ...defaultLayout,
        ...parsed,
      };
      setLayout(merged);
      setLayoutBaseline(merged);
    } catch {
      // Ignore malformed local layout state.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("utsite-layout-presets", JSON.stringify(layoutPresets));
  }, [layoutPresets]);

  useEffect(() => {
    window.localStorage.setItem("utsite-layout", JSON.stringify(layout));
  }, [layout]);

  useEffect(() => {
    function onLayoutMode(event: Event) {
      const next = (event as CustomEvent<boolean>).detail;
      setLayoutEditEnabled(Boolean(next));
    }

    function onLayoutSelect(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (
        next === "hero" ||
        next === "card" ||
        next === "headerBrand" ||
        next === "navHome" ||
        next === "navAbout" ||
        next === "navGlobal" ||
        next === "navOpportunities" ||
        next === "navContact" ||
        next === "navNetwork" ||
        next === "navInsights" ||
        next === "hero" ||
        next === "heroBadge" ||
        next === "heroLogo" ||
        next === "heroTitleText" ||
        next === "heroTagline" ||
        next === "heroCopy" ||
        next === "heroCtas" ||
        next === "about" ||
        next === "globalReach" ||
        next === "opportunities" ||
        next === "contact" ||
        next === "network" ||
        next === "insights"
      ) {
        setLayoutSelected(next);
      }
    }

    function onLayoutDeselect() {
      setLayoutSelected("");
    }

    function onLayoutReset() {
      const base = layoutPresets.Default ?? defaultLayout;
      setLayout(base);
      setLayoutBaseline(base);
      window.localStorage.setItem("utsite-layout", JSON.stringify(base));
      setLayoutSelected("heroTitleText");
    }

    function onLayoutRevert() {
      setLayout(layoutBaseline);
      setLayoutSelected("heroTitleText");
    }

    function onLayoutHighlight(event: Event) {
      const detail = (event as CustomEvent<{ color?: string; opacity?: number }>).detail;
      if (detail.color) setLayoutHighlightColor(detail.color);
      if (typeof detail.opacity === "number") setLayoutHighlightOpacity(detail.opacity);
    }

    function onLayoutStart() {
      setLayoutUndoStack((current) => [...current, layout]);
    }

    function onLayoutUndo() {
      setLayoutUndoStack((current) => {
        if (current.length === 0) return current;
        const next = current[current.length - 1];
        setLayout(next);
        setLayoutBaseline(next);
        return current.slice(0, -1);
      });
    }

    function onLayoutSavePreset(event: Event) {
      const detail = (event as CustomEvent<{ name?: string }>).detail;
      const name = detail.name?.trim();
      if (!name) return;
      setLayoutPresets((current) => ({
        ...current,
        [name]: layout,
      }));
      setLayoutBaseline(layout);
      window.dispatchEvent(new CustomEvent("utsite-layout-presets-updated"));
    }

    function onLayoutLoadPreset(event: Event) {
      const detail = (event as CustomEvent<{ name?: string }>).detail;
      const name = detail.name?.trim();
      if (!name) return;
      const preset = layoutPresets[name];
      if (!preset) return;
      setLayout(preset);
      setLayoutBaseline(preset);
      window.localStorage.setItem("utsite-layout", JSON.stringify(preset));
      setLayoutSelected("heroTitleText");
      window.dispatchEvent(new CustomEvent("utsite-layout-presets-updated"));
    }

    window.addEventListener("utsite-layout-mode", onLayoutMode as EventListener);
    window.addEventListener("utsite-layout-select", onLayoutSelect as EventListener);
    window.addEventListener("utsite-layout-deselect", onLayoutDeselect);
    window.addEventListener("utsite-layout-reset", onLayoutReset);
    window.addEventListener("utsite-layout-revert", onLayoutRevert);
    window.addEventListener("utsite-layout-highlight", onLayoutHighlight as EventListener);
    window.addEventListener("utsite-layout-start", onLayoutStart as EventListener);
    window.addEventListener("utsite-layout-undo", onLayoutUndo);
    window.addEventListener("utsite-layout-save-preset", onLayoutSavePreset as EventListener);
    window.addEventListener("utsite-layout-load-preset", onLayoutLoadPreset as EventListener);
    return () => {
      window.removeEventListener("utsite-layout-mode", onLayoutMode as EventListener);
      window.removeEventListener("utsite-layout-select", onLayoutSelect as EventListener);
      window.removeEventListener("utsite-layout-deselect", onLayoutDeselect);
      window.removeEventListener("utsite-layout-reset", onLayoutReset);
      window.removeEventListener("utsite-layout-revert", onLayoutRevert);
      window.removeEventListener("utsite-layout-highlight", onLayoutHighlight as EventListener);
      window.removeEventListener("utsite-layout-start", onLayoutStart as EventListener);
      window.removeEventListener("utsite-layout-undo", onLayoutUndo);
      window.removeEventListener("utsite-layout-save-preset", onLayoutSavePreset as EventListener);
      window.removeEventListener("utsite-layout-load-preset", onLayoutLoadPreset as EventListener);
    };
  }, [layout, layoutPresets]);

  const activeTheme = themes[theme].variants[mode];
  const logoFilter = mode === "dark" ? "brightness(0) invert(1)" : "none";

  function updateLayout(id: string, next: LayoutBox) {
    setLayout((current) => ({
      ...current,
      [id as LayoutTarget]: next,
    }));
  }

  function selectLayoutTarget(id: string) {
    if (id === "hero" || id === "card" || id === "headerBrand") {
      setLayoutSelected(id);
      window.dispatchEvent(new CustomEvent("utsite-layout-select", { detail: id }));
      return;
    }
    if (
      id === "navHome" ||
      id === "navAbout" ||
      id === "navGlobal" ||
      id === "navOpportunities" ||
      id === "navContact" ||
      id === "navNetwork" ||
      id === "navInsights" ||
      id === "heroBadge" ||
      id === "heroLogo" ||
      id === "heroTitleText" ||
      id === "heroTagline" ||
      id === "heroCopy" ||
      id === "heroCtas" ||
      id === "about" ||
      id === "globalReach" ||
      id === "opportunities" ||
      id === "contact" ||
      id === "network" ||
      id === "insights"
    ) {
      const next = id as LayoutTarget;
      setLayoutSelected(next);
      window.dispatchEvent(new CustomEvent("utsite-layout-select", { detail: next }));
    }
  }

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
      {process.env.NODE_ENV !== "production" ? (
        <>
          <button
            type="button"
            onClick={() => {
              setDevToolsEnabled((value) => {
                const next = !value;
                if (!next) {
                  setLayoutEditEnabled(false);
                  window.dispatchEvent(new CustomEvent("utsite-layout-mode", { detail: false }));
                }
                return next;
              });
              setThemeMenuOpen(false);
            }}
            className="fixed right-4 bottom-4 z-[70] rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--ut-text)] shadow-soft backdrop-blur-xl transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
          >
            {devToolsEnabled ? "Hide Dev" : "Show Dev"}
          </button>
          {devToolsEnabled ? (
            <>
              <AnnotationTool />
              <div className="fixed right-4 bottom-20 z-[60]">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setThemeMenuOpen((value) => !value)}
                    className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--ut-text)] shadow-soft backdrop-blur-xl transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
                  >
                    Themes
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}

      <header className="sticky top-0 z-20 border-b border-[var(--ut-border)] bg-[color-mix(in_srgb,var(--ut-accent)_12%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <EditableBlock
            id="headerBrand"
            enabled={layoutEditEnabled}
            selected={layoutSelected === "headerBrand"}
            highlightColor={layoutHighlightColor}
            highlightOpacity={layoutHighlightOpacity}
            box={layout.headerBrand}
            baseBox={defaultLayout.headerBrand}
            onChange={updateLayout}
            onSelect={selectLayoutTarget}
            className="flex items-center gap-3"
          >
            <img
              alt="Unique Trades logo"
              className="h-12 w-auto shrink-0"
              src="/ut-logo.svg"
              style={{ filter: logoFilter }}
            />
            <p className="text-base uppercase tracking-[0.3em] text-[var(--ut-accent)]">
              Unique Trades
            </p>
          </EditableBlock>
          <div className="flex items-center gap-4">
            <nav className="hidden flex-1 items-center justify-end gap-4 text-[10px] uppercase tracking-[0.14em] text-[var(--ut-muted)] lg:flex xl:gap-5">
              {sections.map((item) => {
                const navTarget =
                  item.id === "about"
                    ? "navAbout"
                    : item.id === "global-reach"
                      ? "navGlobal"
                      : item.id === "opportunities"
                        ? "navOpportunities"
                        : item.id === "contact"
                          ? "navContact"
                          : item.id === "network"
                            ? "navNetwork"
                            : item.id === "insights"
                              ? "navInsights"
                              : "navHome";

                return (
                  <EditableBlock
                    key={item.id}
                    id={navTarget}
                    enabled={layoutEditEnabled}
                    selected={layoutSelected === navTarget}
                    highlightColor={layoutHighlightColor}
                    highlightOpacity={layoutHighlightOpacity}
                    box={layout[navTarget]}
                    baseBox={defaultLayout[navTarget]}
                    onChange={updateLayout}
                    onSelect={selectLayoutTarget}
                    className="inline-flex items-center"
                    style={{ minHeight: 28 }}
                  >
                    <a
                      className="inline-flex items-center whitespace-nowrap rounded-full px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] leading-none transition hover:text-[var(--ut-text)]"
                      href={`#${item.id}`}
                    >
                      {item.label}
                    </a>
                  </EditableBlock>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {process.env.NODE_ENV !== "production" && devToolsEnabled ? (
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
        </div>
      ) : null}

      <section
        id="home"
        className="relative mx-auto grid min-h-[88vh] max-w-6xl items-center px-6 py-16"
      >
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--ut-accent)_14%,transparent)] blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[color-mix(in_srgb,var(--ut-accent-2)_14%,transparent)] blur-3xl" />
          <div className="absolute left-0 top-10 h-px w-full bg-gradient-to-r from-transparent via-[var(--ut-border)] to-transparent" />
        </div>
        <div className="grid gap-16 lg:grid-cols-[1fr_0.78fr] lg:items-start lg:gap-28">
          <EditableBlock
            id="hero"
            enabled={false}
            selected={false}
            highlightColor={layoutHighlightColor}
            highlightOpacity={layoutHighlightOpacity}
            box={layout.hero}
            onChange={updateLayout}
            onSelect={() => {}}
            className="max-w-[49rem]"
          >
            <EditableBlock
              id="heroBadge"
              enabled={layoutEditEnabled}
              selected={layoutSelected === "heroBadge"}
              highlightColor={layoutHighlightColor}
              highlightOpacity={layoutHighlightOpacity}
              box={layout.heroBadge}
              baseBox={defaultLayout.heroBadge}
              onChange={updateLayout}
              onSelect={selectLayoutTarget}
              className="inline-block"
            >
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">
                Global, capable, discreet
              </p>
            </EditableBlock>
            <div className="flex flex-nowrap items-center gap-6">
              <EditableBlock
                id="heroLogo"
                enabled={layoutEditEnabled}
                selected={layoutSelected === "heroLogo"}
                highlightColor={layoutHighlightColor}
                highlightOpacity={layoutHighlightOpacity}
                box={layout.heroLogo}
                baseBox={defaultLayout.heroLogo}
                onChange={updateLayout}
                onSelect={selectLayoutTarget}
                className="shrink-0"
              >
                <img
                  alt="Unique Trades logo"
                  className="h-full w-full shrink-0 object-contain"
                  src="/ut-logo.svg"
                  style={{ filter: logoFilter }}
                />
              </EditableBlock>
              <EditableBlock
                id="heroTitleText"
                enabled={layoutEditEnabled}
                selected={layoutSelected === "heroTitleText"}
                highlightColor={layoutHighlightColor}
                highlightOpacity={layoutHighlightOpacity}
                box={layout.heroTitleText}
                baseBox={defaultLayout.heroTitleText}
                onChange={updateLayout}
                onSelect={selectLayoutTarget}
                className="shrink-0"
              >
                <h1 className="whitespace-nowrap text-5xl font-semibold tracking-tight text-[var(--ut-text)] md:text-[4.6rem] lg:text-[4.95rem]">
                  Unique Trades
                </h1>
              </EditableBlock>
            </div>
            <EditableBlock
              id="heroTagline"
              enabled={layoutEditEnabled}
              selected={layoutSelected === "heroTagline"}
              highlightColor={layoutHighlightColor}
              highlightOpacity={layoutHighlightOpacity}
              box={layout.heroTagline}
              baseBox={defaultLayout.heroTagline}
              onChange={updateLayout}
              onSelect={selectLayoutTarget}
              className="mt-4 max-w-2xl"
            >
              <p className="text-[1.35rem] font-semibold italic leading-8 text-[var(--ut-muted)] md:text-[1.5rem]">
                Beyond Conventional Trade.
              </p>
            </EditableBlock>
            <EditableBlock
              id="heroCopy"
              enabled={layoutEditEnabled}
              selected={layoutSelected === "heroCopy"}
              highlightColor={layoutHighlightColor}
              highlightOpacity={layoutHighlightOpacity}
              box={layout.heroCopy}
              baseBox={defaultLayout.heroCopy}
              onChange={updateLayout}
              onSelect={selectLayoutTarget}
              className="mt-3 max-w-2xl"
            >
              <p className="text-base leading-8 text-[var(--ut-muted)] md:text-lg">
                In a rapidly changing global marketplace, businesses often require more than
                standard solutions. Unique Trades works closely with clients and international
                partners to explore opportunities, identify possibilities, and support unique
                requirements across industries and regions worldwide.
              </p>
            </EditableBlock>
            <EditableBlock
              id="heroCtas"
              enabled={layoutEditEnabled}
              selected={layoutSelected === "heroCtas"}
              highlightColor={layoutHighlightColor}
              highlightOpacity={layoutHighlightOpacity}
              box={layout.heroCtas}
              baseBox={defaultLayout.heroCtas}
              onChange={updateLayout}
              onSelect={selectLayoutTarget}
              className="mt-7 flex flex-wrap gap-4"
            >
              <a
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-[var(--ut-button-text)] transition hover:opacity-90"
                href="#contact"
                style={{ backgroundColor: "var(--ut-accent)" }}
              >
                Start an inquiry
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_8%,transparent)]"
                href="#opportunities"
                style={{ borderColor: "var(--ut-border)" }}
              >
                Explore opportunities
              </a>
            </EditableBlock>
          </EditableBlock>

          <EditableBlock
            id="card"
            enabled={layoutEditEnabled}
            selected={layoutSelected === "card"}
            highlightColor={layoutHighlightColor}
            highlightOpacity={layoutHighlightOpacity}
            box={layout.card}
            baseBox={defaultLayout.card}
            onChange={updateLayout}
            onSelect={selectLayoutTarget}
            className="rounded-[2.75rem] border p-6 shadow-soft backdrop-blur-md lg:mt-12 lg:justify-self-end lg:translate-x-4 xl:translate-x-10"
            style={{
              borderColor: "var(--ut-border)",
              background: "var(--ut-surface)",
            }}
          >
            <div className="space-y-3">
              <p className="text-lg font-medium leading-7 text-[var(--ut-text)] md:text-xl md:leading-8">
                Quiet capability for unusual international requirements.
              </p>
              <p className="text-sm leading-7 text-[var(--ut-muted)] md:text-[0.95rem]">
                A refined business presence for thoughtful opportunities, selective inquiries, and
                global relationship-building.
              </p>
            </div>
          </EditableBlock>
        </div>
      </section>

      <EditableBlock
        id="about"
        enabled={layoutEditEnabled}
        selected={layoutSelected === "about"}
        highlightColor={layoutHighlightColor}
        highlightOpacity={layoutHighlightOpacity}
        box={layout.about}
        baseBox={defaultLayout.about}
        onChange={updateLayout}
        onSelect={selectLayoutTarget}
        className="mx-auto max-w-6xl px-6 py-12"
      >
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">About</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Unique Trades is built around relationships, global connectivity, adaptability, and the
          ability to explore opportunities beyond conventional boundaries.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ut-muted)]">
          We intentionally keep the site selective and understated, so the right visitors feel
          confidence without being overloaded with detail.
        </p>
      </EditableBlock>

      <EditableBlock
        id="globalReach"
        enabled={layoutEditEnabled}
        selected={layoutSelected === "globalReach"}
        highlightColor={layoutHighlightColor}
        highlightOpacity={layoutHighlightOpacity}
        box={layout.globalReach}
        baseBox={defaultLayout.globalReach}
        onChange={updateLayout}
        onSelect={selectLayoutTarget}
        className="mx-auto max-w-6xl px-6 py-12"
      >
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
      </EditableBlock>

      <EditableBlock
        id="opportunities"
        enabled={layoutEditEnabled}
        selected={layoutSelected === "opportunities"}
        highlightColor={layoutHighlightColor}
        highlightOpacity={layoutHighlightOpacity}
        box={layout.opportunities}
        baseBox={defaultLayout.opportunities}
        onChange={updateLayout}
        onSelect={selectLayoutTarget}
        className="mx-auto max-w-6xl px-6 py-12"
      >
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Opportunities</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Bring us your challenge, your sourcing need, trade requirement, logistics issue, market
          access requirement, or unique opportunity and we will explore solutions globally.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ut-muted)]">
          Not every opportunity fits inside conventional boundaries.
        </p>
      </EditableBlock>

      <EditableBlock
        id="contact"
        enabled={layoutEditEnabled}
        selected={layoutSelected === "contact"}
        highlightColor={layoutHighlightColor}
        highlightOpacity={layoutHighlightOpacity}
        box={layout.contact}
        baseBox={defaultLayout.contact}
        onChange={updateLayout}
        onSelect={selectLayoutTarget}
        className="mx-auto max-w-6xl px-6 py-12"
      >
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
      </EditableBlock>

      <EditableBlock
        id="network"
        enabled={layoutEditEnabled}
        selected={layoutSelected === "network"}
        highlightColor={layoutHighlightColor}
        highlightOpacity={layoutHighlightOpacity}
        box={layout.network}
        baseBox={defaultLayout.network}
        onChange={updateLayout}
        onSelect={selectLayoutTarget}
        className="mx-auto max-w-6xl px-6 py-12"
      >
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Network</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Reserved for future expansion.
        </p>
      </EditableBlock>

      <EditableBlock
        id="insights"
        enabled={layoutEditEnabled}
        selected={layoutSelected === "insights"}
        highlightColor={layoutHighlightColor}
        highlightOpacity={layoutHighlightOpacity}
        box={layout.insights}
        baseBox={defaultLayout.insights}
        onChange={updateLayout}
        onSelect={selectLayoutTarget}
        className="mx-auto max-w-6xl px-6 py-12"
      >
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--ut-accent)]">Insights</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--ut-muted)]">
          Reserved for future expansion.
        </p>
      </EditableBlock>
    </main>
  );
}

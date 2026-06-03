"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Annotation = {
  id: string;
  kind: "box" | "pen";
  x: number;
  y: number;
  width: number;
  height: number;
  points?: Array<{ x: number; y: number }>;
  color: string;
};

type Tool = "box" | "pen";
type Panel = "controls" | "layout";
type LayerGroupKey = "brand" | "hero" | "content" | "sections";

type LayerMeta = {
  id: string;
  label: string;
  group: LayerGroupKey;
};

const initialLayoutTargets: LayerMeta[] = [
  { id: "headerBrand", label: "Header brand", group: "brand" },
  { id: "navHome", label: "Nav: Home", group: "brand" },
  { id: "navAbout", label: "Nav: About", group: "brand" },
  { id: "navGlobal", label: "Nav: Global Reach", group: "brand" },
  { id: "navOpportunities", label: "Nav: Opportunities", group: "brand" },
  { id: "navContact", label: "Nav: Contact", group: "brand" },
  { id: "heroBadge", label: "Hero badge", group: "hero" },
  { id: "heroLogo", label: "Hero logo", group: "hero" },
  { id: "heroTitleText", label: "Hero title", group: "hero" },
  { id: "heroTagline", label: "Hero tagline", group: "hero" },
  { id: "heroCopy", label: "Hero copy", group: "hero" },
  { id: "heroCtas", label: "Hero CTAs", group: "hero" },
  { id: "card", label: "Position card", group: "content" },
  { id: "about", label: "About section", group: "sections" },
  { id: "globalReach", label: "Global reach", group: "sections" },
  { id: "opportunities", label: "Opportunities", group: "sections" },
  { id: "contact", label: "Contact section", group: "sections" },
  { id: "network", label: "Network section", group: "sections" },
  { id: "insights", label: "Insights section", group: "sections" },
];

const groupDefaults: Record<LayerGroupKey, string> = {
  brand: "#00E5FF",
  hero: "#FF3D81",
  content: "#FFD84D",
  sections: "#7CFF6B",
};

const colorPresets = ["#00E5FF", "#FF3D81", "#7CFF6B", "#FFD84D", "#B45CFF", "#FF8A00"];
const tools: Tool[] = ["box", "pen"];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AnnotationTool() {
  const [enabled, setEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("controls");
  const [layoutEnabled, setLayoutEnabled] = useState(false);
  const [layoutSelected, setLayoutSelected] = useState<string>("hero");
  const [highlightColor, setHighlightColor] = useState("#00E5FF");
  const [highlightOpacity, setHighlightOpacity] = useState(0.5);
  const [trayDetached, setTrayDetached] = useState(false);
  const [trayPosition, setTrayPosition] = useState({ x: 16, y: 16 });
  const [trayDragging, setTrayDragging] = useState(false);
  const [trayDragOrigin, setTrayDragOrigin] = useState<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [layerOrder, setLayerOrder] = useState(initialLayoutTargets);
  const [layerGroups, setLayerGroups] = useState<Record<string, LayerGroupKey>>(
    Object.fromEntries(initialLayoutTargets.map((item) => [item.id, item.group])) as Record<
      string,
      LayerGroupKey
    >,
  );
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(initialLayoutTargets.map((item) => [item.id, true])),
  );
  const [groupColors, setGroupColors] = useState<Record<LayerGroupKey, string>>(groupDefaults);
  const [draggingLayer, setDraggingLayer] = useState<string | null>(null);
  const [color, setColor] = useState(colorPresets[0]);
  const [tool, setTool] = useState<Tool>("box");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [draft, setDraft] = useState<Annotation | null>(null);
  const [presetName, setPresetName] = useState("Default");
  const [presetNames, setPresetNames] = useState<string[]>(["Default"]);

  const clearCanvas = useCallback(() => {
    setAnnotations([]);
    setDraft(null);
  }, []);

  const deselectLayout = useCallback(() => {
    setLayoutSelected("");
    window.dispatchEvent(new CustomEvent("utsite-layout-deselect"));
  }, []);

  const undoLayout = useCallback(() => {
    window.dispatchEvent(new CustomEvent("utsite-layout-undo"));
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayerVisibility((current) => {
      const next = { ...current, [id]: !current[id] };
      window.dispatchEvent(
        new CustomEvent("utsite-layout-visibility", {
          detail: { id, visible: next[id] },
        }),
      );
      return next;
    });
  }, []);

  const refreshPresetNames = useCallback(() => {
    try {
      const raw = window.localStorage.getItem("utsite-layout-presets");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const names = Object.keys(parsed).sort((a, b) => {
        if (a === "Default") return -1;
        if (b === "Default") return 1;
        return a.localeCompare(b);
      });
      setPresetNames(names.length ? names : ["Default"]);
    } catch {
      setPresetNames(["Default"]);
    }
  }, []);

  const refreshLayerGroups = useCallback(() => {
    try {
      const raw = window.localStorage.getItem("utsite-layout-groups");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, LayerGroupKey>;
      setLayerGroups((current) => ({ ...current, ...parsed }));
    } catch {
      setLayerGroups(
        Object.fromEntries(initialLayoutTargets.map((item) => [item.id, item.group])) as Record<
          string,
          LayerGroupKey
        >,
      );
    }
  }, []);

  const reorderLayer = useCallback((fromId: string, toId: string) => {
    setLayerOrder((current) => {
      const fromIndex = current.findIndex((item) => item.id === fromId);
      const toIndex = current.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const updateLayerGroup = useCallback((id: string, group: LayerGroupKey) => {
    setLayerGroups((current) => {
      const next = { ...current, [id]: group };
      window.localStorage.setItem("utsite-layout-groups", JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("utsite-layout-groups-updated"));
      return next;
    });
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
      if (!menuOpen) return;

      const key = event.key.toLowerCase();
      if (key === "e") setEnabled((value) => !value);
      if (key === "b") setTool("box");
      if (key === "p") setTool("pen");
      if (key === "c") clearCanvas();
      if (key === "u") undoLayout();
      if (key === "x") deselectLayout();
      if (key === "h") {
        setPanel((current) => (current === "controls" ? "layout" : "controls"));
      }
      if (key === "l") {
        setLayoutEnabled((value) => {
          const next = !value;
          window.dispatchEvent(new CustomEvent("utsite-layout-mode", { detail: next }));
          return next;
        });
        setPanel("layout");
      }
      if (key === "1") setLayoutSelected("headerBrand");
      if (key === "2") setLayoutSelected("heroTitleText");
      if (key === "3") setLayoutSelected("card");
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("utsite-layout-presets-updated", refreshPresetNames as EventListener);
    window.addEventListener("utsite-layout-groups-updated", refreshLayerGroups as EventListener);
    refreshPresetNames();
    refreshLayerGroups();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(
        "utsite-layout-presets-updated",
        refreshPresetNames as EventListener,
      );
      window.removeEventListener(
        "utsite-layout-groups-updated",
        refreshLayerGroups as EventListener,
      );
    };
  }, [clearCanvas, deselectLayout, menuOpen, refreshLayerGroups, refreshPresetNames, undoLayout]);

  const activeHint = useMemo(
    () => (enabled ? "Drawing enabled" : "Annotation off"),
    [enabled],
  );

  const hotkeys = [
    ["Esc", "Close panel"],
    ["E", "Toggle annotation"],
    ["B", "Box tool"],
    ["P", "Pen tool"],
    ["C", "Clear canvas"],
    ["U", "Undo"],
    ["H", "Switch panel"],
    ["L", "Layout mode"],
    ["1-3", "Select layer"],
    ["Reset", "Restore layout"],
    ["Revert", "Revert"],
  ] as const;

  const changelog = [
    {
      version: "v0.0.1",
      timestamp: "2026-06-02 09:01 CDT",
      title: "Initial UTsite scaffold",
      added: ["Basic one-page Next.js structure", "Core project folders", "Starting notes structure"],
      removed: ["N/A"],
    },
    {
      version: "v0.0.2",
      timestamp: "2026-06-02 10:11 CDT",
      title: "Project README",
      added: ["Short README", "Local run instructions", "Project intent summary"],
      removed: ["Nothing"],
    },
    {
      version: "v0.0.3",
      timestamp: "2026-06-02 13:27 CDT",
      title: "Theme switcher",
      added: ["Hidden theme menu", "Theme persistence", "Three palette choices"],
      removed: ["None"],
    },
    {
      version: "v0.0.4",
      timestamp: "2026-06-02 13:59 CDT",
      title: "Project protocol",
      added: ["Safety-check rule", "Planning/logging discipline"],
      removed: ["Repo-hosted OOO"],
    },
    {
      version: "v0.0.5",
      timestamp: "2026-06-02 14:34 CDT",
      title: "Logo theme and rail",
      added: ["Ember Mark theme", "Logo placement", "Side-rail theme toggle"],
      removed: ["Logo circle styling", "Old theme menu placement"],
    },
    {
      version: "v0.0.6",
      timestamp: "2026-06-02 15:35 CDT",
      title: "Local review tooling",
      added: [
        "Annotation tool overlay",
        "Box and pen drawing",
        "Neon annotation colors",
        "Hotkey cheat sheet",
        "Local simulated review workflow",
      ],
      removed: ["Arrow mode", "Manual marker-only workflow"],
    },
    {
      version: "v0.0.7",
      timestamp: "2026-06-03 11:13 CDT",
      title: "Layout editor refinement",
      added: [
        "Undo control",
        "Pop-out layer tray",
        "Scrollable layer list",
        "Layer visibility toggles",
        "Group color controls",
        "Layer drag reordering",
        "Corner resize hover affordance",
      ],
      removed: ["Always-visible resize handle", "Fixed tray-only layout list"],
    },
    {
      version: "v0.0.8",
      timestamp: "2026-06-03 11:16 CDT",
      title: "Undo wording fix",
      added: ["Single-step undo labeling", "Hotkey copy updated to match one-step behavior"],
      removed: ["Reset-style undo wording"],
    },
    {
      version: "v0.0.9",
      timestamp: "2026-06-03 11:25 CDT",
      title: "Layout handle cleanup",
      added: [
        "Standalone resize corner affordance",
        "Inert hero shell to prevent grouped dragging",
        "Scrollable dev menu",
        "Width-safe layer tray",
      ],
      removed: ["Grouped hero dragging", "Square resize handle container"],
    },
    {
      version: "v0.0.10",
      timestamp: "2026-06-03 11:31 CDT",
      title: "Layout reset placement",
      added: ["Top-of-panel layout reset control", "Quick restore access inside the editor"],
      removed: ["Reset buried lower in the tray"],
    },
    {
      version: "v0.0.11",
      timestamp: "2026-06-03 11:39 CDT",
      title: "Layout preset flow",
      added: ["Named layout presets", "Default preset baseline", "Independent hero logo/title movement"],
      removed: ["Soft-bound hero group behavior"],
    },
    {
      version: "v0.0.12",
      timestamp: "2026-06-03 11:45 CDT",
      title: "Manual layer grouping",
      added: ["Per-layer group selector", "Persisted group assignment", "Group label display in tray"],
      removed: ["Implicit-only layer grouping"],
    },
    {
      version: "v0.0.13",
      timestamp: "2026-06-03 12:07 CDT",
      title: "Default preset hardening",
      added: ["Self-healing default layout preset", "Overwrite of stale default storage on load"],
      removed: ["Stale default preset persistence"],
    },
    {
      version: "v0.0.14",
      timestamp: "2026-06-03 13:12 CDT",
      title: "Layout render recovery",
      added: ["Restored normal content flow", "Logo block now follows container sizing"],
      removed: ["Absolute scaling wrapper"],
    },
    {
      version: "v0.0.15",
      timestamp: "2026-06-03 13:48 CDT",
      title: "Selection cleanup",
      added: [
        "Selected layer state in tray",
        "Open and closed eye icons",
        "Deselect action",
        "Floating tray drag state",
      ],
      removed: ["Text-only visibility labels", "Tray fixed to one pop-out spot"],
    },
    {
      version: "v0.0.16",
      timestamp: "2026-06-03 14:11 CDT",
      title: "Log and resize cleanup",
      added: [
        "Newest changelog entries appear first",
        "Changelog tab moved to the left edge",
        "Selection state syncs from page clicks",
        "Visible resize scaling for editable content",
      ],
      removed: ["Chronological log ordering", "Menu-based changelog tab"],
    },
  ] as const;
  const changelogEntries = [...changelog].reverse();

  function startDraft(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setDraft({
      id: makeId(),
      kind: tool,
      x,
      y,
      width: 0,
      height: 0,
      points: tool === "pen" ? [{ x, y }] : undefined,
      color,
    });
  }

  function updateDraft(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !draft) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setDraft((current) =>
      current
        ? {
            ...current,
            width: x - current.x,
            height: y - current.y,
            points:
              current.kind === "pen"
                ? [...(current.points ?? []), { x, y }]
                : current.points,
          }
        : null,
    );
  }

  function finishDraft() {
    if (!draft) return;
    const normalized = {
      ...draft,
      x: draft.width < 0 ? draft.x + draft.width : draft.x,
      y: draft.height < 0 ? draft.y + draft.height : draft.y,
      width: Math.abs(draft.width),
      height: Math.abs(draft.height),
    };

    if (normalized.kind === "pen") {
      if ((normalized.points?.length ?? 0) > 1) {
        setAnnotations((current) => [...current, normalized]);
      }
    } else if (normalized.width > 6 && normalized.height > 6) {
      setAnnotations((current) => [...current, normalized]);
    }

    setDraft(null);
  }

  function renderPen(item: Annotation, isDraft = false) {
    const points = item.points ?? [];
    if (points.length < 2) return null;
    const path = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return (
      <svg
        key={item.id}
        className="absolute inset-0 overflow-visible"
        style={{ pointerEvents: "none" }}
      >
        <path
          d={path}
          fill="none"
          stroke={item.color}
          strokeWidth={isDraft ? "4" : "5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isDraft ? "10 6" : undefined}
        />
      </svg>
    );
  }

  const renderLayerTray = (detached: boolean) => (
    <div
      className={`space-y-3 rounded-2xl border border-[var(--ut-border)] bg-[color-mix(in_srgb,var(--ut-accent)_6%,transparent)] p-4 ${
        detached ? "max-h-[26rem] overflow-y-auto pr-1" : "overflow-y-auto pr-1"
      }`}
      style={{ width: "100%", maxWidth: "100%" }}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-accent)]">Unlock Elements</p>
      <p className="text-sm leading-6 text-[var(--ut-muted)]">
        This mode is local-only for the design phase. It unlocks major page blocks so they can be
        repositioned and resized directly on the page.
      </p>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("utsite-layout-reset"))}
        className="w-full rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
      >
        Reset layout
      </button>
      <button
        type="button"
        onClick={deselectLayout}
        className="w-full rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
      >
        Deselect
      </button>
      <button
        type="button"
        onClick={() =>
          setLayoutEnabled((value) => {
            const next = !value;
            window.dispatchEvent(new CustomEvent("utsite-layout-mode", { detail: next }));
            return next;
          })
        }
        className="w-full rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
      >
        {layoutEnabled ? "Disable unlock mode" : "Enable unlock mode"}
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("utsite-layout-undo"))}
          className="flex-1 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => setTrayDetached((value) => !value)}
          className="flex-1 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
        >
          {trayDetached ? "Dock tray" : "Pop out tray"}
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">Layout presets</p>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            value={presetName}
            onChange={(event) => setPresetName(event.target.value)}
            className="min-w-0 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ut-text)] outline-none"
            placeholder="Preset name"
          />
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("utsite-layout-save-preset", {
                  detail: { name: presetName.trim() || "Default" },
                }),
              )
            }
            className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
          >
            Save
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <select
            value={presetName}
            onChange={(event) => setPresetName(event.target.value)}
            className="min-w-0 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ut-text)] outline-none"
          >
            {presetNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("utsite-layout-load-preset", {
                  detail: { name: presetName.trim() || "Default" },
                }),
              )
            }
            className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] leading-tight text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
          >
            Load
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">Layer list</p>
        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(groupDefaults) as LayerGroupKey[]).map((group) => (
            <label key={group} className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--ut-muted)]">
                {group}
              </span>
              <input
                type="color"
                value={groupColors[group]}
                onChange={(event) =>
                  setGroupColors((current) => ({ ...current, [group]: event.target.value }))
                }
                className="mt-1 h-9 w-full rounded-2xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-1"
              />
            </label>
          ))}
        </div>
        <div className="grid w-full max-w-full gap-2">
          {layerOrder.map((item, index) => {
            const active = layoutSelected === item.id;
            const hidden = layerVisibility[item.id] === false;
            const currentGroup = layerGroups[item.id] ?? item.group;
            const groupColor = groupColors[currentGroup];
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={() => setDraggingLayer(item.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggingLayer) reorderLayer(draggingLayer, item.id);
                  setDraggingLayer(null);
                }}
                onClick={() => {
                  setLayoutSelected(item.id);
                  window.dispatchEvent(
                    new CustomEvent("utsite-layout-select", { detail: item.id }),
                  );
                }}
                className={`flex w-full min-w-0 items-center gap-2 rounded-2xl border px-3 py-3 text-left text-[10px] uppercase tracking-[0.12em] transition ${
                  active
                    ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                    : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
                }`}
                style={{ outlineColor: groupColor }}
              >
                <span
                  className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full border"
                  style={{ backgroundColor: groupColor, borderColor: groupColor }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate">{item.label}</p>
                  <p className="mt-0.5 text-[8px] uppercase tracking-[0.14em] opacity-70">
                    {currentGroup}
                  </p>
                  {active ? (
                    <p className="mt-1 text-[8px] uppercase tracking-[0.14em] opacity-90">
                      Selected
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-[9px] opacity-80">{index + 1}</span>
                <select
                  value={currentGroup}
                  onChange={(event) => {
                    event.stopPropagation();
                    updateLayerGroup(item.id, event.target.value as LayerGroupKey);
                  }}
                  className="shrink-0 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-2 py-1 text-[9px] uppercase tracking-[0.08em]"
                >
                  {(Object.keys(groupDefaults) as LayerGroupKey[]).map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleLayerVisibility(item.id);
                  }}
                  className="shrink-0 rounded-full border border-[var(--ut-border)] px-2 py-1 text-[9px] uppercase tracking-[0.1em]"
                  aria-label={hidden ? `Show ${item.label}` : `Hide ${item.label}`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {hidden ? (
                      <>
                        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
                        <path d="M4 4 20 20" />
                      </>
                    ) : (
                      <>
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("utsite-layout-reset"))}
          className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("utsite-layout-revert"))}
          className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
        >
          Revert layout
        </button>
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">
          Highlight color
        </span>
        <input
          type="color"
          value={highlightColor}
          onChange={(event) => {
            setHighlightColor(event.target.value);
            window.dispatchEvent(
              new CustomEvent("utsite-layout-highlight", {
                detail: { color: event.target.value, opacity: highlightOpacity },
              }),
            );
          }}
          className="mt-2 h-10 w-full rounded-2xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-1"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">
          Highlight opacity
        </span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={highlightOpacity}
          onChange={(event) => {
            const next = Number(event.target.value);
            setHighlightOpacity(next);
            window.dispatchEvent(
              new CustomEvent("utsite-layout-highlight", {
                detail: { color: highlightColor, opacity: next },
              }),
            );
          }}
          className="mt-2 w-full"
        />
      </label>
      <p className="text-xs leading-6 text-[var(--ut-muted)]">
        Pass 1 scope: hero group, header brand, hero text block, CTA row, and the right-side
        positioning card.
      </p>
    </div>
  );

  function beginTrayDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!trayDetached) return;
    event.preventDefault();
    setTrayDragging(true);
    setTrayDragOrigin({
      x: event.clientX,
      y: event.clientY,
      left: trayPosition.x,
      top: trayPosition.y,
    });
  }

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      if (!trayDragging || !trayDragOrigin) return;
      const dx = event.clientX - trayDragOrigin.x;
      const dy = event.clientY - trayDragOrigin.y;
      setTrayPosition({
        x: Math.max(8, trayDragOrigin.left + dx),
        y: Math.max(8, trayDragOrigin.top + dy),
      });
    }

    function onPointerUp() {
      setTrayDragging(false);
      setTrayDragOrigin(null);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [trayDragOrigin, trayDragging]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="fixed right-4 top-4 z-[70] flex items-center gap-2 rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--ut-text)] shadow-soft backdrop-blur-xl transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
      >
        <span className="flex h-4 w-4 flex-col justify-center gap-1">
          <span className="h-px w-full bg-[currentColor]" />
          <span className="h-px w-full bg-[currentColor]" />
          <span className="h-px w-full bg-[currentColor]" />
        </span>
        Dev
      </button>

      {menuOpen ? (
        <aside className="fixed right-4 top-16 z-[70] max-h-[calc(100vh-5rem)] w-80 overflow-y-auto rounded-3xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-4 shadow-soft backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ut-accent)]">
                Dev Tools
              </p>
              <p className="mt-1 text-sm text-[var(--ut-muted)]">{activeHint}</p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)] transition hover:text-[var(--ut-text)]"
            >
              Close
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setEnabled((value) => !value)}
              className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
            >
              {enabled ? "Disable" : "Enable"}
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
            >
              Clear canvas
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPanel("controls")}
              className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none transition ${
                panel === "controls"
                  ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                  : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setPanel("layout")}
              className={`rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] leading-none transition ${
                panel === "layout"
                  ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                  : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
              }`}
            >
              Layout
            </button>
          </div>

          {panel === "controls" ? (
            <>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">Tool</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {tools.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTool(item)}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                        tool === item
                          ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                          : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">Presets</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setColor(preset)}
                      className={`h-8 w-8 rounded-full border transition ${
                        color === preset
                          ? "scale-110 border-[var(--ut-text)]"
                          : "border-[var(--ut-border)]"
                      }`}
                      style={{ backgroundColor: preset }}
                      aria-label={`Set annotation color ${preset}`}
                    />
                  ))}
                </div>
              </div>

              <label className="mt-4 block">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">
                  Custom
                </span>
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="mt-2 h-10 w-full rounded-2xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-1"
                />
              </label>

              <p className="mt-4 text-xs leading-6 text-[var(--ut-muted)]">
                Hold and drag anywhere on the page to draw boxes or freehand marks. Use this as a
                temporary dev review tool only.
              </p>
            </>
          ) : (
            renderLayerTray(false)
          )}
        </aside>
      ) : null}

      <button
        type="button"
        onClick={() => setChangelogOpen((value) => !value)}
        className="fixed left-0 top-1/2 z-[69] -translate-y-1/2 rounded-r-2xl border border-l-0 border-[var(--ut-border)] bg-[var(--ut-surface)] px-3 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ut-text)] shadow-soft backdrop-blur-xl transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
      >
        Changelog
      </button>

      {changelogOpen ? (
        <aside className="fixed left-4 top-16 z-[68] max-h-[calc(100vh-5rem)] w-80 overflow-hidden rounded-3xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-4 shadow-soft backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--ut-accent)]">
                Dev Log
              </p>
              <p className="mt-1 text-sm text-[var(--ut-muted)]">Newest entries first</p>
            </div>
            <button
              type="button"
              onClick={() => setChangelogOpen(false)}
              className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)] transition hover:text-[var(--ut-text)]"
            >
              Close
            </button>
          </div>
          <div className="mt-4 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
            <div className="space-y-3">
              {changelogEntries.map((entry) => (
                <article
                  key={entry.version}
                  className="rounded-2xl border border-[var(--ut-border)] bg-[color-mix(in_srgb,var(--ut-accent)_5%,transparent)] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-accent)]">
                        {entry.version}
                      </p>
                      <p className="mt-1 text-sm text-[var(--ut-text)]">{entry.title}</p>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ut-muted)]">
                      {entry.timestamp}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs leading-6 text-[var(--ut-muted)]">
                    <p>
                      <span className="text-[var(--ut-text)]">Added:</span>{" "}
                      {entry.added.join(", ")}
                    </p>
                    <p>
                      <span className="text-[var(--ut-text)]">Removed:</span>{" "}
                      {entry.removed.join(", ")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      ) : null}

      {trayDetached ? (
        <div
          className="fixed z-[69] w-[22rem] max-w-[calc(100vw-1rem)] rounded-3xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-4 shadow-soft backdrop-blur-xl"
          style={{ left: trayPosition.x, top: trayPosition.y }}
        >
          <div
            className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--ut-border)] bg-[color-mix(in_srgb,var(--ut-accent)_6%,transparent)] px-3 py-2"
            onPointerDown={beginTrayDrag}
          >
            <p className="cursor-move text-xs uppercase tracking-[0.25em] text-[var(--ut-accent)]">
              Layer Tray
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTrayDetached(false)}
                className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)] transition hover:text-[var(--ut-text)]"
              >
                Dock
              </button>
              <button
                type="button"
                onClick={() => setTrayDetached(false)}
                className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)] transition hover:text-[var(--ut-text)]"
              >
                Hide
              </button>
            </div>
          </div>
          <div className="mt-4 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            {renderLayerTray(true)}
          </div>
        </div>
      ) : null}

      {enabled ? (
        <div className="fixed left-4 bottom-4 z-[65] max-w-[min(92vw,320px)] rounded-2xl border border-[var(--ut-border)] bg-[color-mix(in_srgb,var(--ut-accent)_8%,transparent)] p-3 shadow-soft backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ut-muted)]">Hotkeys</p>
          <div className="mt-3 space-y-2">
            {hotkeys.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4 text-xs">
                <span className="rounded-full border border-[var(--ut-border)] px-2 py-1 text-[var(--ut-text)]">
                  {key}
                </span>
                <span className="text-[var(--ut-muted)]">{label}</span>
              </div>
            ))}
            <p className="pt-2 text-[10px] uppercase tracking-[0.18em] text-[var(--ut-muted)]">
              Press H to switch between controls and changelog
            </p>
          </div>
        </div>
      ) : null}

      <div
        className={`fixed inset-0 z-[60] ${enabled ? "pointer-events-auto" : "pointer-events-none"}`}
        onPointerDown={startDraft}
        onPointerMove={updateDraft}
        onPointerUp={finishDraft}
        onPointerLeave={finishDraft}
      >
        {annotations.map((item) =>
          item.kind === "box" ? (
            <div
              key={item.id}
              className="absolute border-2"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                borderColor: item.color,
                backgroundColor: `${item.color}22`,
              }}
            />
          ) : (
            renderPen(item)
          ),
        )}
        {draft ? (
          draft.kind === "box" ? (
            <div
              className="absolute border-2 border-dashed"
              style={{
                left: draft.width < 0 ? draft.x + draft.width : draft.x,
                top: draft.height < 0 ? draft.y + draft.height : draft.y,
                width: Math.abs(draft.width),
                height: Math.abs(draft.height),
                borderColor: draft.color,
                backgroundColor: `${draft.color}18`,
              }}
            />
          ) : (
            renderPen(draft, true)
          )
        ) : null}
      </div>
    </>
  );
}

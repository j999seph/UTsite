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
type Panel = "controls" | "changelog";

const colorPresets = ["#00E5FF", "#FF3D81", "#7CFF6B", "#FFD84D", "#B45CFF", "#FF8A00"];
const tools: Tool[] = ["box", "pen"];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AnnotationTool() {
  const [enabled, setEnabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>("controls");
  const [color, setColor] = useState(colorPresets[0]);
  const [tool, setTool] = useState<Tool>("box");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [draft, setDraft] = useState<Annotation | null>(null);

  const clearCanvas = useCallback(() => {
    setAnnotations([]);
    setDraft(null);
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
      if (key === "h") {
        setPanel((current) => (current === "controls" ? "changelog" : "controls"));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearCanvas, menuOpen]);

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
    ["H", "Switch panel"],
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
  ] as const;

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
        <aside className="fixed right-4 top-16 z-[70] w-80 rounded-3xl border border-[var(--ut-border)] bg-[var(--ut-surface)] p-4 shadow-soft backdrop-blur-xl">
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
              className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
            >
              {enabled ? "Disable" : "Enable"}
            </button>
            <button
              type="button"
              onClick={clearCanvas}
              className="rounded-full border border-[var(--ut-border)] bg-[var(--ut-surface)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ut-text)] transition hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
            >
              Clear canvas
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPanel("controls")}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                panel === "controls"
                  ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                  : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
              }`}
            >
              Controls
            </button>
            <button
              type="button"
              onClick={() => setPanel("changelog")}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                panel === "changelog"
                  ? "border-transparent bg-[var(--ut-accent)] text-[var(--ut-button-text)]"
                  : "border-[var(--ut-border)] bg-[var(--ut-surface)] text-[var(--ut-text)] hover:bg-[color-mix(in_srgb,var(--ut-accent)_10%,transparent)]"
              }`}
            >
              Changelog
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
            <div className="mt-4 max-h-[28rem] overflow-auto pr-1">
              <div className="space-y-3">
                {changelog.map((entry) => (
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
          )}
        </aside>
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

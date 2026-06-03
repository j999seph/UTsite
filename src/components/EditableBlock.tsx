"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type LayoutBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LayoutTarget = string;

type EditableBlockProps = {
  id: LayoutTarget;
  enabled: boolean;
  selected: boolean;
  highlightColor: string;
  highlightOpacity: number;
  box: LayoutBox;
  baseBox?: LayoutBox;
  onChange: (id: LayoutTarget, next: LayoutBox) => void;
  onCommit?: (id: LayoutTarget, box: LayoutBox) => void;
  onSelect: (id: string) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type DragState = {
  mode: "move" | "resize";
  startX: number;
  startY: number;
  box: LayoutBox;
};

const MIN_WIDTH = 120;
const MIN_HEIGHT = 80;

export default function EditableBlock({
  id,
  enabled,
  selected,
  highlightColor,
  highlightOpacity,
  box,
  baseBox,
  onChange,
  onCommit,
  onSelect,
  children,
  className,
  style,
}: EditableBlockProps) {
  const dragRef = useRef<DragState | null>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const baseWidth = baseBox?.width ?? box.width;
  const baseHeight = baseBox?.height ?? box.height;
  const scaleX = baseWidth > 0 ? box.width / baseWidth : 1;
  const scaleY = baseHeight > 0 ? box.height / baseHeight : 1;

  useEffect(() => {
    function onVisibility(event: Event) {
      const detail = (event as CustomEvent<{ id?: string; visible?: boolean }>).detail;
      if (detail.id === id && typeof detail.visible === "boolean") {
        setVisible(detail.visible);
      }
    }

    window.addEventListener("utsite-layout-visibility", onVisibility as EventListener);
    return () => window.removeEventListener("utsite-layout-visibility", onVisibility as EventListener);
  }, [id]);

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      const state = dragRef.current;
      if (!state) return;

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;

      if (state.mode === "move") {
        onChange(id, {
          ...state.box,
          x: state.box.x + dx,
          y: state.box.y + dy,
        });
        return;
      }

      onChange(id, {
        ...state.box,
        width: Math.max(MIN_WIDTH, state.box.width + dx),
        height: Math.max(MIN_HEIGHT, state.box.height + dy),
      });
    }

    function onPointerUp() {
      if (dragRef.current) {
        onCommit?.(id, dragRef.current.box);
      }
      dragRef.current = null;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [box, id, onChange, onCommit]);

  function beginDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
    window.dispatchEvent(
      new CustomEvent("utsite-layout-start", { detail: { id, box } }),
    );
    dragRef.current = {
      mode: "move",
      startX: event.clientX,
      startY: event.clientY,
      box,
    };
  }

  function beginResize(event: React.PointerEvent<HTMLButtonElement>) {
    if (!enabled) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
    window.dispatchEvent(
      new CustomEvent("utsite-layout-start", { detail: { id, box } }),
    );
    dragRef.current = {
      mode: "resize",
      startX: event.clientX,
      startY: event.clientY,
      box,
    };
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        transform: `translate(${box.x}px, ${box.y}px)`,
        width: box.width,
        height: box.height,
        opacity: visible ? 1 : 0.2,
      pointerEvents: visible ? undefined : "none",
      transition: dragRef.current ? "none" : "transform 120ms ease, box-shadow 120ms ease",
      cursor: enabled ? "move" : undefined,
      overflow: "visible",
      ...style,
      }}
      onPointerDown={enabled ? beginDrag : undefined}
      onClick={enabled ? () => onSelect(id) : undefined}
      onPointerEnter={enabled ? () => setHovered(true) : undefined}
      onPointerLeave={enabled ? () => setHovered(false) : undefined}
      data-layout-target={id}
    >
      <div
        style={{
          pointerEvents: enabled ? "none" : "auto",
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      {enabled ? (
        <>
          {selected ? (
            <>
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] border border-dashed"
                style={{
                  borderColor: `color-mix(in srgb, ${highlightColor} 65%, transparent)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                  backgroundColor: `color-mix(in srgb, ${highlightColor} ${Math.round(highlightOpacity * 100)}%, transparent)`,
                  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${highlightColor} 95%, transparent)`,
                }}
              />
            </>
          ) : null}
          {(selected || hovered) ? (
            <button
              type="button"
              aria-label={`Resize ${id}`}
              className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-none border-0 bg-transparent text-[18px] font-bold leading-none shadow-none"
              style={{ color: highlightColor, transform: "rotate(45deg)" }}
              onPointerDown={beginResize}
            >
              ↔
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

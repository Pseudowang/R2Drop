"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

type ConfettiBurstProps = {
  active: boolean;
  duration?: number;
};

const COLORS = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#ec4899",
  "#fbbf24",
  "#38bdf8",
];

export default function ConfettiBurst({
  active,
  duration = 1200,
}: ConfettiBurstProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [active, duration]);

  const pieces = useMemo(() => Array.from({ length: 14 }), []);

  if (!visible) {
    return null;
  }

  return (
    <div className="confetti-root">
      {(["left", "right"] as const).map((side) => (
        <div key={side} className={`confetti-launcher confetti-${side}`}>
          {pieces.map((_, index) => {
            const color = COLORS[index % COLORS.length];
            const horizontalSpread = 120 + Math.random() * 80;
            const verticalLift = 140 + Math.random() * 90;
            const rotation = (Math.random() * 480 - 240).toFixed(0) + "deg";
            const delay = (index * 35) / 1000;
            const travelX = side === "left" ? horizontalSpread : -horizontalSpread;
            const style: CSSProperties & Record<string, string> = {
              backgroundColor: color,
            };

            style["--dx"] = `${travelX}px`;
            style["--dy"] = `${-verticalLift}px`;
            style["--rotate"] = rotation;
            style["--delay"] = `${delay}s`;
            style["--duration"] = `${0.9 + Math.random() * 0.4}s`;

            return (
              <span
                key={`${side}-${index}`}
                className="confetti-piece"
                style={style}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

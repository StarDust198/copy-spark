import { ImageResponse } from "next/og";

import { Template } from "@/constants/templates";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";

export const alt =
  "CopySpark — AI marketing copy generator. Three generated ad headline variants on a dark background.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex rather than the theme's oklch(): Satori resolves neither CSS variables nor
// oklch, so these are the dark-theme tokens from globals.css pre-converted.
const BACKGROUND = "#0a0a0a"; // --background
const CARD = "#171717"; // --card
const FOREGROUND = "#fafafa"; // --foreground
const MUTED_FOREGROUND = "#a1a1a1"; // --muted-foreground
const BORDER = "rgba(255, 255, 255, 0.1)"; // --border
const AMBER = "#fe9a00"; // amber-500, same accent the favorite star uses

const variants = [
  { headline: "Ship copy that converts — in seconds.", favorite: true },
  { headline: "Great copy, minus the blank page.", favorite: false },
  { headline: "Five headlines from one short brief.", favorite: false },
];

const templates = Object.values(Template).map((template) =>
  capitalizeFirstLetter(template.title),
);

function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color}>
      <path d="M16 2 C17.2 9.6 22.4 14.8 30 16 C22.4 17.2 17.2 22.4 16 30 C14.8 22.4 9.6 17.2 2 16 C9.6 14.8 14.8 9.6 16 2 Z" />
    </svg>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill={filled ? AMBER : "none"}
      stroke={filled ? AMBER : "#525252"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: BACKGROUND,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -160,
            width: 900,
            height: 700,
            backgroundImage: `radial-gradient(circle, rgba(254, 154, 0, 0.16) 0%, rgba(254, 154, 0, 0) 62%)`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Sparkle size={66} color={AMBER} />

            <div
              style={{
                fontSize: 80,
                fontWeight: 700,
                color: FOREGROUND,
                letterSpacing: -2.5,
              }}
            >
              CopySpark
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 36,
              color: MUTED_FOREGROUND,
              letterSpacing: -0.5,
            }}
          >
            AI marketing copy, streamed variant by variant.
          </div>

          <div style={{ display: "flex", marginTop: 40, gap: 14 }}>
            {templates.map((template) => (
              <div
                key={template}
                style={{
                  display: "flex",
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 21,
                  color: MUTED_FOREGROUND,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                {template}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {variants.map((variant, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                width: 336,
                padding: 24,
                borderRadius: 16,
                background: CARD,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ fontSize: 20, fontWeight: 600, color: FOREGROUND }}
                >
                  {/* One interpolated string, not text + expression: Satori
                      counts those as two children and rejects the node. */}
                  {`Variant #${index + 1}`}
                </div>

                <Star filled={variant.favorite} />
              </div>

              <div
                style={{
                  marginTop: 20,
                  fontSize: 13,
                  letterSpacing: 1.2,
                  color: MUTED_FOREGROUND,
                }}
              >
                HEADLINE
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 19,
                  lineHeight: 1.35,
                  color: FOREGROUND,
                }}
              >
                {variant.headline}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

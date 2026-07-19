import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 80,
        background: "#101311",
        color: "#eceeed",
        fontSize: 72,
      }}
    >
      <div style={{ display: "flex", fontSize: 24, color: "#8fb89a" }}>jishnuteegala.com</div>
      <div style={{ display: "flex", marginTop: 16, fontWeight: 600 }}>{title}</div>
      <div
        style={{
          display: "flex",
          marginTop: 12,
          fontSize: 32,
          color: "#a6aba8",
        }}
      >
        {subtitle}
      </div>
    </div>,
    OG_SIZE,
  );
}

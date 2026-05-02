import React from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const COLORS: Record<Method, string> = {
  GET: "#16a34a",
  POST: "#2563eb",
  PUT: "#d97706",
  PATCH: "#d97706",
  DELETE: "#dc2626",
};

export function Endpoint({
  method,
  path,
  auth = false,
}: {
  method: Method;
  path: string;
  auth?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        margin: "16px 0",
        borderRadius: 8,
        background: "rgba(125,125,125,0.08)",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 14,
      }}
    >
      <span
        style={{
          background: COLORS[method],
          color: "white",
          padding: "2px 10px",
          borderRadius: 4,
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 0.5,
        }}
      >
        {method}
      </span>
      <code style={{ background: "transparent", flex: 1 }}>{path}</code>
      {auth && (
        <span
          title="Authentification requise"
          style={{
            background: "#facc15",
            color: "#1f2937",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          🔒 auth
        </span>
      )}
    </div>
  );
}

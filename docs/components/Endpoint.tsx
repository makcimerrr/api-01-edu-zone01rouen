import React from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const COLORS: Record<Method, string> = {
  GET: "#16a34a",
  POST: "#2563eb",
  PUT: "#d97706",
  PATCH: "#d97706",
  DELETE: "#dc2626",
};

const REPO = "https://github.com/makcimerrr/api-01-edu-zone01rouen";

export function Endpoint({
  method,
  path,
  auth = false,
  source,
}: {
  method: Method;
  path: string;
  auth?: boolean;
  /** Path relatif au repo, ex: src/api/v1/users.ts */
  source?: string;
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
        flexWrap: "wrap",
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
      <code style={{ background: "transparent", flex: 1, minWidth: 0 }}>
        {path}
      </code>
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
      {source && (
        <a
          href={`${REPO}/blob/main/${source}`}
          target="_blank"
          rel="noreferrer"
          title="Voir le handler sur GitHub"
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 4,
            border: "1px solid rgba(125,125,125,0.3)",
            color: "inherit",
            textDecoration: "none",
            opacity: 0.85,
          }}
        >
          source ↗
        </a>
      )}
    </div>
  );
}

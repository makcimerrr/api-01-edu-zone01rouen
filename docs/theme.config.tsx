import React from "react";
import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <img src="/docs/logo.svg" alt="" width={28} height={28} />
      <strong>API 01 Edu</strong>
      <span style={{ color: "#888", fontWeight: 400 }}>— Zone01 Rouen</span>
    </span>
  ),
  project: {
    link: "https://github.com/makcimerrr/api-01-edu-zone01rouen",
  },
  docsRepositoryBase:
    "https://github.com/makcimerrr/api-01-edu-zone01rouen/tree/main/docs",
  head: (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="Documentation de l'API 01 Edu — Zone01 Rouen (Deno + Oak)"
      />
      <meta property="og:title" content="API 01 Edu — Zone01 Rouen" />
      <meta
        property="og:description"
        content="REST API qui expose les données pédagogiques Zone01 Rouen au-dessus de la plateforme 01 Edu."
      />
      <link rel="icon" href="/docs/favicon.svg" type="image/svg+xml" />
    </>
  ),
  footer: {
    content: (
      <span>
        API 01 Edu — Zone01 Normandie ·{" "}
        <a
          href="https://github.com/makcimerrr/api-01-edu-zone01rouen"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </span>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  i18n: [{ locale: "fr", name: "Français" }],
  search: {
    placeholder: "Rechercher dans la doc…",
  },
  feedback: {
    content: null,
  },
  toc: {
    backToTop: true,
  },
};

export default config;

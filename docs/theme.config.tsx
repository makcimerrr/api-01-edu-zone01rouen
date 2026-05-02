import React from "react";
import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 700 }}>API 01 Edu — Zone01 Rouen</span>,
  project: {
    link: "https://github.com/makcimerrr/api-01-edu-zone01rouen",
  },
  docsRepositoryBase:
    "https://github.com/makcimerrr/api-01-edu-zone01rouen/tree/main/docs",
  footer: {
    content: "API 01 Edu — Zone01 Normandie",
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  i18n: [{ locale: "fr", name: "Français" }],
  search: {
    placeholder: "Rechercher dans la doc…",
  },
};

export default config;

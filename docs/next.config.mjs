import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
});

export default withNextra({
  output: "export",
  basePath: "/docs",
  assetPrefix: "/docs",
  images: { unoptimized: true },
  trailingSlash: true,
});

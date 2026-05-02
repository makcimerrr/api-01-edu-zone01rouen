import { useEffect, useState } from "react";

export function ApiExplorer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <p style={{ color: "#888", marginTop: 16 }}>
        Chargement de l'API explorer…
      </p>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <script
        id="api-reference"
        data-url="/openapi.yaml"
        // @ts-ignore — custom Scalar config attribute
        data-configuration={JSON.stringify({
          theme: "default",
          layout: "modern",
          hideDownloadButton: false,
        })}
      />
      <script
        src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.50/dist/browser/standalone.js"
        async
      />
    </div>
  );
}

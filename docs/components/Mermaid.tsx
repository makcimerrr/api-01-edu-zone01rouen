import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: unknown) => void;
      run: (config?: unknown) => Promise<void>;
    };
  }
}

let scriptLoaded = false;

function loadMermaid(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
    s.onload = () => {
      scriptLoaded = true;
      window.mermaid?.initialize({ startOnLoad: false, theme: "default" });
      resolve();
    };
    document.body.appendChild(s);
  });
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    loadMermaid().then(() => {
      if (ref.current && window.mermaid) {
        ref.current.removeAttribute("data-processed");
        window.mermaid.run({ nodes: [ref.current] }).catch(() => {});
      }
    });
  }, [mounted, chart]);

  if (!mounted) {
    return (
      <pre style={{ background: "rgba(125,125,125,0.08)", padding: 12, borderRadius: 8 }}>
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid"
      style={{ margin: "24px 0", textAlign: "center" }}
    >
      {chart}
    </div>
  );
}

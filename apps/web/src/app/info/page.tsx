"use client";

import { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "../../lib/api";

export default function BitcoinInfoPage() {
  const [payload, setPayload] = useState("{}");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const endpoint = useMemo(() => buildApiUrl("/bitcoin/info"), []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPayload(JSON.stringify(data, null, 2));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <h1>Bitcoin node info</h1>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>Endpoint: {endpoint}</p>
      </div>
      {error ? (
        <p style={{ color: "#c00" }}>Failed to load node info: {error}</p>
      ) : (
        <pre
          style={{
            background: "var(--surface-background)",
            padding: "1rem",
            borderRadius: "0.5rem",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            color: "var(--surface-foreground)",
          }}
        >
          {loading ? "Loading..." : payload}
        </pre>
      )}
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { apiBase, buildApiUrl } from "../lib/api";

export default function Home() {
  const [message, setMessage] = useState("loading...");
  const [error, setError] = useState<string | null>(null);

  const helloEndpoint = useMemo(() => buildApiUrl("/hello"), []);
  const baseForDisplay = apiBase || "(relative to web host)";

  useEffect(() => {
    setError(null);
    setMessage("loading...");

    fetch(helloEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message ?? "ok");
      })
      .catch((err: Error) => {
        setError(err.message);
        setMessage("error");
      });
  }, [helloEndpoint]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h1>Heimdall Vaults dashboard</h1>
      <p>
        Backend says: <strong>{message}</strong>
      </p>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>API base: {baseForDisplay}</p>
      {error ? (
        <p style={{ color: "#c00" }}>Failed to reach the backend: {error}</p>
      ) : null}
    </section>
  );
}

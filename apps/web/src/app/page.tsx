"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hello`)
      .then(r => r.json())
      .then(d => setMsg(d.message))
      .catch(() => setMsg("error"));
  }, []);

  return (
    <main style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1>Hello from Web</h1>
      <p>Backend says: <b>{msg}</b></p>
    </main>
  );
}
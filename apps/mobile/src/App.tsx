import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

/**
 * Determines the correct API base URL depending on environment:
 * - If EXPO_PUBLIC_API_URL is set (via direnv/Nix), use it.
 * - Otherwise, fall back to device/emulator-specific defaults.
 * - For web builds, use relative `/api` paths (optional).
 */
function getApiBase(): string {
  // 1️⃣ Prefer EXPO_PUBLIC_API_URL (set automatically by direnv)
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv;

  // 2️⃣ If running in Expo, try to infer the Metro host (for fallback dev use)
  const hostUri = Constants.expoConfig?.hostUri ?? "";
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) return `http://${host}:5050`;
  }

  // 3️⃣ Emulator defaults
  if (Platform.OS === "android") return "http://10.0.2.2:5050"; // Android emulator
  if (Platform.OS === "ios") return "http://127.0.0.1:5050"; // iOS simulator

  // 4️⃣ Last resort (should never happen)
  return "http://localhost:5050";
}

export default function App() {
  const [backend, setBackend] = useState("loading...");
  const [apiBase, setApiBase] = useState(getApiBase());

  useEffect(() => {
    const url = `${apiBase}/hello`;
    console.log("📡 Fetching from:", url);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((j) => setBackend(j.message ?? "ok"))
      .catch((e) => {
        console.warn("❌ Backend fetch failed:", e);
        setBackend("error");
      });
  }, [apiBase]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Hello from Mobile</Text>
        <Text>Backend says: {backend}</Text>
        <Text style={{ fontSize: 12, color: "#999" }}>API: {apiBase}</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
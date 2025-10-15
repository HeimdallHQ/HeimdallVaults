import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

type Page = "home" | "info";

const NAV_ITEMS: { key: Page; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "info", label: "Bitcoin info" },
];

function joinPath(base: string, path: string): string {
  const trimmedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!trimmedBase) {
    return normalizedPath;
  }
  return `${trimmedBase}${normalizedPath}`;
}

/**
 * Determines the correct API base URL depending on environment.
 */
function getApiBase(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv;

  const hostUri = Constants.expoConfig?.hostUri ?? "";
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) return `http://${host}:5050`;
  }

  if (Platform.OS === "android") return "http://10.0.2.2:5050";
  if (Platform.OS === "ios") return "http://127.0.0.1:5050";

  return "http://localhost:5050";
}

function HomePage({ apiBase }: { apiBase: string }) {
  const [backend, setBackend] = useState("loading...");
  const [error, setError] = useState<string | null>(null);
  const helloEndpoint = useMemo(() => joinPath(apiBase, "/hello"), [apiBase]);

  useEffect(() => {
    setError(null);
    setBackend("loading...");

    fetch(helloEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setBackend(json.message ?? "ok");
      })
      .catch((err: Error) => {
        setError(err.message);
        setBackend("error");
      });
  }, [helloEndpoint]);

  return (
    <View style={styles.centered}>
      <Text style={styles.heading}>Hello from Mobile</Text>
      <Text>Backend says: {backend}</Text>
      <Text style={styles.caption}>API: {apiBase}</Text>
      {error ? <Text style={styles.error}>Failed to load: {error}</Text> : null}
    </View>
  );
}

function BitcoinInfoPage({ apiBase }: { apiBase: string }) {
  const [content, setContent] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const infoEndpoint = useMemo(
    () => joinPath(apiBase, "/bitcoin/info"),
    [apiBase],
  );

  useEffect(() => {
    setError(null);
    setContent("Loading...");

    fetch(infoEndpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setContent(JSON.stringify(json, null, 2));
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, [infoEndpoint]);

  return (
    <ScrollView contentContainerStyle={styles.infoContainer}>
      <Text style={styles.heading}>Bitcoin node info</Text>
      <Text style={styles.caption}>Endpoint: {infoEndpoint}</Text>
      {error ? (
        <Text style={styles.error}>Failed to load info: {error}</Text>
      ) : (
        <Text selectable style={styles.codeBlock}>
          {content}
        </Text>
      )}
    </ScrollView>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const apiBase = useMemo(() => getApiBase(), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.menu}>
        {NAV_ITEMS.map((item) => {
          const isActive = page === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setPage(item.key)}
              style={[styles.menuButton, isActive && styles.menuButtonActive]}
            >
              <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.content}>
        {page === "home" ? (
          <HomePage apiBase={apiBase} />
        ) : (
          <BitcoinInfoPage apiBase={apiBase} />
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    backgroundColor: "#fafafa",
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 6,
  },
  menuButtonActive: {
    backgroundColor: "#e2e8f0",
  },
  menuText: {
    color: "#333",
    fontSize: 15,
  },
  menuTextActive: {
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  caption: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  error: {
    marginTop: 8,
    color: "#c00",
    textAlign: "center",
  },
  infoContainer: {
    padding: 16,
    flexGrow: 1,
  },
  codeBlock: {
    marginTop: 12,
    backgroundColor: "#f4f4f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  },
});

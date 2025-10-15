import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heimdall Vaults",
  description: "Heimdall Vaults web console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <header
            style={{
              borderBottom: "1px solid #e5e5e5",
              padding: "1rem 1.5rem",
            }}
          >
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.95rem",
              }}
            >
              <Link
                href="/"
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.375rem",
                }}
              >
                Home
              </Link>
              <Link
                href="/info"
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.375rem",
                }}
              >
                Bitcoin info
              </Link>
            </nav>
          </header>
          <main
            style={{
              flex: 1,
              width: "100%",
              maxWidth: "960px",
              margin: "0 auto",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

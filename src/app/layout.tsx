import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Unique Trades",
    template: "%s | Unique Trades",
  },
  description:
    "Unique Trades is a discreet, globally connected business network exploring unique trade opportunities, sourcing needs, logistics challenges, and market access requirements.",
  keywords: [
    "Unique Trades",
    "global trade",
    "international sourcing",
    "logistics support",
    "market access",
    "discreet business network",
  ],
  openGraph: {
    title: "Unique Trades",
    description:
      "A discreet, globally connected business network exploring unique trade opportunities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

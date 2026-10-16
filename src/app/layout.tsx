import type { Metadata } from "next";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Orbitly EU", template: "%s · Orbitly EU" },
  description: "Everyday gear, delivered at orbital speed. Prices include VAT.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <Header />
        <main>{children}</main>
        <ConsentBanner />
      </body>
    </html>
  );
}

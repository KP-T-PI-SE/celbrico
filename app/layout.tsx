import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import BottomNav from "../components/Navigation/BottomNav";
import MobileAppShell from "../components/layout/MobileAppShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Celbrico - Festival Commerce",
  description: "Celebrate More. Shop Less. India's premium Festival Commerce Platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Celbrico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6600",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased min-h-screen bg-neutral-100 dark:bg-neutral-900 pb-16 md:pb-0 font-sans">
        <MobileAppShell>
          <Header />
          <main className="w-full h-full relative">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </MobileAppShell>
      </body>
    </html>
  );
}

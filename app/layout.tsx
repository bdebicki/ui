import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar, SiteHeader, SiteHeaderProvider } from "@/components/layout";
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
  title: {
    default: "Base",
    template: "%s — Base",
  },
  description: "Bazowy starter aplikacji — forkuj i buduj dalej.",
};

/** Locks pinch/double-tap zoom on mobile — dense layouts shift when the
 *  browser zooms after load or when focusing number inputs. */
export const viewport: Viewport = {
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
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        <SiteHeaderProvider>
          <NavBar />
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </SiteHeaderProvider>
      </body>
    </html>
  );
}

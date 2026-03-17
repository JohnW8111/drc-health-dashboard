import type { Metadata } from "next";
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
  title: "DRC Health Dashboard — Modified Triple Aim",
  description:
    "Health indicators for the Democratic Republic of Congo, organized by a modified Triple Aim framework: Population Health, Access & Quality of Care, Health System Resources & Efficiency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 antialiased`}
      >
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DRC</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold leading-tight">
                    DRC Health Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 leading-tight">
                    Modified Triple Aim Framework
                  </p>
                </div>
              </a>
              <nav className="hidden sm:flex items-center gap-6 text-sm">
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Overview
                </a>
                <a
                  href="/dimension/population-health"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Population Health
                </a>
                <a
                  href="/dimension/access-quality"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Access & Quality
                </a>
                <a
                  href="/dimension/resources-efficiency"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Resources
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-xs text-gray-400">
              Framework based on the Triple Aim (Berwick, Nolan, Whittington,
              2008), modified for LMIC context. Data from DHS Program, World
              Bank, WHO GHO, and UNICEF APIs. Dashboard built for volunteer
              healthcare work in the DRC.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

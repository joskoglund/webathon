import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NameEntryPopup from "./components/UI/EntryPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudentWhere",
  description: "BillyBool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 'h-full' on html is crucial for the children's percentage heights to work
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 1. 'min-h-full' ensures the body is at least the height of the screen.
        2. 'flex flex-col' allows the children to grow.
      */}
      <body className="h-full bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
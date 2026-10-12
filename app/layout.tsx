import type { Metadata } from "next";
import "./globals.css";
import "../practice/mathhub.css";
import "./mathhub.css";

export const metadata: Metadata = {
  title: "MathHub · by Mr. Porras",
  description: "Guided math learning in six courses, from 6th Grade Math through Algebra 2 and Geometry.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

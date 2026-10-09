import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathPath · Learn with Mr. Porras",
  description: "One clear step at a time. Guided math lessons, friendly practice, and progress for grades 6–8.",
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

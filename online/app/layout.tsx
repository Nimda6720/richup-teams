import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Richup with Friends",
  description: "Create an online room, invite friends, and build your empire together.",
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

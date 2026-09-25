import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VietBlox - Distributor Robux Region Vietnam Termurah & Terpercaya",
  description:
    "Top Up Robux lebih hemat dan proses instan hanya dengan username Roblox di VietBlox. Distributor resmi Robux region Vietnam terpercaya di Indonesia.",
  icons: {
    icon: "/logo_background.PNG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FFF5F8] text-[#1E293B] antialiased font-sans selection:bg-[#FF4D8D] selection:text-white">
        {children}
      </body>
    </html>
  );
}

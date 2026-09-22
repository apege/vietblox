import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fredoka } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});

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
    <html lang="id" className={`${plusJakartaSans.variable} ${fredoka.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FFF5F8] text-[#1E293B] antialiased font-sans selection:bg-[#FF4D8D] selection:text-white">
        {children}
      </body>
    </html>
  );
}

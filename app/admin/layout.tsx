import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - VietBlox Control Center",
  description: "Panel Kontrol Admin VietBlox - Kelola order top up Robux, pesanan masuk, pricelist, dan pelanggan.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#1E293B] antialiased font-sans">
      {children}
    </div>
  );
}

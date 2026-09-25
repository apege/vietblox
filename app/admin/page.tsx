"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar, { AdminViewType } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardView from "@/components/admin/DashboardView";
import OrderListView from "@/components/admin/OrderListView";
import OrderDetailView from "@/components/admin/OrderDetailView";
import PricelistManagementView from "@/components/admin/PricelistManagementView";
import CustomerListView from "@/components/admin/CustomerListView";
import BlacklistView from "@/components/admin/BlacklistView";
import TestimoniManagementView from "@/components/admin/TestimoniManagementView";
import PaymentHistoryView from "@/components/admin/PaymentHistoryView";
import StoreSettingsView from "@/components/admin/StoreSettingsView";
import LogoutModal from "@/components/admin/LogoutModal";
import {
  OrderItem,
  OrderStatus,
  RobuxPackage,
  getStoredOrders,
  saveStoredOrders,
  getStoredPackages,
  saveStoredPackages,
} from "@/lib/adminStore";

export default function AdminPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [packages, setPackages] = useState<RobuxPackage[]>([]);
  const [activeView, setActiveView] = useState<AdminViewType>("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from storage on mount
  useEffect(() => {
    const loadedOrders = getStoredOrders();
    const loadedPackages = getStoredPackages();
    setOrders(loadedOrders);
    setPackages(loadedPackages);
    if (loadedOrders.length > 0) {
      setSelectedOrder(loadedOrders[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Order Counts
  const orderMasukCount = orders.filter((o) => o.status === "masuk").length;
  const orderDiprosesCount = orders.filter((o) => o.status === "diproses").length;

  // Handle status changes
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const statusLabels: Record<OrderStatus, string> = {
      masuk: "Menunggu Bayar",
      diproses: "Sedang Diproses",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };

    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: newStatus,
            statusLabel: statusLabels[newStatus],
          }
        : o
    );

    setOrders(updated);
    saveStoredOrders(updated);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        statusLabel: statusLabels[newStatus],
      });
    }

    showToast(`Status order #${orderId} diubah menjadi: ${statusLabels[newStatus]}`);
  };

  // Handle admin notes save
  const handleSaveAdminNotes = (orderId: string, notes: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, adminNotes: notes } : o
    );
    setOrders(updated);
    saveStoredOrders(updated);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, adminNotes: notes });
    }
    showToast(`Catatan admin untuk #${orderId} berhasil disimpan!`);
  };

  // Handle packages save
  const handleSavePackages = (pkgs: RobuxPackage[]) => {
    setPackages(pkgs);
    saveStoredPackages(pkgs);
    showToast("Pricelist Robux berhasil diperbarui!");
  };

  // Select order and open detail
  const handleSelectOrder = (order: OrderItem) => {
    setSelectedOrder(order);
    setActiveView("order-detail");
  };

  // Refresh data
  const handleRefreshData = () => {
    const loaded = getStoredOrders();
    setOrders(loaded);
    showToast("Data pesanan berhasil diperbarui!");
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#1E293B] relative isolate">
      
      {/* Ambient Top City Background Glow */}
      <div className="absolute top-0 right-0 left-0 h-96 pointer-events-none z-0 overflow-hidden opacity-30 lg:left-64">
        <div className="relative w-full h-full">
          <img
            src="/banner_background.jpg"
            alt="Ambient Banner Background"
            className="w-full h-full object-cover object-top filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF5F8]/80 to-[#FFF5F8]" />
        </div>
      </div>

      {/* 1. Sidebar */}
      <AdminSidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        orderMasukCount={orderMasukCount}
        orderDiprosesCount={orderDiprosesCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 relative z-10 min-h-screen">
        
        {/* Top Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
          orders={orders}
          onSelectOrder={handleSelectOrder}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
          
          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <DashboardView
              orders={orders}
              onManageOrdersClick={() => setActiveView("order-masuk")}
              onSelectOrder={handleSelectOrder}
              onViewAllOrders={() => setActiveView("order-masuk")}
            />
          )}

          {/* Order Masuk View */}
          {activeView === "order-masuk" && (
            <OrderListView
              orders={orders}
              currentStatusFilter="masuk"
              onSelectOrder={handleSelectOrder}
              onQuickProcess={(order) => handleStatusChange(order.id, "diproses")}
              onRefreshData={handleRefreshData}
            />
          )}

          {/* Order Diproses View */}
          {activeView === "order-diproses" && (
            <OrderListView
              orders={orders}
              currentStatusFilter="diproses"
              onSelectOrder={handleSelectOrder}
              onQuickProcess={(order) => handleStatusChange(order.id, "selesai")}
              onRefreshData={handleRefreshData}
            />
          )}

          {/* Order Selesai View */}
          {activeView === "order-selesai" && (
            <OrderListView
              orders={orders}
              currentStatusFilter="selesai"
              onSelectOrder={handleSelectOrder}
              onQuickProcess={(order) => handleStatusChange(order.id, "diproses")}
              onRefreshData={handleRefreshData}
            />
          )}

          {/* Order Dibatalkan View */}
          {activeView === "order-dibatalkan" && (
            <OrderListView
              orders={orders}
              currentStatusFilter="dibatalkan"
              onSelectOrder={handleSelectOrder}
              onQuickProcess={(order) => handleStatusChange(order.id, "masuk")}
              onRefreshData={handleRefreshData}
            />
          )}

          {/* Order Detail View */}
          {activeView === "order-detail" && selectedOrder && (
            <OrderDetailView
              order={selectedOrder}
              onBack={() => setActiveView("order-masuk")}
              onStatusChange={handleStatusChange}
              onSaveAdminNotes={handleSaveAdminNotes}
            />
          )}

          {/* Pricelist Management View */}
          {activeView === "pricelist" && (
            <PricelistManagementView
              packages={packages}
              onSavePackages={handleSavePackages}
            />
          )}

          {/* Customer List View */}
          {activeView === "pelanggan" && (
            <CustomerListView
              orders={orders}
              onSelectCustomerOrder={handleSelectOrder}
              onRefreshData={handleRefreshData}
              showOnlyBlacklist={false}
            />
          )}

          {/* Blacklist View */}
          {activeView === "blacklist" && (
            <BlacklistView />
          )}

          {/* Kelola Testimoni View */}
          {activeView === "testimoni" && (
            <TestimoniManagementView />
          )}

          {/* Riwayat Pembayaran View */}
          {activeView === "pembayaran" && (
            <PaymentHistoryView
              orders={orders}
              onSelectOrder={handleSelectOrder}
              onRefreshData={handleRefreshData}
            />
          )}

          {/* Pengaturan Toko View */}
          {activeView === "pengaturan" && (
            <StoreSettingsView />
          )}

        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black shadow-2xl flex items-center gap-2 border border-pink-500/30">
            <span className="w-2 h-2 rounded-full bg-[#FF2E74] animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

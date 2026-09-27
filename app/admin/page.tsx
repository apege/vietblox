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

  // Load from Neon API on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 1. Fetch Orders from Neon
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          const fetchedOrders = ordersData.orders || [];
          setOrders(fetchedOrders);
          setSelectedOrder(fetchedOrders.length > 0 ? fetchedOrders[0] : null);
          saveStoredOrders(fetchedOrders);
        }

        // 2. Fetch Products from Neon
        const pkgsRes = await fetch("/api/products?all=true");
        const pkgsData = await pkgsRes.json();
        if (pkgsData.success) {
          const fetchedPkgs = pkgsData.products || [];
          setPackages(fetchedPkgs);
          saveStoredPackages(fetchedPkgs);
        }
      } catch (err) {
        console.warn("Neon live fetch failed:", err);
      }
    };

    loadInitialData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Order Counts
  const orderMasukCount = orders.filter((o) => o.status === "masuk").length;
  const orderDiprosesCount = orders.filter((o) => o.status === "diproses").length;

  // Handle status changes (live PATCH to Neon)
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
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

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: orderId,
          status: newStatus,
        }),
      });
    } catch (e) {
      console.error("Failed to update status on Neon:", e);
    }

    showToast(`Status order #${orderId} diubah menjadi: ${statusLabels[newStatus]}`);
  };

  // Handle admin notes save (live PATCH to Neon)
  const handleSaveAdminNotes = async (orderId: string, notes: string) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, adminNotes: notes } : o
    );
    setOrders(updated);
    saveStoredOrders(updated);

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, adminNotes: notes });
    }

    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: orderId,
          adminNotes: notes,
        }),
      });
    } catch (e) {
      console.error("Failed to update admin notes on Neon:", e);
    }

    showToast(`Catatan admin untuk #${orderId} berhasil disimpan!`);
  };

  // Handle packages save
  const handleSavePackages = async (pkgs: RobuxPackage[]) => {
    setPackages(pkgs);
    saveStoredPackages(pkgs);
    
    try {
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages: pkgs }),
      });
    } catch (err) {
      console.error("Failed to sync packages to DB:", err);
    }

    showToast("Pricelist Robux berhasil diperbarui!");
  };

  // Select order and open detail
  const handleSelectOrder = (order: OrderItem) => {
    setSelectedOrder(order);
    setActiveView("order-detail");
  };

  // Handle new manual order created
  const handleOrderCreated = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    saveStoredOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder);
    showToast(`Pesanan #${newOrder.id} untuk @${newOrder.username} berhasil dibuat!`);
  };

  // Refresh data from Neon
  const handleRefreshData = async () => {
    try {
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      if (ordersData.success && ordersData.orders) {
        setOrders(ordersData.orders);
        showToast("Data pesanan berhasil disinkronkan dari database!");
        return;
      }
    } catch {}
    const loaded = getStoredOrders();
    setOrders(loaded);
    showToast("Data pesanan berhasil diperbarui!");
  };

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-[#1E293B] relative">
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
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
          orders={orders}
          onSelectOrder={handleSelectOrder}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
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
              onOrderCreated={handleOrderCreated}
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
              onOrderCreated={handleOrderCreated}
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
              onOrderCreated={handleOrderCreated}
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
              onOrderCreated={handleOrderCreated}
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

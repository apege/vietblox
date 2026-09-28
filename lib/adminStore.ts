"use client";

export type OrderStatus = "masuk" | "diproses" | "selesai" | "dibatalkan";
export type PaymentMethod = "WHATSAPP" | "WEBSITE";

export interface OrderItem {
  id: string; // e.g. "VBX95559043"
  username: string;
  robloxUserId: string;
  avatarUrl?: string | null;
  robuxAmount: number;
  price: string;
  numericPrice: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  statusLabel: string;
  date: string;
  fullDate: string;
  phone: string;
  customerNotes?: string;
  adminNotes?: string;
  paymentProof?: string | null;
  activationUrl?: string | null;
  gamepassUrl?: string | null;
}

export type PackageStatus = "active" | "sold_out" | "inactive";

export type DynamicBadgeType = "POPULER" | "PROMO" | "SULTAN" | "SOLDOUT" | null;

export interface RobuxPackage {
  id: string;
  amount: number;
  price: string;
  numericPrice: number;
  bonus?: string;
  popular?: boolean;
  save?: string;
  inStock?: boolean;
  status: PackageStatus;
  badge?: DynamicBadgeType;
}

const STORAGE_KEY_ORDERS = "vietblox_admin_orders_v2";
const STORAGE_KEY_PACKAGES = "vietblox_admin_packages_v2";
const STORAGE_KEY_STORE_CONFIG = "vietblox_store_config_v2";

export const defaultPackages: RobuxPackage[] = [
  { id: "pkg-400", amount: 400, price: "Rp 10.000", numericPrice: 10000, status: "sold_out", inStock: false },
  { id: "pkg-900", amount: 900, price: "Rp 20.000", numericPrice: 20000, status: "sold_out", inStock: false },
  { id: "pkg-1200", amount: 1200, price: "Rp 25.000", numericPrice: 25000, status: "sold_out", inStock: false },
  { id: "pkg-1800", amount: 1800, price: "Rp 35.000", numericPrice: 35000, status: "active", inStock: true },
  { id: "pkg-2200", amount: 2200, price: "Rp 45.000", numericPrice: 45000, status: "active", inStock: true },
  { id: "pkg-2700", amount: 2700, price: "Rp 50.000", numericPrice: 50000, status: "active", inStock: true },
  { id: "pkg-3200", amount: 3200, price: "Rp 60.000", numericPrice: 60000, status: "active", inStock: true },
  { id: "pkg-3700", amount: 3700, price: "Rp 70.000", numericPrice: 70000, status: "active", inStock: true },
  { id: "pkg-4200", amount: 4200, price: "Rp 80.000", numericPrice: 80000, status: "active", inStock: true },
  { id: "pkg-4700", amount: 4700, price: "Rp 90.000", numericPrice: 90000, status: "active", inStock: true },
  { id: "pkg-5500", amount: 5500, price: "Rp 100.000", numericPrice: 100000, status: "active", inStock: true },
  { id: "pkg-10500", amount: 10500, price: "Rp 190.000", numericPrice: 190000, status: "active", inStock: true },
];

export const initialPackages: RobuxPackage[] = defaultPackages;

export const initialOrders: OrderItem[] = [];

export function getStoredOrders(): OrderItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY_ORDERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredOrders(orders: OrderItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to localStorage", e);
  }
}

export function getStoredPackages(): RobuxPackage[] {
  if (typeof window === "undefined") return defaultPackages;
  try {
    const data = localStorage.getItem(STORAGE_KEY_PACKAGES);
    if (!data) {
      return defaultPackages;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultPackages;
  } catch {
    return defaultPackages;
  }
}

export function saveStoredPackages(packages: RobuxPackage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(packages));
  } catch (e) {
    console.error("Failed to save packages to localStorage", e);
  }
}

export function cleanUsername(username?: string): string {
  if (!username) return "";
  return username.trim().replace(/^@+/, "");
}

export function formatUsername(username?: string): string {
  if (!username) return "";
  return `@${cleanUsername(username)}`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("Rp", "Rp ");
}

/**
 * Dynamic Package Badge Resolver
 * 1. SOLDOUT : Diambil dari set soldout / stok habis oleh admin
 * 2. PROMO   : Diambil dari paket yang di-set promo di Pengaturan Toko
 * 3. SULTAN  : Diambil dari paket yang nominalnya >= 10.000 Robux
 * 4. POPULER : Diambil dari paket yang paling banyak dibeli
 */
export function getComputedPackageBadge(
  pkg: RobuxPackage,
  orders?: OrderItem[],
  promoPackageId?: string,
  isPromoActive: boolean = true
): DynamicBadgeType {
  // 1. Sold Out: Status sold_out dari admin
  if (pkg.status === "sold_out" || pkg.inStock === false) {
    return "SOLDOUT";
  }

  // 2. Promo: Dari setting promo toko
  let currentPromoId = promoPackageId;
  let promoEnabled = isPromoActive;
  if (!currentPromoId && typeof window !== "undefined") {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_STORE_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        currentPromoId = parsed.selectedPromoPackageId;
        promoEnabled = parsed.isPromoActive !== false;
      }
    } catch {}
  }
  if (
    promoEnabled &&
    currentPromoId &&
    (pkg.id === currentPromoId || (currentPromoId === "pkg-2200" && pkg.amount === 2200))
  ) {
    return "PROMO";
  }

  // 3. Sultan: Paket di atas atau sama dengan 10.000 Robux
  if (pkg.amount >= 10000) {
    return "SULTAN";
  }

  // 4. Populer: Paket yang paling banyak dibeli
  let allOrders = orders;
  if (!allOrders && typeof window !== "undefined") {
    try {
      allOrders = getStoredOrders();
    } catch {}
  }

  if (allOrders && allOrders.length > 0) {
    const counts: Record<number, number> = {};
    allOrders.forEach((o) => {
      if (o.status !== "dibatalkan") {
        counts[o.robuxAmount] = (counts[o.robuxAmount] || 0) + 1;
      }
    });

    let maxRobuxAmount = -1;
    let maxFrequency = 0;
    Object.entries(counts).forEach(([amt, count]) => {
      const numAmt = parseInt(amt);
      if (count > maxFrequency && numAmt < 10000) {
        maxFrequency = count;
        maxRobuxAmount = numAmt;
      }
    });

    if (maxFrequency > 0 && pkg.amount === maxRobuxAmount) {
      return "POPULER";
    }
  }

  // Fallback populer jika order sama rata
  if (pkg.amount === 1800) {
    return "POPULER";
  }

  return null;
}

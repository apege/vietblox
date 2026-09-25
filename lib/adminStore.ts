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
}

export type PackageStatus = "active" | "sold_out" | "inactive";

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
  badge?: "PROMO" | "SULTAN" | "HOT" | "BEST SELLER" | null;
}

const STORAGE_KEY_ORDERS = "vietblox_admin_orders_v2";
const STORAGE_KEY_PACKAGES = "vietblox_admin_packages_v2";

export const initialPackages: RobuxPackage[] = [
  { id: "pkg-1800", amount: 1800, price: "Rp 35.000", numericPrice: 35000, status: "active", inStock: true },
  { id: "pkg-2200", amount: 2200, price: "Rp 45.000", numericPrice: 45000, badge: "PROMO", status: "active", inStock: true },
  { id: "pkg-2700", amount: 2700, price: "Rp 50.000", numericPrice: 50000, status: "active", inStock: true },
  { id: "pkg-3200", amount: 3200, price: "Rp 60.000", numericPrice: 60000, status: "active", inStock: true },
  { id: "pkg-3700", amount: 3700, price: "Rp 70.000", numericPrice: 70000, status: "active", inStock: true },
  { id: "pkg-4200", amount: 4200, price: "Rp 80.000", numericPrice: 80000, status: "active", inStock: true },
  { id: "pkg-4700", amount: 4700, price: "Rp 90.000", numericPrice: 90000, status: "active", inStock: true },
  { id: "pkg-5500", amount: 5500, price: "Rp 100.000", numericPrice: 100000, status: "active", inStock: true },
  { id: "pkg-10500", amount: 10500, price: "Rp 200.000", numericPrice: 200000, badge: "SULTAN", status: "active", inStock: true },
];

export const initialOrders: OrderItem[] = [
  // 1. Order from screenshot
  {
    id: "VBX95559043",
    username: "ddil112",
    robloxUserId: "3425661389",
    avatarUrl: null,
    robuxAmount: 2200,
    price: "Rp 45.000",
    numericPrice: 45000,
    paymentMethod: "WHATSAPP",
    status: "masuk",
    statusLabel: "Menunggu Bayar",
    date: "22 Sep, 20.15",
    fullDate: "22 September 2026 pukul 20:15 WIB",
    phone: "+6285828378025",
    customerNotes: "Pemesanan via WhatsApp Direct",
    adminNotes: "",
    paymentProof: null,
  },
  {
    id: "VBX12450548",
    username: "Zeershhd",
    robloxUserId: "2847192840",
    avatarUrl: null,
    robuxAmount: 5500,
    price: "Rp 100.000",
    numericPrice: 100000,
    paymentMethod: "WEBSITE",
    status: "masuk",
    statusLabel: "Menunggu Bayar",
    date: "21 Sep, 19.35",
    fullDate: "21 September 2026 pukul 19:35 WIB",
    phone: "+6281299834710",
    customerNotes: "Gamepass sudah di-set ke 7.857 Robux ya min",
    adminNotes: "Menunggu konfirmasi mutasi rekening",
    paymentProof: null,
  },
  {
    id: "VBX19326593",
    username: "rep",
    robloxUserId: "1938472911",
    avatarUrl: null,
    robuxAmount: 2200,
    price: "Rp 45.000",
    numericPrice: 45000,
    paymentMethod: "WHATSAPP",
    status: "masuk",
    statusLabel: "Menunggu Bayar",
    date: "20 Sep, 16.56",
    fullDate: "20 September 2026 pukul 16:56 WIB",
    phone: "+6285712390881",
    customerNotes: "Pemesanan via WhatsApp Direct",
    adminNotes: "",
    paymentProof: null,
  },
  {
    id: "VBX16327827",
    username: "MFMftRyan",
    robloxUserId: "3920194820",
    avatarUrl: null,
    robuxAmount: 3700,
    price: "Rp 70.000",
    numericPrice: 70000,
    paymentMethod: "WEBSITE",
    status: "masuk",
    statusLabel: "Menunggu Bayar",
    date: "19 Sep, 14.10",
    fullDate: "19 September 2026 pukul 14:10 WIB",
    phone: "+6281384729910",
    customerNotes: "Sudah upload bukti bayar via QRIS",
    adminNotes: "",
    paymentProof: "/payments/qris.svg",
  },
  {
    id: "VBX85658025",
    username: "MFMftRyan",
    robloxUserId: "3920194820",
    avatarUrl: null,
    robuxAmount: 3700,
    price: "Rp 70.000",
    numericPrice: 70000,
    paymentMethod: "WEBSITE",
    status: "masuk",
    statusLabel: "Menunggu Bayar",
    date: "18 Sep, 12.37",
    fullDate: "18 September 2026 pukul 12:37 WIB",
    phone: "+6281384729910",
    customerNotes: "Pemesanan website QRIS",
    adminNotes: "",
    paymentProof: null,
  },
  {
    id: "VBX03326996",
    username: "nYvL_zs",
    robloxUserId: "1092837465",
    avatarUrl: null,
    robuxAmount: 2200,
    price: "Rp 45.000",
    numericPrice: 45000,
    paymentMethod: "WHATSAPP",
    status: "masuk",
    statusLabel: "Menunggu Bayar",
    date: "16 Sep, 19.33",
    fullDate: "16 September 2026 pukul 19:33 WIB",
    phone: "+6287766554433",
    customerNotes: "Pemesanan via WhatsApp Direct",
    adminNotes: "",
    paymentProof: null,
  },
  {
    id: "VBX49201844",
    username: "KenzoGamer99",
    robloxUserId: "4509182394",
    avatarUrl: null,
    robuxAmount: 1200,
    price: "Rp 104.000",
    numericPrice: 104000,
    paymentMethod: "WEBSITE",
    status: "diproses",
    statusLabel: "Sedang Diproses",
    date: "22 Sep, 21.05",
    fullDate: "22 September 2026 pukul 21:05 WIB",
    phone: "+6282199887766",
    customerNotes: "Gamepass VIP sword di game blox fruits",
    adminNotes: "Sedang dibeli oleh bot vietnam #2",
    paymentProof: "/payments/qris.svg",
  },
  {
    id: "VBX77491023",
    username: "AlyaRobloxQueen",
    robloxUserId: "3291048201",
    avatarUrl: null,
    robuxAmount: 5000,
    price: "Rp 409.000",
    numericPrice: 409000,
    paymentMethod: "WEBSITE",
    status: "diproses",
    statusLabel: "Sedang Diproses",
    date: "22 Sep, 20.40",
    fullDate: "22 September 2026 pukul 20:40 WIB",
    phone: "+6281987654321",
    customerNotes: "Tolong cepat ya min mau beli avatar item limited",
    adminNotes: "Payment verified - processing gamepass buy",
    paymentProof: null,
  },
  {
    id: "VBX66301928",
    username: "BudiProPlayer",
    robloxUserId: "1829304910",
    avatarUrl: null,
    robuxAmount: 10000,
    price: "Rp 810.000",
    numericPrice: 810000,
    paymentMethod: "WHATSAPP",
    status: "selesai",
    statusLabel: "Selesai",
    date: "22 Sep, 18.20",
    fullDate: "22 September 2026 pukul 18:20 WIB",
    phone: "+6281234567890",
    customerNotes: "Paket Sultan 10.000 Robux",
    adminNotes: "Robux pending 5 hari sudah masuk ke akun user",
    paymentProof: null,
  },
  {
    id: "VBX55192837",
    username: "ChandraGanteng",
    robloxUserId: "2938471029",
    avatarUrl: null,
    robuxAmount: 800,
    price: "Rp 69.000",
    numericPrice: 69000,
    paymentMethod: "WHATSAPP",
    status: "dibatalkan",
    statusLabel: "Dibatalkan",
    date: "21 Sep, 15.00",
    fullDate: "21 September 2026 pukul 15:00 WIB",
    phone: "+6285811223344",
    customerNotes: "Salah input username",
    adminNotes: "Dibatalkan atas permintaan pelanggan",
    paymentProof: null,
  },
];

// Generate extra realistic mock orders so the default badge counts match 72 masuk, 28 diproses!
function generateFullMockOrders(): OrderItem[] {
  const result: OrderItem[] = [...initialOrders];
  const userPrefixes = ["Naufal", "Raka", "Kirana", "Vino", "Zahra", "Dimas", "Aurel", "Fikri", "Tiara", "Revan", "Nabila", "Arka", "Putri", "Adit", "Syifa"];
  const amounts = [400, 800, 1200, 1600, 2000, 2500, 3700, 5000, 10000];
  const prices: Record<number, { price: string; num: number }> = {
    400: { price: "Rp 30.500", num: 30500 },
    800: { price: "Rp 69.000", num: 69000 },
    1200: { price: "Rp 104.000", num: 104000 },
    1600: { price: "Rp 138.000", num: 138000 },
    2000: { price: "Rp 172.000", num: 172000 },
    2200: { price: "Rp 45.000", num: 45000 },
    2500: { price: "Rp 209.000", num: 209000 },
    3700: { price: "Rp 70.000", num: 70000 },
    5000: { price: "Rp 409.000", num: 409000 },
    5500: { price: "Rp 100.000", num: 100000 },
    10000: { price: "Rp 810.000", num: 810000 },
  };

  // Ensure 72 Order Masuk
  let currentMasukCount = result.filter(o => o.status === "masuk").length;
  let counter = 100;
  while (currentMasukCount < 72) {
    const uname = `${userPrefixes[counter % userPrefixes.length]}_${Math.floor(Math.random() * 899 + 100)}`;
    const amt = amounts[counter % amounts.length];
    const p = prices[amt] || { price: "Rp 45.000", num: 45000 };
    const day = Math.max(1, 22 - Math.floor(counter / 8));
    const hour = Math.floor(Math.random() * 14 + 8).toString().padStart(2, "0");
    const min = Math.floor(Math.random() * 59).toString().padStart(2, "0");
    const isWa = counter % 2 === 0;

    result.push({
      id: `VBX${Math.floor(10000000 + Math.random() * 89999999)}`,
      username: uname,
      robloxUserId: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      avatarUrl: null,
      robuxAmount: amt,
      price: p.price,
      numericPrice: p.num,
      paymentMethod: isWa ? "WHATSAPP" : "WEBSITE",
      status: "masuk",
      statusLabel: "Menunggu Bayar",
      date: `${day} Sep, ${hour}.${min}`,
      fullDate: `${day} September 2026 pukul ${hour}:${min} WIB`,
      phone: `+628${Math.floor(100000000 + Math.random() * 899999999)}`,
      customerNotes: isWa ? "Pemesanan via WhatsApp Direct" : "Pemesanan website QRIS",
      adminNotes: "",
      paymentProof: isWa ? null : (counter % 3 === 0 ? "/payments/qris.svg" : null),
    });
    currentMasukCount++;
    counter++;
  }

  // Ensure 28 Order Diproses
  let currentDiprosesCount = result.filter(o => o.status === "diproses").length;
  while (currentDiprosesCount < 28) {
    const uname = `${userPrefixes[counter % userPrefixes.length]}_Gamer`;
    const amt = amounts[counter % amounts.length];
    const p = prices[amt] || { price: "Rp 104.000", num: 104000 };
    const day = Math.max(1, 22 - Math.floor(counter / 10));
    const hour = Math.floor(Math.random() * 14 + 8).toString().padStart(2, "0");
    const min = Math.floor(Math.random() * 59).toString().padStart(2, "0");

    result.push({
      id: `VBX${Math.floor(10000000 + Math.random() * 89999999)}`,
      username: uname,
      robloxUserId: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      avatarUrl: null,
      robuxAmount: amt,
      price: p.price,
      numericPrice: p.num,
      paymentMethod: "WEBSITE",
      status: "diproses",
      statusLabel: "Sedang Diproses",
      date: `${day} Sep, ${hour}.${min}`,
      fullDate: `${day} September 2026 pukul ${hour}:${min} WIB`,
      phone: `+628${Math.floor(100000000 + Math.random() * 899999999)}`,
      customerNotes: "Gamepass sudah diset publik",
      adminNotes: "Dalam antrean gamepass region vietnam",
      paymentProof: "/payments/qris.svg",
    });
    currentDiprosesCount++;
    counter++;
  }

  return result;
}

export function getStoredOrders(): OrderItem[] {
  if (typeof window === "undefined") return initialOrders;
  try {
    const data = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!data) {
      const full = generateFullMockOrders();
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(full));
      return full;
    }
    return JSON.parse(data);
  } catch {
    return initialOrders;
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
  if (typeof window === "undefined") return initialPackages;
  try {
    const data = localStorage.getItem(STORAGE_KEY_PACKAGES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(initialPackages));
      return initialPackages;
    }
    return JSON.parse(data);
  } catch {
    return initialPackages;
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

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("Rp", "Rp ");
}

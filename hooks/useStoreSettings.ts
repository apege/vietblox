"use client";

import { useState, useEffect } from "react";

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  qrisImageUrl: string;
  logoImageUrl: string;
  bannerImageUrl: string;
  isPromoActive: boolean;
  selectedPromoPackageId: string;
  promoTagline: string;
  promoEndDate: string;
  defaultActivationUrl?: string;
}

export const defaultStoreSettings: StoreSettings = {
  storeName: "VietBlox",
  whatsappNumber: "6281234567890",
  qrisImageUrl: "/payments/qris.svg",
  logoImageUrl: "/logo_background.PNG",
  bannerImageUrl: "/banner_background.jpg",
  isPromoActive: true,
  selectedPromoPackageId: "pkg-2200",
  promoTagline: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang",
  promoEndDate: "1 Oktober 2026, 06:59 WIB",
  defaultActivationUrl: "",
};

const STORAGE_KEY = "vietblox_store_config_v2";

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 1. Instant hydration from local storage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings({ ...defaultStoreSettings, ...JSON.parse(saved) });
      }
    } catch {}

    // 2. Fetch fresh config from DB in background
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings((prev) => {
            const next = { ...prev, ...data.settings };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {}
            return next;
          });
        }
      } catch (err) {
        console.warn("Could not fetch store settings:", err);
      } finally {
        setLoaded(true);
      }
    };

    fetchSettings();

    // 3. Listen to local storage sync events across tabs / windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setSettings({ ...defaultStoreSettings, ...JSON.parse(e.newValue) });
        } catch {}
      }
    };

    // 4. Listen to custom in-window sync event (instant re-render on admin save)
    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setSettings({ ...defaultStoreSettings, ...JSON.parse(saved) });
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("vietblox_settings_updated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("vietblox_settings_updated", handleCustomEvent);
    };
  }, []);

  return { settings, loaded };
}

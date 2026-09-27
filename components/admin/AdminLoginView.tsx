"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

interface AdminLoginViewProps {
  onLoginSuccess: (token: string) => void;
}

export default function AdminLoginView({ onLoginSuccess }: AdminLoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan password admin wajib diisi.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        if (rememberMe) {
          localStorage.setItem("vietblox_admin_token", data.token);
        } else {
          sessionStorage.setItem("vietblox_admin_token", data.token);
        }
        onLoginSuccess(data.token);
      } else {
        setErrorMessage(data.error || "Username atau password admin salah!");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage("Gagal menghubungkan ke server autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F8] via-white to-[#FFF0F5] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(255,46,116,0.12)] border border-pink-200/80 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF2E74] to-[#FF6B98] flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <BrandLogo size="lg" name="VietBlox" />
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Masukkan Kredensial Administrator untuk mengakses Dashboard
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2 animate-in shake duration-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-800">
              Username Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Masukkan username admin..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-pink-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-slate-50/50 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-800">
              Password Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Masukkan password admin..."
                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-pink-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-slate-50/50 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF2E74] focus:ring-[#FF2E74] border-pink-300 accent-[#FF2E74] cursor-pointer"
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E74] via-[#FF4D8D] to-[#E11D48] text-white font-black text-sm shadow-[0_8px_20px_rgba(255,46,116,0.35)] hover:shadow-[0_12px_28px_rgba(255,46,116,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi Kredensial...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Storefront Link */}
        <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF2E74] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Toko</span>
          </Link>
        </div>

      </div>

      {/* Footer Security Note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400 relative z-10">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Autentikasi Terenkripsi & Terintegrasi Environment Variables</span>
      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Plus,
  Star,
  Search,
  ShieldCheck,
  Eye,
  EyeOff,
  Edit2,
  CornerDownRight,
  Trash2,
  X,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { cleanUsername, getStoredPackages, RobuxPackage } from "@/lib/adminStore";

export interface TestimonialItem {
  id: string;
  username: string;
  isVerified: boolean;
  robuxAmount: number;
  rating: number;
  timeAgo: string;
  comment: string;
  adminReply?: string | null;
  status: "active" | "hidden";
}

const STORAGE_KEY_TESTIMONIALS = "vietblox_testimonials_v2";

const initialTestimonialsData: TestimonialItem[] = [];

type FilterTab = "all" | "active" | "hidden" | "needs-reply";

export default function TestimoniManagementView() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [packages, setPackages] = useState<RobuxPackage[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [replyingItem, setReplyingItem] = useState<TestimonialItem | null>(null);

  // Form states for Add/Edit
  const [formUsername, setFormUsername] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [formRobuxAmount, setFormRobuxAmount] = useState("1800");
  const [formReplyText, setFormReplyText] = useState("");

  // Helper to format ISO date
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMinutes < 1) return "Baru saja";
      if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} hari lalu`;
    } catch {
      return "Baru saja";
    }
  };

  const loadTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        const mapped: TestimonialItem[] = data.testimonials.map((row: any) => ({
          id: row.id.toString(),
          username: row.name || "Anonim",
          isVerified: true,
          robuxAmount: 1000,
          rating: row.rating || 5,
          timeAgo: formatTimeAgo(row.created_at),
          comment: row.message || "",
          adminReply: row.admin_reply || null,
          status: row.status === "hidden" ? "hidden" : "active",
        }));
        setTestimonials(mapped);
        localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(mapped));
        return;
      }
    } catch (e) {
      console.warn("Failed to fetch testimonials from API, checking local storage:", e);
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
      if (saved) setTestimonials(JSON.parse(saved));
      else setTestimonials([]);
    } catch {
      setTestimonials([]);
    }
  };

  // Load testimonials & packages
  useEffect(() => {
    loadTestimonials();
    const pkgs = getStoredPackages();
    setPackages(pkgs);

    const fetchPkgs = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setPackages(data.products);
        }
      } catch {}
    };
    fetchPkgs();
  }, []);

  const saveTestimonials = (items: TestimonialItem[]) => {
    setTestimonials(items);
    try {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTestimonials();
    setIsRefreshing(false);
  };

  // Metrics
  const totalCount = testimonials.length;
  const activeCount = testimonials.filter((t) => t.status === "active").length;
  const hiddenCount = testimonials.filter((t) => t.status === "hidden").length;
  const needsReplyCount = testimonials.filter((t) => !t.adminReply).length;
  
  const avgRating = totalCount > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
    : "5.0";

  // Actions
  const toggleVisibility = async (id: string) => {
    const current = testimonials.find((t) => t.id === id);
    const newStatus = current?.status === "active" ? "hidden" : "active";

    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, status: newStatus as "active" | "hidden" } : t
    );
    saveTestimonials(updated);

    try {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (e) {
      console.error("Failed to update status on server:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
      const updated = testimonials.filter((t) => t.id !== id);
      saveTestimonials(updated);

      try {
        await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to delete testimonial on server:", e);
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormUsername("");
    setFormRating(5);
    setFormComment("");
    setFormRobuxAmount("1000");
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormUsername(item.username);
    setFormRating(item.rating);
    setFormComment(item.comment);
    setFormRobuxAmount(item.robuxAmount.toString());
    setIsAddModalOpen(true);
  };

  const openReplyModal = (item: TestimonialItem) => {
    setReplyingItem(item);
    setFormReplyText(item.adminReply || "");
  };

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingItem) return;

    const replyText = formReplyText.trim() || null;
    const updated = testimonials.map((t) =>
      t.id === replyingItem.id ? { ...t, adminReply: replyText } : t
    );
    saveTestimonials(updated);

    try {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: replyingItem.id, adminReply: replyText }),
      });
    } catch (err) {
      console.error("Failed to save reply on server:", err);
    }

    setReplyingItem(null);
    setFormReplyText("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formComment.trim()) return;

    const cleanUsername = formUsername.trim().replace(/^@/, "");
    const amount = parseInt(formRobuxAmount.replace(/\D/g, "")) || 1000;

    if (editingItem) {
      // Update existing
      const updated = testimonials.map((t) =>
        t.id === editingItem.id
          ? {
              ...t,
              username: cleanUsername,
              rating: formRating,
              comment: formComment.trim(),
              robuxAmount: amount,
            }
          : t
      );
      saveTestimonials(updated);
    } else {
      // Create new
      const newItem: TestimonialItem = {
        id: `testi-${Date.now()}`,
        username: cleanUsername,
        isVerified: true,
        robuxAmount: amount,
        rating: formRating,
        timeAgo: "Baru saja",
        comment: formComment.trim(),
        adminReply: null,
        status: "active",
      };
      saveTestimonials([newItem, ...testimonials]);

      try {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanUsername,
            message: formComment.trim(),
            rating: formRating,
          }),
        });
        const data = await res.json();
        if (data.success && data.item) {
          // Replace temporary id with real id from DB
          setTestimonials((prev) =>
            prev.map((t) => (t.id === newItem.id ? { ...t, id: data.item.id.toString() } : t))
          );
        }
      } catch (err) {
        console.error("Failed to add testimonial to server:", err);
      }
    }

    setIsAddModalOpen(false);
  };

  // Filtered List
  const filtered = testimonials.filter((t) => {
    if (activeTab === "active" && t.status !== "active") return false;
    if (activeTab === "hidden" && t.status !== "hidden") return false;
    if (activeTab === "needs-reply" && t.adminReply) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      t.username.toLowerCase().includes(q) ||
      t.comment.toLowerCase().includes(q) ||
      t.robuxAmount.toString().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      
      {/* ─── 1. Header (Matching Screenshot 1) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kelola Testimoni & Ulasan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Moderasi ulasan pembeli, tambah ulasan manual, balas testimoni, dan kontrol publikasi di website
          </p>
        </div>

        {/* Action Buttons: + Tambah Testimoni & Refresh */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(255,46,116,0.35)] hover:shadow-[0_6px_20px_rgba(255,46,116,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Testimoni</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-pink-200/90 hover:border-pink-300 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#FF2E74] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Metric Cards (Matching Screenshot 1) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Total Ulasan */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
            TOTAL ULASAN
          </span>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Rating Rata-Rata */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
            RATING RATA-RATA
          </span>
          <div className="mt-2 sm:mt-3 flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
              {avgRating}
            </span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400 -mt-0.5" />
          </div>
        </div>

        {/* Aktif (Tampil) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
            AKTIF (TAMPIL)
          </span>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {activeCount}
            </span>
          </div>
        </div>

        {/* Perlu Balasan */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
            PERLU BALASAN
          </span>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#FF2E74] tracking-tight">
              {needsReplyCount}
            </span>
          </div>
        </div>

      </div>

      {/* ─── 3. Filter Tabs & Search Bar Container (Matching Screenshot 1) ─── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-pink-200/90 shadow-sm flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-2">
          {/* Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            
            {/* Semua */}
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              Semua ({totalCount})
            </button>

            {/* Aktif */}
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "active"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              Aktif ({activeCount})
            </button>

            {/* Disembunyikan */}
            <button
              onClick={() => setActiveTab("hidden")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "hidden"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              Disembunyikan ({hiddenCount})
            </button>

            {/* Perlu Balasan */}
            <button
              onClick={() => setActiveTab("needs-reply")}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "needs-reply"
                  ? "bg-[#FF2E74] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-pink-50 hover:text-[#FF2E74]"
              }`}
            >
              Perlu Balasan ({needsReplyCount})
            </button>

          </div>

          {/* Search Input on Right */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari username atau ulasan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium rounded-2xl bg-white border border-slate-200 focus:border-[#FF2E74] focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* ─── 4. Testimonial Cards List (Matching Screenshot 1) ─── */}
        <div className="flex flex-col gap-3.5 pt-2">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 font-bold text-xs">
              Tidak ada data testimoni yang sesuai filter.
            </div>
          ) : (
            filtered.map((item) => {
              const avatarLetter = item.username.charAt(0).toUpperCase() || "U";
              const isVisible = item.status === "active";

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-pink-100/90 hover:border-pink-200 transition-all flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    {/* Left: Avatar + Username + Badges + Stars */}
                    <div className="flex items-start gap-3">
                      {/* Pink Initial Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#FF2E74] text-white flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0">
                        {avatarLetter}
                      </div>

                      <div className="flex flex-col gap-1">
                        {/* Name & Badges Row */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-sm font-black text-slate-900">
                            @{cleanUsername(item.username)}
                          </span>

                          {/* Terverifikasi Badge */}
                          {item.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Terverifikasi</span>
                            </span>
                          )}

                          {/* Robux Amount Badge */}
                          <span className="px-2 py-0.5 rounded-md bg-pink-50 text-[#FF2E74] text-[10px] font-black">
                            {item.robuxAmount.toLocaleString("id-ID")} Robux
                          </span>
                        </div>

                        {/* Stars & Time */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < item.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons (Tampil/Sembunyi, Edit, Balas, Delete) */}
                    <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-slate-100 sm:border-0 flex-shrink-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Tampil / Sembunyi Button */}
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isVisible
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {isVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Tampil</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Sembunyi</span>
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Balas Button */}
                        <button
                          onClick={() => openReplyModal(item)}
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-50 hover:bg-pink-100 text-[#FF2E74] border border-pink-200/80 transition-all cursor-pointer"
                        >
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>{item.adminReply ? "Edit Balasan" : "Balas"}</span>
                        </button>
                      </div>

                      {/* Delete Icon Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer flex-shrink-0"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                  {/* Testimonial Quote */}
                  <div className="sm:pl-13 text-xs sm:text-[13px] text-slate-800 font-semibold leading-relaxed">
                    “{item.comment}”
                  </div>

                  {/* Admin Reply Box if exists */}
                  {item.adminReply && (
                    <div className="sm:ml-13 p-3 rounded-2xl bg-pink-50/60 border border-pink-200/70 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#FF2E74] flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Balasan VietBlox Admin:</span>
                        </span>
                        <button
                          onClick={() => openReplyModal(item)}
                          className="text-[10px] text-[#FF2E74] hover:underline font-bold"
                        >
                          Ubah
                        </button>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {item.adminReply}
                      </p>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ─── 5. Modal Tambah / Edit Testimoni (Matching Screenshot 2 - Tanpa Upload Foto) ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-pink-200 shadow-2xl p-6 sm:p-7 flex flex-col gap-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              {/* Username Roblox */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-800">
                  Username Roblox <span className="text-[#FF2E74]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: APG_Channel11"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-pink-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50"
                  />
                </div>
              </div>

              {/* Rating Kepuasan (1 - 5 Bintang) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-800">
                  Rating Kepuasan (1 - 5 Bintang)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                          star <= formRating
                            ? "bg-amber-50 border-amber-300 text-amber-400"
                            : "bg-slate-50 border-slate-200 text-slate-300"
                        }`}
                      >
                        <Star className={`w-5 h-5 ${star <= formRating ? "fill-amber-400" : ""}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 pl-1">
                    {formRating} Bintang
                  </span>
                </div>
              </div>

              {/* Isi Ulasan Testimoni */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-800">
                  Isi Ulasan Testimoni <span className="text-[#FF2E74]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan pengalaman / ulasan kepuasan pembeli..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-pink-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 resize-none"
                />
              </div>

              {/* Paket Robux / Kode Order (Opsional) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800">
                    Paket Robux / Kode Order (Opsional)
                  </label>
                  <span className="text-[10px] font-bold text-[#FF2E74]">
                    Pilih dari List atau Ketik
                  </span>
                </div>

                {/* Dropdown Select Paket yang Tersedia */}
                <select
                  value={formRobuxAmount}
                  onChange={(e) => setFormRobuxAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-white cursor-pointer shadow-2xs"
                >
                  <option value="">-- Pilih Paket Robux yang Tersedia --</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id || pkg.amount} value={pkg.amount.toString()}>
                      +{pkg.amount.toLocaleString("id-ID")} Robux ({pkg.price})
                    </option>
                  ))}
                </select>

                {/* Quick Selection Chips / Pills */}
                {packages.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 mr-0.5">Pilihan Cepat:</span>
                    {packages.slice(0, 6).map((pkg) => (
                      <button
                        key={pkg.id || pkg.amount}
                        type="button"
                        onClick={() => setFormRobuxAmount(pkg.amount.toString())}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                          formRobuxAmount === pkg.amount.toString()
                            ? "bg-[#FF2E74] text-white border-[#FF2E74] shadow-xs scale-105"
                            : "bg-pink-50 hover:bg-pink-100 text-[#FF2E74] border-pink-200"
                        }`}
                      >
                        +{pkg.amount.toLocaleString("id-ID")}
                      </button>
                    ))}
                  </div>
                )}

                {/* Manual Input (Ketik custom nominal atau kode order) */}
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="text"
                    placeholder="Atau ketik manual misal: 4200 atau #VBX12345"
                    value={formRobuxAmount}
                    onChange={(e) => setFormRobuxAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E74] to-[#E11D48] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {editingItem ? "Simpan Perubahan" : "Tambah Testimoni"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── 6. Modal Balas Testimoni ─── */}
      {replyingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white border border-pink-200 shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="text-base font-black text-slate-900">
                Balas Ulasan @{cleanUsername(replyingItem.username)}
              </h3>
              <button
                onClick={() => setReplyingItem(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs text-slate-600 italic">
              "{replyingItem.comment}"
            </div>

            <form onSubmit={handleSaveReply} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-800">
                  Teks Balasan Admin
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tulis balasan terima kasih / respon admin..."
                  value={formReplyText}
                  onChange={(e) => setFormReplyText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-pink-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF2E74] focus:ring-2 focus:ring-pink-200/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setReplyingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF2E74] text-white text-xs font-extrabold shadow-sm hover:bg-[#E11D48] cursor-pointer"
                >
                  Kirim Balasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

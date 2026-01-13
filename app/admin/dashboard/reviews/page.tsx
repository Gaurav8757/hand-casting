"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Eye,
  EyeOff,
  Trash2,
  Star,
  Plus,
  Edit2,
  CheckSquare,
  Square,
  Trash,
  Search,
  MessageSquare,
  Info,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ReviewsManagement() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    reviewText: "",
    displayOnLanding: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customer_ratings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim())
      newErrors.customerName = "Customer name is required";
    if (!formData.customerEmail.trim())
      newErrors.customerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }
    if (!formData.reviewText.trim())
      newErrors.reviewText = "Review text is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please resolve validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        rating: formData.rating,
        review_text: formData.reviewText,
        display_on_landing: formData.displayOnLanding,
      };

      if (editingId) {
        const { error } = await supabase
          .from("customer_ratings")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Review refined successfully");
      } else {
        const { error } = await supabase
          .from("customer_ratings")
          .insert(payload);

        if (error) throw error;
        toast.success("Review logged successfully");
      }

      resetForm();
      await fetchReviews();
    } catch (error: any) {
      console.error("Error saving review:", error);
      toast.error(error.message || "Failed to save review");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (isBulkDelete) {
      await handleBulkDelete();
      return;
    }

    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("customer_ratings")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;
      toast.success("Review erased from chronicles");
      await fetchReviews();
      setSelectedIds(selectedIds.filter((id) => id !== deleteId));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to erase review");
    } finally {
      setDeleteId(null);
      setDeleteName(null);
    }
  }

  async function handleBulkDelete() {
    if (!selectedIds.length) return;

    try {
      const { error } = await supabase
        .from("customer_ratings")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(`${selectedIds.length} reviews purged`);
      await fetchReviews();
      setSelectedIds([]);
    } catch (error) {
      console.error("Error purging reviews:", error);
      toast.error("Mass purge failed");
    } finally {
      setDeleteId(null);
      setDeleteName(null);
      setIsBulkDelete(false);
    }
  }

  async function toggleDisplayOnLanding(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("customer_ratings")
        .update({
          display_on_landing: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      await fetchReviews();
      toast.success(currentStatus ? "Review sequestered" : "Review published");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Visibility toggle failed");
    }
  }

  const handleEdit = (review: any) => {
    setFormData({
      customerName: review.customer_name,
      customerEmail: review.customer_email || "",
      rating: review.rating,
      reviewText: review.review_text,
      displayOnLanding: review.display_on_landing,
    });
    setErrors({});
    setEditingId(review.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      rating: 5,
      reviewText: "",
      displayOnLanding: true,
    });
    setErrors({});
    setEditingId(null);
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.length === filteredReviews.length &&
      filteredReviews.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReviews.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.review_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tighter uppercase italic underline decoration-primary/50 underline-offset-8">
            Echoes of Delight
          </h2>
          <p className="text-foreground/60 mt-2 text-lg font-medium">
            Manage the voice of your satisfied clientele.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">
              {reviews.length} Testimonials
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Review Form - Horizontal Aesthetic */}
        <div className="xl:col-span-4">
          <div className="glass p-8 sticky top-24 border-white/20 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-primary/10" />

            <h3 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3 relative z-10">
              {editingId ? (
                <div className="p-2.5 bg-primary/20 rounded-2xl shadow-inner">
                  <Edit2 className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <div className="p-2.5 bg-primary/20 rounded-2xl shadow-inner">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
              )}
              {editingId ? "Refine Echo" : "Capture Sentiment"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                  Client Identity
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all font-bold text-base"
                  placeholder="e.g., Jean-Luc Picard"
                />
                {errors.customerName && (
                  <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                  Signal Channel (Email)
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  placeholder="captain@galaxy.net"
                />
                {errors.customerEmail && (
                  <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                    {errors.customerEmail}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                  Amplitude (Rating)
                </label>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: Number(e.target.value),
                      })
                    }
                    className="flex-1 accent-primary h-1.5 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                    <Star size={14} className="text-primary fill-primary" />
                    <span className="font-black text-primary text-lg">
                      {formData.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 ml-1">
                  The Message
                </label>
                <textarea
                  required
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewText: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none font-medium min-h-30"
                  placeholder="The voice of satisfaction..."
                />
                {errors.reviewText && (
                  <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                    {errors.reviewText}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 py-2 px-1">
                <div
                  className="relative inline-flex h-8 w-14 items-center rounded-full transition-all cursor-pointer group/toggle"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      displayOnLanding: !formData.displayOnLanding,
                    })
                  }
                >
                  <input
                    type="checkbox"
                    checked={formData.displayOnLanding}
                    className="sr-only"
                    readOnly
                  />
                  <span
                    className={`block h-8 w-14 rounded-full border-0 border-white/10 transition-colors shadow-inner ${
                      formData.displayOnLanding
                        ? "bg-linear-to-b from-secondary to-chart-5 "
                        : "bg-slate-300/50"
                    }`}
                  />
                  <span
                    className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-xl transition-transform duration-300 ${
                      formData.displayOnLanding
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  />
                </div>
                <label
                  className="text-sm font-black text-foreground/70 cursor-pointer select-none uppercase tracking-widest"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      displayOnLanding: !formData.displayOnLanding,
                    })
                  }
                >
                  Broadcast Live
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-16 bg-linear-to-b from-secondary to-chart-5  text-white font-black rounded-2xl hover:shadow-[0_12px_30px_rgba(245,158,11,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer uppercase tracking-[0.2em] text-xs"
                >
                  {isSubmitting
                    ? "Processing..."
                    : editingId
                    ? "Refine Sentiment"
                    : "Archive Voice"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 h-16 bg-white/5 text-foreground font-black rounded-2xl hover:bg-white/10 transition-all cursor-pointer uppercase tracking-widest text-[10px]"
                  >
                    Abort
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Reviews Table - Horizontal Grid Aesthetic */}
        <div className="xl:col-span-8 space-y-6 ">
          <div className="flex flex-col sm:flex-row justify-between items-center  gap-6 px-2">
            <div className="relative w-full sm:w-112.5 group ">
              <div className="absolute inset-y-0 left-0 pl-5  flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                placeholder="Search resonance (Name, Text, Email)..."
                className="w-full pl-14 pr-6 h-16 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-base transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {selectedIds.length > 0 && (
              <button
                onClick={() => {
                  setIsBulkDelete(true);
                  setDeleteId("BULK");
                  setDeleteName(`${selectedIds.length} testimonials`);
                }}
                className="flex items-center gap-3 h-16 px-8 bg-red-500 text-white font-black rounded-3xl hover:bg-red-600 hover:shadow-2xl hover:shadow-red-500/30 transition-all cursor-pointer animate-in zoom-in-95 uppercase tracking-widest text-xs"
              >
                <Trash size={18} />
                Purge Collective ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="glass overflow-hidden rounded-[3rem] border-white/10 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/2 border-b border-white/10">
                    <th className="p-8 w-20">
                      <button
                        onClick={toggleSelectAll}
                        className="text-foreground transition-all cursor-pointer hover:scale-125 active:scale-90"
                      >
                        {selectedIds.length === filteredReviews.length &&
                        filteredReviews.length > 0 ? (
                          <div className="p-2 bg-primary rounded-xl shadow-[0_4px_12px_rgba(var(--primary-rgb),0.4)]">
                            <CheckSquare className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="p-2 bg-white/10 rounded-xl hover:bg-white/20 shadow-inner">
                            <Square className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    </th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em] text-foreground/30">
                      The Client
                    </th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em] text-foreground/30">
                      The Sentiment
                    </th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em] text-foreground/30 text-center">
                      Presence
                    </th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.3em] text-foreground/30 text-right">
                      Ops
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/3">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <p className="font-black text-xs uppercase tracking-widest text-primary/60">
                            Scanning Chronicles...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                          <MessageSquare size={100} strokeWidth={1} />
                          <p className="text-3xl font-black uppercase tracking-[0.5em]">
                            No Resonance
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((review) => (
                      <tr
                        key={review.id}
                        className={`group hover:bg-white/5 transition-all duration-500 ${
                          selectedIds.includes(review.id) ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="p-8">
                          <button
                            onClick={() => toggleSelectOne(review.id)}
                            className="text-foreground transition-all cursor-pointer hover:scale-125 active:scale-90"
                          >
                            {selectedIds.includes(review.id) ? (
                              <div className="p-2 bg-primary rounded-xl shadow-lg ring-4 ring-primary/10">
                                <CheckSquare className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors shadow-inner">
                                <Square className="w-5 h-5" />
                              </div>
                            )}
                          </button>
                        </td>
                        <td className="p-8">
                          <div className="font-black text-xl text-foreground group-hover:text-primary transition-colors tracking-tight uppercase italic">
                            {review.customer_name}
                          </div>
                          <div className="text-xs font-mono text-foreground/30 flex items-center gap-2 mt-1.5 font-bold">
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                            {review.customer_email || "PRIVATE_IDENTITY"}
                          </div>
                        </td>
                        <td className="p-8 max-w-md">
                          <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? "text-primary fill-primary"
                                    : "text-white/10"
                                }
                              />
                            ))}
                          </div>
                          <p className="text-foreground/80 font-medium leading-relaxed italic line-clamp-3 group-hover:text-foreground transition-colors">
                            "{review.review_text}"
                          </p>
                        </td>
                        <td className="p-8 text-center">
                          <button
                            onClick={() =>
                              toggleDisplayOnLanding(
                                review.id,
                                review.display_on_landing
                              )
                            }
                            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-lg ${
                              review.display_on_landing
                                ? "bg-green-500/10 text-green-400 border-green-500/20 ring-4 ring-green-500/5 shadow-green-500/10"
                                : "bg-white/5 text-foreground/30 border-white/10"
                            }`}
                          >
                            {review.display_on_landing ? (
                              <Eye size={12} />
                            ) : (
                              <EyeOff size={12} />
                            )}
                            {review.display_on_landing
                              ? "Public"
                              : "Sequestered"}
                          </button>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex justify-end gap-3 translate-x-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                            <button
                              onClick={() => handleEdit(review)}
                              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-primary hover:text-white rounded-2xl text-foreground/50 transition-all cursor-pointer shadow-2xl ring-1 ring-white/10"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(review.id);
                                setDeleteName(review.customer_name);
                                setIsBulkDelete(false);
                              }}
                              className="w-12 h-12 flex items-center justify-center bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl text-red-500/60 transition-all cursor-pointer shadow-2xl ring-1 ring-red-500/20"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Delete Confirmation Modal */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="glass border-white/20 shadow-4xl max-w-xl p-12 rounded-[4rem] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <AlertDialogHeader>
            <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto ring-8 ring-red-500/5 animate-pulse">
              <Trash2 className="w-12 h-12 text-red-500" />
            </div>
            <AlertDialogTitle className="text-4xl font-black text-center text-foreground uppercase tracking-tighter">
              Execute Final Erase?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-foreground/60 text-xl py-6 leading-relaxed font-semibold">
              {isBulkDelete ? (
                <span>
                  You are about to initiate an irreversible memory wipe of{" "}
                  <strong>{deleteName}</strong>. This action will permanently
                  sever these sentiments from the database.
                </span>
              ) : (
                <div className="space-y-6">
                  <p>
                    Do you wish to permanently silence the echo from{" "}
                    <strong>{deleteName}</strong>?
                  </p>
                 
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-6 mt-12 relative z-10">
            <AlertDialogCancel className="w-full sm:flex-1 h-20 bg-slate-300/50 hover:text-black border-white/10 hover:bg-white/10 text-foreground font-black uppercase tracking-[0.3em] text-xs rounded-4xl cursor-pointer transition-all border-2">
              Abort Wipe
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="w-full sm:flex-1 h-20 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.3em] text-xs rounded-4xl border-none shadow-[0_15px_40px_rgba(220,38,38,0.4)] cursor-pointer hover:scale-[1.05] active:scale-95 transition-all"
            >
              Execute Purge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

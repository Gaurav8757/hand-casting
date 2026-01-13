"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  Trash,
  Plus,
  Search,
  UserPlus,
  Database,
  Info,
  ChevronRight,
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

export default function DataEntryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    email: "",
    address: "",
    inquiry_type: "general",
    message: "",
    advance_payment: 0,
    final_payment: 0,
    submission_status: "pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total automatically
  const totalAmount =
    Number(formData.advance_payment) + Number(formData.final_payment);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.mobile_number.trim())
      newErrors.mobile_number = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile_number.replace(/\D/g, ""))) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.advance_payment < 0)
      newErrors.advance_payment = "Cannot be negative";
    if (formData.final_payment < 0)
      newErrors.final_payment = "Cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please resolve validation errors");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payload to ensure correct types
      const payload = {
        name: formData.name,
        mobile_number: formData.mobile_number,
        email: formData.email,
        address: formData.address,
        inquiry_type: formData.inquiry_type,
        message: formData.message,
        advance_payment: Number(formData.advance_payment),
        final_payment: Number(formData.final_payment),
        total_amount: totalAmount,
        submission_status: formData.submission_status,
      };

      if (editingId) {
        const { error } = await supabase
          .from("customer_submissions")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Record refined successfully!");
      } else {
        const { error } = await supabase
          .from("customer_submissions")
          .insert(payload);

        if (error) throw error;
        toast.success("New entry committed to vault!");
      }

      resetForm();
      await fetchSubmissions();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to sync with vault");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (isBulkDelete) {
      await handleBulkDelete();
      return;
    }

    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("customer_submissions")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;
      toast.success("Entry purged from records");
      await fetchSubmissions();
      setSelectedIds(selectedIds.filter((sid) => sid !== deleteId));
    } catch (error) {
      toast.error("Failed to purge record");
    } finally {
      setDeleteId(null);
      setDeleteName(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;

    try {
      const { error } = await supabase
        .from("customer_submissions")
        .delete()
        .in("id", selectedIds);
      if (error) throw error;
      toast.success(`${selectedIds.length} records erased`);
      await fetchSubmissions();
      setSelectedIds([]);
    } catch (error) {
      toast.error("Failed to erase records");
    } finally {
      setDeleteId(null);
      setDeleteName(null);
      setIsBulkDelete(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || "",
      mobile_number: item.mobile_number || "",
      email: item.email || "",
      address: item.address || "",
      inquiry_type: item.inquiry_type || "general",
      message: item.message || "",
      advance_payment: Number(item.advance_payment) || 0,
      final_payment: Number(item.final_payment) || 0,
      submission_status: item.submission_status || "pending",
    });
    setErrors({});
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobile_number: "",
      email: "",
      address: "",
      inquiry_type: "general",
      message: "",
      advance_payment: 0,
      final_payment: 0,
      submission_status: "pending",
    });
    setErrors({});
    setEditingId(null);
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.length === filteredItems.length &&
      filteredItems.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile_number?.includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary/50 underline-offset-8">
            Data Vault
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Central command for customer intel and financials.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">
              {items.length} Records
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Form Container - Horizontal Aesthetic */}
        <div className="xl:col-span-5">
          <Card className="glass sticky top-24 border-white/20 shadow-4xl overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary to-accent" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                {editingId ? (
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Edit2 className="w-5 h-5 text-primary" />
                  </div>
                ) : (
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                )}
                {editingId ? "Refine Entry" : "Commit New Intel"}
              </CardTitle>
              <CardDescription className="font-medium">
                Securely log customer details and capital flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1"
                  >
                    Full Legal Name
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-primary/40 font-semibold text-base transition-all"
                    placeholder="e.g., Alexander Mercer"
                  />
                  {errors.name && (
                    <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1 animate-pulse">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="mobile"
                      className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1"
                    >
                      Contact No.
                    </Label>
                    <Input
                      id="mobile"
                      required
                      value={formData.mobile_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobile_number: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/30 font-medium"
                      placeholder="+91..."
                    />
                    {errors.mobile_number && (
                      <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                        {errors.mobile_number}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1"
                    >
                      Digital Addr.
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/30 font-medium"
                      placeholder="name@domain.com"
                    />
                    {errors.email && (
                      <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="address"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1"
                  >
                    Physical Location
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="bg-white/5 border-white/10 h-12 rounded-2xl focus:ring-primary/30 font-medium"
                    placeholder="Suite, Street, City..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">
                      Inquiry Vector
                    </Label>
                    <Select
                      value={formData.inquiry_type}
                      onValueChange={(val) =>
                        setFormData({ ...formData, inquiry_type: val })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 rounded-xl cursor-pointer font-medium hover:bg-white/10 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="general">General Intel</SelectItem>
                        <SelectItem value="couple">Couple Matrix</SelectItem>
                        <SelectItem value="family">Family Network</SelectItem>
                        <SelectItem value="baby">Mini Specimen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">
                      Project Phase
                    </Label>
                    <Select
                      value={formData.submission_status}
                      onValueChange={(val) =>
                        setFormData({ ...formData, submission_status: val })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-11 rounded-xl cursor-pointer font-medium hover:bg-white/10 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        <SelectItem value="pending">Awaiting Sync</SelectItem>
                        <SelectItem value="in-progress">
                          In Production
                        </SelectItem>
                        <SelectItem value="completed">Finalized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 p-5 bg-accent/5 rounded-3xl border border-secondary/80 mt-2 relative overflow-hidden shadow-inner">
                  <div className="grid grid-cols-2 gap-5 relative z-10">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="adv"
                        className="text-[10px] font-black uppercase tracking-widest text-accent ml-1"
                      >
                        Initialization Fee
                      </Label>
                      <Input
                        id="adv"
                        type="number"
                        value={formData.advance_payment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            advance_payment: Number(e.target.value),
                          })
                        }
                        className="bg-white/5 border-primary/20 h-10 rounded-xl focus:ring-primary/50 font-bold"
                      />
                      {errors.advance_payment && (
                        <p className="text-[9px] font-black uppercase text-red-500 ml-1 mt-1">
                          {errors.advance_payment}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="fin"
                        className="text-[10px] font-black uppercase tracking-widest text-accent ml-1"
                      >
                        Closure Settlement
                      </Label>
                      <Input
                        id="fin"
                        type="number"
                        value={formData.final_payment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            final_payment: Number(e.target.value),
                          })
                        }
                        className="bg-white/5 border-primary/20 h-10 rounded-xl focus:ring-primary/50 font-bold"
                      />
                      {errors.final_payment && (
                        <p className="text-[9px] font-black uppercase text-red-500 ml-1 mt-1">
                          {errors.final_payment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-primary/10 flex justify-between items-end px-1 relative z-10">
                    <span className="text-xs font-black text-accent uppercase tracking-tighter">
                      Liquid Capital Total
                    </span>
                    <span className="text-3xl font-black text-primary leading-none">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="msg"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1"
                  >
                    Operational Notes
                  </Label>
                  <Textarea
                    id="msg"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-white/5 border-white/10 resize-none min-h-20 rounded-2xl focus:ring-primary/30 font-medium"
                    placeholder="Encrypted notes for internal use..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 h-14 bg-primary hover:bg-primary/90 text-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer uppercase tracking-widest text-xs"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Syncing..."
                      : editingId
                      ? "Save Refinements"
                      : "Commit Record"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="h-14 px-6 border-white/10 bg-white/5 font-bold rounded-2xl hover:bg-white/10 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Table Container - Horizontal Grid Style */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center px-2">
            <div className="relative w-full sm:w-100 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Query database (Name, Email, Mobile)..."
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-3xl focus:ring-primary/40 font-medium text-base shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsBulkDelete(true);
                  setDeleteId("BULK");
                  setDeleteName(`${selectedIds.length} entries`);
                }}
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-red-900/40 animate-in zoom-in-95 cursor-pointer"
              >
                <Trash className="w-4 h-4 mr-2" />
                Purge Selected ({selectedIds.length})
              </Button>
            )}
          </div>

          <div className="glass rounded-[2.5rem] overflow-hidden border-white/10 shadow-5xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-6 w-16">
                      <button
                        onClick={toggleSelectAll}
                        className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95"
                      >
                        {selectedIds.length === filteredItems.length &&
                        filteredItems.length > 0 ? (
                          <div className="p-1.5 bg-primary rounded-lg shadow-lg">
                            <CheckSquare className="w-5 h-5 text-foreground" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20">
                            <Square className="w-5 h-5" />
                          </div>
                        )}
                      </button>
                    </th>
                    <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-foreground/40">
                      Subject Identification
                    </th>
                    <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-foreground/40">
                      Operation Class
                    </th>
                    <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-foreground/40">
                      Capital Stake
                    </th>
                    <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-foreground/40">
                      Sync Status
                    </th>
                    <th className="p-6 font-black text-xs uppercase tracking-[0.2em] text-foreground/40 text-right">
                      Ops
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-32 text-center">
                        <div className="flex flex-col items-center gap-6 opacity-30 grayscale">
                          <Database size={80} strokeWidth={1} />
                          <div>
                            <p className="text-2xl font-black uppercase tracking-[0.3em]">
                              Zero Results
                            </p>
                            <p className="text-sm font-medium mt-1">
                              Try another query or initialize a new record.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`group hover:bg-white/5 transition-all duration-300 ${
                          selectedIds.includes(item.id) ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="p-6">
                          <button
                            onClick={() => toggleSelectOne(item.id)}
                            className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95"
                          >
                            {selectedIds.includes(item.id) ? (
                              <div className="p-1.5 bg-primary rounded-lg shadow-md">
                                <CheckSquare className="w-5 h-5 text-foreground" />
                              </div>
                            ) : (
                              <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20">
                                <Square className="w-5 h-5" />
                              </div>
                            )}
                          </button>
                        </td>
                        <td className="p-6">
                          <div className="font-extrabold text-lg group-hover:text-primary transition-colors uppercase tracking-tight">
                            {item.name}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            {item.mobile_number}
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                            {item.inquiry_type}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="text-base font-black text-primary leading-none">
                            ₹{(item.total_amount || 0).toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">
                            In: {item.advance_payment}{" "}
                            <span className="text-white/10 mx-1">|</span> Out:{" "}
                            {item.final_payment}
                          </div>
                        </td>
                        <td className="p-6">
                          <span
                            className={`text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-2xl border shadow-lg ${
                              item.submission_status === "completed"
                                ? "bg-green-500/10 text-green-400 border-green-500/30"
                                : item.submission_status === "in-progress"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-500/5"
                                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                            }`}
                          >
                            {item.submission_status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <button
                              onClick={() => handleEdit(item)}
                              className="w-11 h-11 flex items-center justify-center bg-white/5 hover:bg-primary hover:text-foreground rounded-2xl text-muted-foreground transition-all cursor-pointer shadow-xl border border-white/5"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(item.id);
                                setDeleteName(item.name);
                                setIsBulkDelete(false);
                              }}
                              className="w-11 h-11 flex items-center justify-center bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl text-red-500/70 transition-all cursor-pointer shadow-xl border border-red-500/10"
                            >
                              <Trash2 size={16} />
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

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="glass border-white/20 shadow-4xl max-w-lg p-10 rounded-[3rem]">
          <AlertDialogHeader>
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            <AlertDialogTitle className="text-3xl font-black text-center text-foreground uppercase tracking-tight">
              Confirm Purge Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-foreground/60 text-lg py-4 leading-relaxed font-medium">
              {isBulkDelete ? (
                <span>
                  You are initiating a high-level purge of{" "}
                  <strong>{deleteName}</strong>. This operation is
                  non-recoverable. All associated transactional data will be
                  destroyed.
                </span>
              ) : (
                <div className="space-y-4">
                  <p>
                    System is requesting confirmation to erase entity:{" "}
                    <strong>{deleteName}</strong>.
                  </p>
                  <div className="bg-slate-900/50 p-6 rounded-4xl border border-white/10 space-y-2 text-left shadow-inner">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">
                      <Info size={12} /> Secure Hardware ID
                    </div>
                    <code className="text-xs text-primary/80 font-mono break-all font-bold block bg-black/20 p-3 rounded-xl">
                      {deleteId}
                    </code>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-4 mt-8">
            <AlertDialogCancel className="w-full sm:flex-1 h-16 bg-white/5 border-white/10 hover:bg-white/10 text-foreground font-black uppercase tracking-widest text-xs rounded-3xl cursor-pointer">
              Abort Purge
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="w-full sm:flex-1 h-16 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-3xl border-none shadow-[0_10px_30px_rgba(239,68,68,0.3)] cursor-pointer"
            >
              Execute Erase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

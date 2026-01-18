"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
    Edit2,
    Trash2,
    CheckSquare,
    Square,
    Trash,
    Plus,
    ImageIcon,
    Upload,
    Loader2,
    Package,
    ArrowUp,
    ArrowDown,
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

interface ProductFeature {
    id: string;
    title: string;
    description: string;
    detailed_description: string | null;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export default function ProductFeaturesManagement() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [features, setFeatures] = useState<ProductFeature[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        detailed_description: "",
        image_url: "",
        display_order: 0,
        is_active: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchFeatures();
    }, []);

    async function fetchFeatures() {
        try {
            const { data, error } = await supabase
                .from("product_features")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setFeatures(data || []);
        } catch (error) {
            console.error("Error fetching product features:", error);
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('product-features')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-features')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image_url: publicUrl
            }));

        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                detailed_description: formData.detailed_description || null,
                image_url: formData.image_url || null,
                display_order: formData.display_order,
                is_active: formData.is_active,
            };

            if (editingId) {
                const { data, error } = await supabase
                    .from("product_features")
                    .update(payload)
                    .eq("id", editingId)
                    .select();

                if (error) {
                    console.error("Supabase UPDATE error:", {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code,
                    });
                    throw new Error(error.message || "Failed to update feature");
                }
                console.log("Update successful:", data);
            } else {
                const { data, error } = await supabase
                    .from("product_features")
                    .insert(payload)
                    .select();

                if (error) {
                    console.error("Supabase INSERT error:", {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code,
                    });
                    throw new Error(error.message || "Failed to create feature");
                }
                console.log("Insert successful:", data);
            }

            setFormData({
                title: "",
                description: "",
                detailed_description: "",
                image_url: "",
                display_order: 0,
                is_active: true,
            });
            setErrors({});
            setEditingId(null);
            await fetchFeatures();
        } catch (error: any) {
            console.error("Error saving feature:", error);
            alert(error.message || "Error saving feature");
        } finally {
            setLoading(false);
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
                .from("product_features")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;
            await fetchFeatures();
            setSelectedIds(selectedIds.filter((id) => id !== deleteId));
        } catch (error) {
            console.error("Error deleting feature:", error);
            alert("Error deleting feature");
        } finally {
            setDeleteId(null);
            setDeleteName(null);
        }
    }

    async function handleBulkDelete() {
        if (!selectedIds.length) return;

        try {
            const { error } = await supabase
                .from("product_features")
                .delete()
                .in("id", selectedIds);

            if (error) throw error;
            await fetchFeatures();
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting features:", error);
            alert("Error deleting features");
        } finally {
            setDeleteId(null);
            setDeleteName(null);
            setIsBulkDelete(false);
        }
    }

    function handleEdit(feature: ProductFeature) {
        setFormData({
            title: feature.title,
            description: feature.description,
            detailed_description: feature.detailed_description || "",
            image_url: feature.image_url || "",
            display_order: feature.display_order,
            is_active: feature.is_active,
        });
        setErrors({});
        setEditingId(feature.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleReorder(id: string, direction: 'up' | 'down') {
        const currentIndex = features.findIndex(f => f.id === id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= features.length) return;

        const newFeatures = [...features];
        [newFeatures[currentIndex], newFeatures[targetIndex]] = [newFeatures[targetIndex], newFeatures[currentIndex]];

        // Update display_order for both items
        try {
            await supabase
                .from("product_features")
                .update({ display_order: targetIndex })
                .eq("id", features[currentIndex].id);

            await supabase
                .from("product_features")
                .update({ display_order: currentIndex })
                .eq("id", features[targetIndex].id);

            await fetchFeatures();
        } catch (error) {
            console.error("Error reordering:", error);
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === features.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(features.map((feature) => feature.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((featureId) => featureId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
                        Product Features Manager
                    </h2>
                    <p className="text-foreground/60 text-lg">
                        Manage the "What's Inside" section features.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <Package className="w-5 h-5 text-accent" />
                        <span className="font-bold text-accent">
                            {features.length} Features
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Add/Edit Form */}
                <div className="xl:col-span-5">
                    <div className="glass p-8 sticky top-24 border-white/20 shadow-2xl overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

                        <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 relative z-10">
                            {editingId ? (
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Edit2 className="w-6 h-6 text-accent" />
                                </div>
                            ) : (
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Plus className="w-6 h-6 text-accent" />
                                </div>
                            )}
                            {editingId ? "Edit Feature" : "New Feature"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            {/* Image Upload */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    <Upload size={12} /> Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                                {uploading && (
                                    <div className="text-xs text-accent font-bold flex items-center gap-2 mt-2">
                                        <Loader2 className="animate-spin w-3 h-3" /> Uploading image...
                                    </div>
                                )}
                                {formData.image_url && (
                                    <div className="mt-2">
                                        <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-white/10" />
                                    </div>
                                )}
                            </div>

                            {/* Image URL */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    <ImageIcon size={12} /> Image URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) =>
                                        setFormData({ ...formData, image_url: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="Paste URL or upload file above"
                                />
                            </div>

                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="e.g., 1800g Molding Powder"
                                />
                                {errors.title && (
                                    <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">
                                    Short Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium resize-none"
                                    placeholder="Brief description for tab"
                                />
                                {errors.description && (
                                    <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Detailed Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">
                                    Detailed Description
                                </label>
                                <textarea
                                    value={formData.detailed_description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, detailed_description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium resize-none"
                                    placeholder="Detailed description for content panel"
                                />
                            </div>

                            {/* Display Order */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) =>
                                        setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="0"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData({ ...formData, is_active: e.target.checked })
                                    }
                                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-2 focus:ring-primary/40"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
                                    Active (visible on frontend)
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="flex-1 px-6 py-4 bg-linear-to-b from-secondary to-chart-5 hover:bg-primary/90 text-white font-black rounded-2xl hover:shadow-[0_8px_20px_rgba(var(--primary-rgb),0.4)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:transform-none cursor-pointer uppercase tracking-widest text-xs"
                                >
                                    {loading
                                        ? "Processing..."
                                        : editingId
                                            ? "Save Changes"
                                            : "Add Feature"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({
                                                title: "",
                                                description: "",
                                                detailed_description: "",
                                                image_url: "",
                                                display_order: 0,
                                                is_active: true,
                                            });
                                        }}
                                        className="px-6 py-4 bg-white/5 text-foreground font-bold rounded-2xl hover:bg-white/10 transition-all cursor-pointer uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Features List Table */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            All Features
                            <span className="text-sm font-normal text-foreground/40 px-2 py-0.5 bg-white/5 rounded-full">
                                {features.length} items
                            </span>
                        </h3>
                        {selectedIds.length > 0 && (
                            <button
                                onClick={() => {
                                    setIsBulkDelete(true);
                                    setDeleteId("BULK");
                                    setDeleteName(`${selectedIds.length} items`);
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer animate-in fade-in slide-in-from-right-4"
                            >
                                <Trash size={18} />
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                    </div>

                    <div className="glass overflow-hidden rounded-4xl border-white/20 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-6 w-14">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95"
                                            >
                                                {selectedIds.length === features.length &&
                                                    features.length > 0 ? (
                                                    <div className="p-1.5 bg-primary rounded-md">
                                                        <CheckSquare className="w-5 h-5 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 bg-white/10 rounded-md">
                                                        <Square className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </button>
                                        </th>
                                        <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50">
                                            Order
                                        </th>
                                        <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50">
                                            Preview
                                        </th>
                                        <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50">
                                            Details
                                        </th>
                                        <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {features.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4 text-foreground/30">
                                                    <Package size={64} strokeWidth={1} />
                                                    <p className="text-xl font-medium">
                                                        No features yet.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        features.map((feature, index) => (
                                            <tr
                                                key={feature.id}
                                                className={`group hover:bg-white/5 transition-all duration-300 ${selectedIds.includes(feature.id) ? "bg-primary/5" : ""
                                                    }`}
                                            >
                                                <td className="p-6">
                                                    <button
                                                        onClick={() => toggleSelectOne(feature.id)}
                                                        className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95"
                                                    >
                                                        {selectedIds.includes(feature.id) ? (
                                                            <div className="p-1.5 bg-primary rounded-md">
                                                                <CheckSquare className="w-5 h-5 text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
                                                                <Square className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-bold text-foreground">{feature.display_order}</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleReorder(feature.id, 'up')}
                                                                disabled={index === 0}
                                                                className="p-1 bg-white/10 rounded hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <ArrowUp size={12} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReorder(feature.id, 'down')}
                                                                disabled={index === features.length - 1}
                                                                className="p-1 bg-white/10 rounded hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <ArrowDown size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="relative w-24 h-16 shrink-0 bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {feature.image_url ? (
                                                            <img
                                                                src={feature.image_url}
                                                                alt={feature.title}
                                                                className="w-full h-full object-cover rounded-lg border-2 border-white/10 group-hover:border-primary/50 transition-all group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="text-white/30" size={24} />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {feature.title}
                                                    </div>
                                                    <div className="text-sm text-foreground/40 font-medium truncate max-w-[300px]">
                                                        {feature.description}
                                                    </div>
                                                    <div className="mt-1 flex gap-2">
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${feature.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                            {feature.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                        <button
                                                            onClick={() => handleEdit(feature)}
                                                            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-primary hover:text-white text-foreground/70 rounded-xl transition-all cursor-pointer shadow-lg"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteId(feature.id);
                                                                setDeleteName(feature.title);
                                                                setIsBulkDelete(false);
                                                            }}
                                                            className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all cursor-pointer shadow-lg"
                                                            title="Delete"
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

            {/* Delete Confirmation Modal */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent className="glass border-white/20 shadow-4xl max-w-md p-8 rounded-4xl">
                    <AlertDialogHeader>
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black text-foreground">
                            {isBulkDelete ? "Mass Delete" : "Delete Feature?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-foreground/60 text-base py-2">
                            {isBulkDelete ? (
                                <span>
                                    You are about to permanently delete{" "}
                                    <strong>{deleteName}</strong>. This
                                    action is irreversible.
                                </span>
                            ) : (
                                <div className="space-y-3">
                                    <p>
                                        This will permanently erase <strong>{deleteName}</strong>{" "}
                                        from the product features.
                                    </p>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 mt-6">
                        <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 hover:bg-white text-foreground hover:text-foreground/80 font-bold py-6 rounded-2xl cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-2xl border-none shadow-lg shadow-red-500/20 cursor-pointer"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

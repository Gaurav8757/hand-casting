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
    Info,
    Link as LinkIcon,
    Type,
    Upload,
    Loader2,
    Video,
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

export default function CarouselManagement() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteName, setDeleteName] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const [formData, setFormData] = useState({
        src: "",
        alt: "",
        slug: "",
        media_type: "image", // 'image' | 'video'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchCarouselItems();
    }, []);

    async function fetchCarouselItems() {
        try {
            const { data, error } = await supabase
                .from("carousel_items")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error("Error fetching carousel items:", error);
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.src.trim()) newErrors.src = "Image/Video URL is required";

        if (!formData.alt.trim()) newErrors.alt = "Alt/Title text is required";
        if (!formData.slug.trim()) newErrors.slug = "Link/Slug is required";

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
            // Determine media type
            const isVideo = file.type.startsWith('video/');
            const mediaType = isVideo ? 'video' : 'image';

            const { error: uploadError } = await supabase.storage
                .from('carousel-media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('carousel-media')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                src: publicUrl,
                media_type: mediaType
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
                src: formData.src,
                alt: formData.alt,
                slug: formData.slug,
                media_type: formData.media_type,
            };

            if (editingId) {
                const { error } = await supabase
                    .from("carousel_items")
                    .update(payload)
                    .eq("id", editingId);

                if (error) throw error;
            } else {
                const { error } = await supabase.from("carousel_items").insert(payload);

                if (error) throw error;
            }

            setFormData({
                src: "",
                alt: "",
                slug: "",
                media_type: "image",
            });
            setErrors({});
            setEditingId(null);
            await fetchCarouselItems();
        } catch (error: any) {
            console.error("Error saving carousel item:", error);
            alert(error.message || "Error saving carousel item");
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
                .from("carousel_items")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;
            await fetchCarouselItems();
            setSelectedIds(selectedIds.filter((id) => id !== deleteId));
        } catch (error) {
            console.error("Error deleting carousel item:", error);
            alert("Error deleting item");
        } finally {
            setDeleteId(null);
            setDeleteName(null);
        }
    }

    async function handleBulkDelete() {
        if (!selectedIds.length) return;

        try {
            const { error } = await supabase
                .from("carousel_items")
                .delete()
                .in("id", selectedIds);

            if (error) throw error;
            await fetchCarouselItems();
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting carousel items:", error);
            alert("Error deleting items");
        } finally {
            setDeleteId(null);
            setDeleteName(null);
            setIsBulkDelete(false);
        }
    }

    function handleEdit(item: any) {
        setFormData({
            src: item.src,
            alt: item.alt,
            slug: item.slug,
            media_type: item.media_type || "image",
        });
        setErrors({});
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((item) => item.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
                        Carousel Manager
                    </h2>
                    <p className="text-foreground/60 text-lg">
                        Manage the hero section carousel images.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-accent" />
                        <span className="font-bold text-accent">
                            {items.length} Slides
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
                            {editingId ? "Edit Slide" : "New Slide"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

                            {/* Media Upload */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    <Upload size={12} /> Upload Media
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileUpload}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    />
                                </div>
                                {uploading && (
                                    <div className="text-xs text-accent font-bold flex items-center gap-2 mt-2">
                                        <Loader2 className="animate-spin w-3 h-3" /> Uploading media...
                                    </div>
                                )}
                            </div>

                            {/* Image URL (Pre-filled by upload or manual) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    <ImageIcon size={12} /> Image/Video URL
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.src}
                                    onChange={(e) =>
                                        setFormData({ ...formData, src: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="Paste URL or upload file above"
                                />
                                {errors.src && (
                                    <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                                        {errors.src}
                                    </p>
                                )}
                            </div>

                            {/* Media Type Indicator (Read Only) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    Detected Type
                                </label>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                    {formData.media_type === 'video' ? <Video size={16} className="text-accent" /> : <ImageIcon size={16} className="text-accent" />}
                                    <span className="text-sm font-bold uppercase">{formData.media_type}</span>
                                </div>
                            </div>

                            {/* Alt Text (Title) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    <Type size={12} /> Title / Alt Text
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.alt}
                                    onChange={(e) =>
                                        setFormData({ ...formData, alt: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all font-medium"
                                    placeholder="e.g., Premium Kit"
                                />
                                {errors.alt && (
                                    <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                                        {errors.alt}
                                    </p>
                                )}
                            </div>

                            {/* Slug / Link */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1 flex items-center gap-1">
                                    <LinkIcon size={12} /> Target Link (Slug)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                                    placeholder="e.g., /premium-kit or https://..."
                                />
                                {errors.slug && (
                                    <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">
                                        {errors.slug}
                                    </p>
                                )}
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
                                            : "Add Slide"}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({
                                                src: "",
                                                alt: "",
                                                slug: "",
                                                media_type: "image",
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

                {/* Carousel Items List Table */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            Active Slides
                            <span className="text-sm font-normal text-foreground/40 px-2 py-0.5 bg-white/5 rounded-full">
                                {items.length} items
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
                                                {selectedIds.length === items.length &&
                                                    items.length > 0 ? (
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
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4 text-foreground/30">
                                                    <ImageIcon size={64} strokeWidth={1} />
                                                    <p className="text-xl font-medium">
                                                        No slides yet.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`group hover:bg-white/5 transition-all duration-300 ${selectedIds.includes(item.id) ? "bg-primary/5" : ""
                                                    }`}
                                            >
                                                <td className="p-6">
                                                    <button
                                                        onClick={() => toggleSelectOne(item.id)}
                                                        className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95"
                                                    >
                                                        {selectedIds.includes(item.id) ? (
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
                                                    <div className="relative w-24 h-16 shrink-0 bg-black/20 rounded-lg overflow-hidden flex items-center justify-center">
                                                        {item.media_type === 'video' ? (
                                                            <Video className="text-white/50" />
                                                        ) : (
                                                            <img
                                                                src={item.src || "/placeholder.svg"}
                                                                alt={item.alt}
                                                                className="w-full h-full object-cover rounded-lg border-2 border-white/10 group-hover:border-primary/50 transition-all group-hover:scale-105"
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {item.alt}
                                                    </div>
                                                    <div className="text-sm text-foreground/40 font-medium truncate max-w-[200px]">
                                                        {item.slug}
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-white/10 rounded text-foreground/60">
                                                            {item.media_type || 'image'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-primary hover:text-white text-foreground/70 rounded-xl transition-all cursor-pointer shadow-lg"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeleteId(item.id);
                                                                setDeleteName(item.alt);
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
                            {isBulkDelete ? "Mass Delete" : "Delete Slide?"}
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
                                        from the carousel.
                                    </p>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                                            <Info size={10} /> ID
                                        </div>
                                        <code className="text-[11px] text-amber-500 font-mono break-all">
                                            {deleteId}
                                        </code>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 mt-6">
                        <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-foreground font-bold py-6 rounded-2xl cursor-pointer">
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

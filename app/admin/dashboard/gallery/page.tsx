"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Star, Edit2, Trash2, CheckSquare, Square, Trash, Plus, ImageIcon, Info } from "lucide-react"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export default function GalleryManagement() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState<string | null>(null)
  const [isBulkDelete, setIsBulkDelete] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    imageUrl: "",
    rating: 5,
    customerName: "",
    customerReview: "",
    displayOnLanding: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  async function fetchGalleryItems() {
    try {
      const { data, error } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching gallery items:", error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required"
    else if (!/^https?:\/\/.+/.test(formData.imageUrl)) newErrors.imageUrl = "Please enter a valid URL"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        image_url: formData.imageUrl,
        rating: formData.rating,
        customer_name: formData.customerName,
        customer_review: formData.customerReview,
        display_on_landing: formData.displayOnLanding,
      }

      if (editingId) {
        const { error } = await supabase
          .from("gallery_items")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("gallery_items").insert(payload)

        if (error) throw error
      }

      setFormData({
        title: "",
        category: "",
        imageUrl: "",
        rating: 5,
        customerName: "",
        customerReview: "",
        displayOnLanding: true,
      })
      setErrors({})
      setEditingId(null)
      await fetchGalleryItems()
    } catch (error: any) {
      console.error("Error saving gallery item:", error)
      alert(error.message || "Error saving gallery item")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteConfirm() {
    if (isBulkDelete) {
      await handleBulkDelete()
      return
    }

    if (!deleteId) return

    try {
      const { error } = await supabase.from("gallery_items").delete().eq("id", deleteId)

      if (error) throw error
      await fetchGalleryItems()
      setSelectedIds(selectedIds.filter(id => id !== deleteId))
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      alert("Error deleting item")
    } finally {
      setDeleteId(null)
      setDeleteName(null)
    }
  }

  async function handleBulkDelete() {
    if (!selectedIds.length) return

    try {
      const { error } = await supabase.from("gallery_items").delete().in("id", selectedIds)

      if (error) throw error
      await fetchGalleryItems()
      setSelectedIds([])
    } catch (error) {
      console.error("Error deleting gallery items:", error)
      alert("Error deleting items")
    } finally {
      setDeleteId(null)
      setDeleteName(null)
      setIsBulkDelete(false)
    }
  }

  function handleEdit(item: any) {
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.image_url,
      rating: item.rating,
      customerName: item.customer_name || "",
      customerReview: item.customer_review || "",
      displayOnLanding: item.display_on_landing,
    })
    setErrors({})
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((item) => item.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Gallery Studio</h2>
          <p className="text-foreground/60 text-lg">Curate your premium hand casting portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-amber-500">{items.length} Masterpieces</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Add/Edit Form - Attractive Horizontal Placement */}
        <div className="xl:col-span-4">
          <div className="glass p-8 sticky top-24 border-white/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
            
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 relative z-10">
              {editingId ? (
                <div className="p-2 bg-amber-500/20 rounded-lg"><Edit2 className="w-6 h-6 text-amber-500" /></div>
              ) : (
                <div className="p-2 bg-amber-500/20 rounded-lg"><Plus className="w-6 h-6 text-amber-500" /></div>
              )}
              {editingId ? "Refine Creation" : "New Masterpiece"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white/10 transition-all font-medium"
                   placeholder="e.g., Eternal Bond Casting"
                />
                {errors.title && <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all cursor-pointer font-medium appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select...</option>
                    <option value="couples" className="bg-slate-900">Couples</option>
                    <option value="families" className="bg-slate-900">Families</option>
                    <option value="babies" className="bg-slate-900">Baby Molds</option>
                    <option value="custom" className="bg-slate-900">Custom</option>
                  </select>
                  {errors.category && <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">{errors.category}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium"
                  placeholder="Paste high-res image link"
                />
                {errors.imageUrl && <p className="text-[10px] font-black uppercase text-red-500 ml-1 mt-1">{errors.imageUrl}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">Client Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-medium"
                  placeholder="e.g., Emma & James"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/50 ml-1">Client Story</label>
                <textarea
                  value={formData.customerReview}
                  onChange={(e) => setFormData({ ...formData, customerReview: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-none font-medium"
                  rows={2}
                  placeholder="Short testimonial or story..."
                />
              </div>

              <div className="flex items-center gap-4 py-2 px-1">
                <div 
                  className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer"
                  onClick={() => setFormData({ ...formData, displayOnLanding: !formData.displayOnLanding })}
                >
                  <input type="checkbox" checked={formData.displayOnLanding} className="sr-only" readOnly />
                  <span className={`block h-7 w-12 rounded-full border-2 border-white/10 transition-colors ${formData.displayOnLanding ? 'bg-amber-500' : 'bg-white/10'}`} />
                  <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${formData.displayOnLanding ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <label className="text-sm font-bold text-foreground/80 cursor-pointer select-none" onClick={() => setFormData({ ...formData, displayOnLanding: !formData.displayOnLanding })}>
                  Visible on Showroom
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black rounded-2xl hover:shadow-[0_8px_20px_rgba(245,158,11,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:transform-none cursor-pointer uppercase tracking-widest text-xs"
                >
                  {loading ? "Processing..." : editingId ? "Save Changes" : "Create Item"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        title: "", category: "", imageUrl: "", rating: 5, customerName: "", customerReview: "", displayOnLanding: true,
                      })
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

        {/* Gallery Items List Table - Attractive Horizontal */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              Showroom Inventory
              <span className="text-sm font-normal text-foreground/40 px-2 py-0.5 bg-white/5 rounded-full">{items.length} items total</span>
            </h3>
            {selectedIds.length > 0 && (
              <button
                onClick={() => {
                   setIsBulkDelete(true)
                   setDeleteId("BULK")
                   setDeleteName(`${selectedIds.length} items`)
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer animate-in fade-in slide-in-from-right-4"
              >
                <Trash size={18} />
                Purge Selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="glass overflow-hidden rounded-[2rem] border-white/20 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-6 w-14">
                      <button onClick={toggleSelectAll} className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95">
                        {selectedIds.length === items.length && items.length > 0 ? (
                          <div className="p-1.5 bg-amber-500 rounded-md"><CheckSquare className="w-5 h-5 text-white" /></div>
                        ) : (
                          <div className="p-1.5 bg-white/10 rounded-md"><Square className="w-5 h-5" /></div>
                        )}
                      </button>
                    </th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50">Masterpiece Details</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50">Classification</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50 text-center">Exposure</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-foreground/50 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-foreground/30">
                           <ImageIcon size={64} strokeWidth={1} />
                           <p className="text-xl font-medium">Your showroom is currently empty.</p>
                           <p className="text-sm max-w-sm mx-auto">Fill it with stunning 3D hand casting artwork to impress your visitors.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className={`group hover:bg-white/5 transition-all duration-300 ${selectedIds.includes(item.id) ? 'bg-amber-500/5' : ''}`}>
                        <td className="p-6">
                          <button onClick={() => toggleSelectOne(item.id)} className="text-foreground transition-all cursor-pointer hover:scale-110 active:scale-95">
                            {selectedIds.includes(item.id) ? (
                              <div className="p-1.5 bg-amber-500 rounded-md"><CheckSquare className="w-5 h-5 text-white" /></div>
                            ) : (
                              <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors"><Square className="w-5 h-5" /></div>
                            )}
                          </button>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-5">
                            <div className="relative w-16 h-16 flex-shrink-0">
                               <img
                                 src={item.image_url || "/placeholder.svg"}
                                 alt={item.title}
                                 className="w-full h-full object-cover rounded-2xl border-2 border-white/10 group-hover:border-amber-500/50 transition-all group-hover:scale-105"
                               />
                               <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-1.5 rounded-full border-2 border-slate-900 flex items-center gap-0.5">
                                 <Star size={8} className="fill-white" />
                                 {item.rating}
                               </div>
                            </div>
                            <div>
                              <div className="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors">{item.title}</div>
                              <div className="text-sm text-foreground/40 font-medium">Recorded with client: {item.customer_name || "Anonymous"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                           <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-tighter text-foreground/70 group-hover:bg-white/10 transition-colors">
                            {item.category}
                           </span>
                        </td>
                        <td className="p-6 text-center">
                          <span
                            className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                              item.display_on_landing 
                                ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                                : "bg-red-500/10 text-red-500 border-red-500/30"
                            }`}
                          >
                            {item.display_on_landing ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <button
                              onClick={() => handleEdit(item)}
                              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-500 hover:text-white text-foreground/70 rounded-xl transition-all cursor-pointer shadow-lg"
                              title="Refine Details"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(item.id)
                                setDeleteName(item.title)
                                setIsBulkDelete(false)
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all cursor-pointer shadow-lg"
                              title="Discard Creation"
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
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="glass border-white/20 shadow-4xl max-w-md p-8 rounded-[2rem]">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0">
               <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-foreground">
               {isBulkDelete ? "Mass Eviction" : "Discard Masterpiece?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/60 text-base py-2">
              {isBulkDelete ? (
                <span>You are about to permanently delete <strong>{deleteName}</strong> from your collection. This action is catastrophic and irreversible.</span>
              ) : (
                <div className="space-y-3">
                   <p>This will permanently erase <strong>{deleteName}</strong> from your showroom database.</p>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/40 uppercase tracking-widest"><Info size={10}/> Unique Identifier</div>
                      <code className="text-[11px] text-amber-500 font-mono break-all">{deleteId}</code>
                   </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-foreground font-bold py-6 rounded-2xl cursor-pointer">
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-2xl border-none shadow-lg shadow-red-500/20 cursor-pointer"
            >
              Yes, Destroy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

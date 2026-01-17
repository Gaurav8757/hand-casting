"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, X, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  tags: string[]
  is_active: boolean
  author: string
  created_at: string
  updated_at: string
}

export default function BlogsManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    tags: "",
    is_active: true,
    author: "Admin",
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      const data = await response.json()
      setBlogs(data.blogs || [])
    } catch (error) {
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    try {
      const response = await fetch("/api/admin/blogs/upload", {
        method: "POST",
        body: uploadFormData,
      })
      
      const data = await response.json()

      if (response.ok) {
        setFormData((prev) => ({ ...prev, featured_image: data.url }))
        toast.success("Image uploaded successfully")
      } else {
        toast.error(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const blogData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      ...(editingBlog && { id: editingBlog.id }),
    }

    try {
      const response = await fetch("/api/admin/blogs", {
        method: editingBlog ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(editingBlog ? "Blog updated" : "Blog created")
        setShowModal(false)
        resetForm()
        fetchBlogs()
      } else {
        toast.error(data.error || "Operation failed")
      }
    } catch (error) {
      toast.error("Failed to save blog")
    }
  }

  const openDeleteModal = (blog: Blog) => {
    setDeletingBlog(blog)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingBlog) return

    try {
      const response = await fetch(`/api/admin/blogs?id=${deletingBlog.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Blog deleted successfully")
        setShowDeleteModal(false)
        setDeletingBlog(null)
        fetchBlogs()
      } else {
        toast.error("Failed to delete blog")
      }
    } catch (error) {
      toast.error("Failed to delete blog")
    }
  }

  const toggleActive = async (blog: Blog) => {
    // Optimistic update - update UI immediately
    setBlogs(prevBlogs => 
      prevBlogs.map(b => 
        b.id === blog.id ? { ...b, is_active: !b.is_active } : b
      )
    )

    try {
      const response = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blog, is_active: !blog.is_active }),
      })

      if (response.ok) {
        toast.success(blog.is_active ? "Blog hidden" : "Blog activated")
        // Fetch again to ensure sync with server
        fetchBlogs()
      } else {
        // Revert on error
        setBlogs(prevBlogs => 
          prevBlogs.map(b => 
            b.id === blog.id ? { ...b, is_active: blog.is_active } : b
          )
        )
        toast.error("Failed to update blog")
      }
    } catch (error) {
      // Revert on error
      setBlogs(prevBlogs => 
        prevBlogs.map(b => 
          b.id === blog.id ? { ...b, is_active: blog.is_active } : b
        )
      )
      toast.error("Failed to update blog")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image: "",
      tags: "",
      is_active: true,
      author: "Admin",
    })
    setEditingBlog(null)
  }

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featured_image: blog.featured_image || "",
      tags: blog.tags.join(", "),
      is_active: blog.is_active,
      author: blog.author,
    })
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Add New Blog
        </button>
      </div>

      {/* Blogs Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tags</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <ImageIcon size={20} className="text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-foreground">{blog.title}</div>
                        <div className="text-sm text-muted-foreground">/{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {blog.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(blog)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title={blog.is_active ? "Hide" : "Show"}
                      >
                        {blog.is_active ? (
                          <Eye size={18} className="text-green-600" />
                        ) : (
                          <EyeOff size={18} className="text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(blog)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                {editingBlog ? "Edit Blog" : "Create New Blog"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Slug (auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="blog-url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  rows={3}
                  placeholder="Short description for preview"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  rows={10}
                  placeholder="Write your blog content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Featured Image
                </label>
                <div className="space-y-3">
                  {formData.featured_image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                      <img
                        src={formData.featured_image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = ""
                          toast.error("Failed to load image")
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, featured_image: "" })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer bg-muted/20">
                      <ImageIcon size={20} />
                      <span className="text-sm font-medium">{uploading ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <div className="text-center text-xs text-muted-foreground">OR</div>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) =>
                      setFormData({ ...formData, featured_image: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Paste image URL here"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="handcasting, diy, family"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-foreground">
                  Publish immediately (Active)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                >
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBlog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Delete Blog?</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                You are about to delete: <span className="font-semibold">"{deletingBlog.title}"</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletingBlog(null)
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Delete Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

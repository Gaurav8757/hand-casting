"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { MultipleSelector, type Option } from "@/components/ui/multiple-selector";
import { Label } from "@/components/ui/label";

interface ProductFeature {
  id: string;
  title: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    inquiryType: "general-question",
    serviceTypes: [] as string[],
    message: "",
    commitmentAccepted: false,
  });
  const [productFeatures, setProductFeatures] = useState<ProductFeature[]>([]);
  const [selectedServices, setSelectedServices] = useState<Option[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductFeatures();
  }, []);

  async function fetchProductFeatures() {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from("product_features")
        .select("id, title")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProductFeatures(data || []);
    } catch (error) {
      console.error("Error fetching product features:", error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleServiceChange = (options: Option[]) => {
    setSelectedServices(options);
    setFormData((prev) => ({
      ...prev,
      serviceTypes: options.map(opt => opt.value)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.mobileNumber.trim() &&
      !/^\d{10,15}$/.test(formData.mobileNumber.replace(/\D/g, ""))
    ) {
      newErrors.mobileNumber =
        "Please enter a valid mobile number (10+ digits)";
    }

    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Please provide a bit more detail (min 10 chars)";

    if (!formData.commitmentAccepted) {
      newErrors.commitmentAccepted = "Please accept the commitment to proceed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/customer/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          inquiryType: formData.inquiryType,
          serviceTypes: formData.serviceTypes,
          message: formData.message,
          commitmentAccepted: formData.commitmentAccepted,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to submit form");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        address: "",
        inquiryType: "general-question",
        serviceTypes: [],
        message: "",
        commitmentAccepted: false,
      });
      setErrors({});

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass p-8 flex items-center justify-center min-h-96 animate-in fade-in scale-95 duration-300">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="text-green-500 animate-bounce" size={64} />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Thanks for reaching out!
          </h3>
          <p className="text-foreground/70">
            Sayan or Sujay will get in touch with you personally within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-8 space-y-6 shadow-2xl" id="contact-form">
      <h3 className="text-2xl font-bold text-foreground">Send us a Message</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="+91 70030 20846"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
          />
          {errors.mobileNumber && (
            <p className="text-xs text-red-400 mt-1 font-medium">
              {errors.mobileNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your shipping address"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Inquiry Type
          </label>
          <select
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
          >
            <option value="general-question">General Question</option>
            <option value="product-support">Product Support</option>
            <option value="shipping-question">Shipping Question</option>
            <option value="bulk-order">Bulk Order</option>
            <option value="custom-engraving">Custom Engraving</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Service Type Multi-Select */}
        <div className="space-y-2">
          <Label htmlFor="service-types">Service Type (Select Multiple)</Label>
          <MultipleSelector
            value={selectedServices}
            defaultOptions={productFeatures.map(f => ({ value: f.title, label: f.title }))}
            onChange={handleServiceChange}
            placeholder="Select services you're interested in..."
            emptyIndicator={<p className="text-center text-sm text-foreground/50">No services available</p>}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Tell us how we can help..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent focus:bg-white/20 transition-all resize-none"
          />
          {errors.message && (
            <p className="text-xs text-red-400 mt-1 font-medium">
              {errors.message}
            </p>
          )}
        </div>

        {/* Commitment Checkbox */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="commitmentAccepted"
              checked={formData.commitmentAccepted}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-primary focus:ring-2 focus:ring-primary/40 cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-semibold">I understand: </span>
                Don't worry, your memories are in safe hands. Once you submit this,
                <span className="font-bold text-accent"> Sayan or Sujay </span>
                will get in touch with you personally within 24 hours to finalize the details.
              </p>
            </div>
          </label>
          {errors.commitmentAccepted && (
            <p className="text-xs text-red-400 mt-2 font-medium ml-8">
              {errors.commitmentAccepted}
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle size={20} className="text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary text-foreground font-semibold rounded-lg hover:shadow-lg active:scale-95 disabled:opacity-70 transition-all duration-200"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

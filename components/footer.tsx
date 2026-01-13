"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/castkeepofficial",
      icon: Facebook,
      color: "hover:text-primary",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/castkeepofficial",
      icon: Instagram,
      color: "hover:text-primary",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/castkeep",
      icon: Linkedin,
      color: "hover:text-primary",
    },
    {
      name: "Email",
      url: "mailto:support@castkeep.com",
      icon: Mail,
      color: "hover:text-primary",
    },
  ];

  return (
    <footer className="glass mt-20 mx-4 md:mx-8 mb-4 px-8 py-12 bg-muted font-semibold">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 ">
          {/* Brand */}
          <div className="space-y-4">
           <div className="flex items-center gap-2">
                         <Image src={"/logo.svg"} width={isMobile? 100: 140} height={isMobile? 100: 140} alt="Bloody Boka" />
                     </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Preserve your most precious moments with beautiful, lasting hand
              casting sculptures. Create memories that last a lifetime.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a
                  href="#product"
                  className="hover:text-accent transition-colors"
                >
                  Hand Casting Kit
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Refill Kits
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Finishing Paints
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Display Bases
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-accent transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-accent transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-foreground/70 ${social.color} transition-colors duration-200`}
                    aria-label={`Follow us on ${social.name}`}
                    title={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
            <div className="text-xs text-foreground/60 pt-2">
              Subscribe to our newsletter for tips and exclusive offers
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-xs text-foreground/60">
            <div>
              <a href="#" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-accent transition-colors">
                Terms of Service
              </a>
            </div>
            <div>
              <a href="#" className="hover:text-accent transition-colors">
                Bulk Orders
              </a>
            </div>
          </div>
          <p className="text-center text-foreground/60 text-sm">
            &copy; {currentYear} CastKeep. All rights reserved. | Skin-Safe •
            Non-Toxic • Proudly Family-Owned |{" "}
            <a href="#contact" className="hover:text-accent transition-colors">
              Contact
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

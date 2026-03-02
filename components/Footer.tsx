import Link from "next/link";
import { Bus, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="relative">
                <Bus className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -inset-1 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary font-display">
                CHARTER
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Experience the pinnacle of luxury bus charters. Whether it's a corporate event, wedding transport, or cross-country tour, we ensure comfort, safety, and elegance on every journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground font-display mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Search Buses</Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">How it Works</Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Why Choose Us</Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Customer Login</Link>
              </li>
              <li>
                <Link href="/operator/login" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Operator Oasis</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-foreground font-display mb-6 tracking-wide">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Help Center / FAQ</Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Cancellation Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground font-display mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>123 Luxury Avenue, Suite 400<br/>Metropolis, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+1 (800) 555-RIDE</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:support@charter.com" className="hover:text-accent transition-colors">support@charter.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border my-8 lg:my-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Charter Rentals. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Built with precision in 2026.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Poppins, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://luckyyaduvanshi.in";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "BusYatra – बस किराया | Book Buses in Jaipur, Rajasthan",
    template: "%s | BusYatra",
  },
  description:
    "Book buses for weddings, religious tours & family trips in Jaipur and Rajasthan. Verified drivers, transparent pricing, 24/7 support. आपकी यात्रा, हमारी जिम्मेदारी।",
  keywords: [
    "bus booking Jaipur",
    "bus rental Rajasthan",
    "wedding bus hire",
    "tempo traveller Jaipur",
    "pilgrimage bus booking",
    "family trip bus",
    "bus charter India",
  ],
  openGraph: {
    title: "BusYatra – Book Buses in Jaipur & Rajasthan",
    description: "Verified bus operators, transparent pricing, and comfortable travel for weddings, tours & trips.",
    type: "website",
    locale: "en_IN",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${poppins.variable} ${notoSansDevanagari.variable} font-sans antialiased text-foreground bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

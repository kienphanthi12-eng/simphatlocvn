import type { Metadata } from "next";
import { Lexend, Barlow_Condensed, Geist } from 'next/font/google'
import "./globals.css";
import { cn } from "@/lib/utils";


const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://simphatloc86.vn'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sim Phát Lộc | Chuyên Sim Vinaphone Số Đẹp",
    template: "%s | Sim Phát Lộc",
  },
  description: "Chuyên cung cấp sim Vinaphone số đẹp toàn quốc. Hàng ngàn sim VIP, Tam Hoa, Tứ Quý, Lộc Phát giá rẻ. Cam kết chính hãng, vào tên chính chủ, giao toàn quốc.",
  keywords: ["sim đẹp", "sim vinaphone", "sim phong thủy", "sim tam hoa", "sim tứ quý", "sim lộc phát", "sim thần tài", "số đẹp vinaphone", "mua sim đẹp"],
  authors: [{ name: "Sim Phát Lộc" }],
  creator: "Sim Phát Lộc",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "Sim Phát Lộc",
    title: "Sim Phát Lộc | Chuyên Sim Vinaphone Số Đẹp",
    description: "Chuyên cung cấp sim Vinaphone số đẹp toàn quốc. Sim VIP, Tam Hoa, Tứ Quý, Lộc Phát giá rẻ nhất.",
    images: [{ url: "/dragon-phoenix-hero.jpg", width: 1200, height: 630, alt: "Sim Phát Lộc" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sim Phát Lộc | Chuyên Sim Vinaphone Số Đẹp",
    description: "Chuyên cung cấp sim Vinaphone số đẹp toàn quốc.",
    images: ["/dragon-phoenix-hero.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} ${barlow.variable} font-sans antialiased bg-background flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

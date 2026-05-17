import type { Metadata } from "next";
import { Lexend, Barlow_Condensed, Geist } from 'next/font/google'
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ZaloButton } from "@/components/ui/ZaloButton";
import { cn } from "@/lib/utils";
import { Analytics } from '@vercel/analytics/next';

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Sim Phát Lộc | Chuyên Sim Vinaphone Số Đẹp",
  description: "Chuyên cung cấp sim Vinaphone số đẹp toàn quốc. Hàng ngàn sim VIP, Tam Hoa, Tứ Quý, Lộc Phát giá rẻ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} ${barlow.variable} font-sans antialiased bg-gray-50 flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ZaloButton />
        <Analytics />
      </body>
    </html>
  );
}

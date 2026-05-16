import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ZaloButton } from "@/components/ui/ZaloButton";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
});

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
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased bg-gray-50 flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ZaloButton />
      </body>
    </html>
  );
}

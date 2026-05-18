import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ZaloButton } from "@/components/ui/ZaloButton";
import { AuspiciousNotification } from "@/components/ui/AuspiciousNotification";
import { PhongThuyChatbot } from "@/components/ui/PhongThuyChatbot";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ZaloButton />
      <AuspiciousNotification />
      <PhongThuyChatbot />
    </>
  );
}

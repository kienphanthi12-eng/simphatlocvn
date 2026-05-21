import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ZaloButton } from "@/components/ui/ZaloButton";
import { AuspiciousNotification } from "@/components/ui/AuspiciousNotification";
import { PhongThuyChatbot } from "@/components/ui/PhongThuyChatbot";
import { TrustBar } from "@/components/ui/TrustBar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TrustBar />
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

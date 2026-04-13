import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Voting Application",
  description: "Cast your vote and make your voice heard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 ">{children}</main>
      <Footer />
    </div>
  );
}

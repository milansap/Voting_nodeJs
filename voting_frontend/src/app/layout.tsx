import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient } from "@tanstack/react-query";
import { QueryProvider } from "@/lib/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${poppins.variable} ${jetbrainsMono.variable} ${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-poppins min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider>
            <div className="flex-1  ">{children}</div>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

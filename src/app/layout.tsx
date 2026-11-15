import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/store/provider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { AppReadyMarker } from "@/components/providers/AppReadyMarker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finova Analytics",
  description:
    "Painel financeiro de demonstração: receitas, despesas, fluxo de caixa e orçamentos em um só lugar.",
  applicationName: "Finova Analytics",
};

export const viewport: Viewport = {
  themeColor: "#090E1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full">
        <StoreProvider>
          <MotionProvider>
            {children}
            <AppReadyMarker />
          </MotionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

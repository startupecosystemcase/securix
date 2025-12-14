import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";

// Используем Inter как основной шрифт (Gilroy можно добавить позже через localFont)
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-gilroy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Securix - Ваша безопасность в один клик",
  description: "Первая цифровая экосистема личной безопасности в Центральной Азии",
  keywords: "безопасность, охрана, телохранитель, водитель, консьерж, Казахстан, Алматы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";

// Gilroy font - используем fallback на системный шрифт (файлы шрифта можно добавить позже)
const gilroy = localFont({
  src: [],
  variable: "--font-gilroy",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
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
      <body className={`${gilroy.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

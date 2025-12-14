import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "Securix - Ваша безопасность в один клик",
  description: "Первая цифровая экосистема личной безопасности в Центральной Азии. Профессиональная охрана для предпринимателей и VIP-клиентов.",
  keywords: "безопасность, охрана, телохранитель, водитель, консьерж, Казахстан, Алматы",
  authors: [{ name: "Securix" }],
  openGraph: {
    title: "Securix - Ваша безопасность в один клик",
    description: "Первая цифровая экосистема личной безопасности в Центральной Азии",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="antialiased">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

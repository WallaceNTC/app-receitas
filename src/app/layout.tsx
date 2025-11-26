import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export const metadata: Metadata = {
  title: "Receitas Flex - Receitas Premium",
  description: "Descubra receitas incríveis com design premium e tecnologia de ponta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <body className="antialiased font-inter bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {children}
      </body>
    </html>
  );
}

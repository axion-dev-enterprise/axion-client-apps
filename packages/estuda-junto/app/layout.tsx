import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estuda Junto | Seu próximo buddy de estudos",
  description: "Encontre um parceiro compatível, combine uma sessão e estude com foco.",
  metadataBase: new URL("https://estuda-junto.vercel.app")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}

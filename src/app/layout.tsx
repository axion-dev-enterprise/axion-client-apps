import "./globals.css";
import { LangProvider } from "@/components/LangContext";

export const metadata = {
  title: "The English Empire — Imperial Academy v3.0 | Isabela Courses VIP",
  description:
    "Plataforma de fluência gamificada para executivos, pilotos ICAO e líderes globais. Cursos 4K HD, mentoria 1-on-1, certificado internacional e checkout Stripe/MercadoPago.",
  keywords: "inglês executivo, ICAO aviation english, business english, fluência, Isabela courses",
  openGraph: {
    title: "The English Empire — Imperial Academy v3.0",
    description: "Transforme seu inglês em uma arma estratégica com mentoria VIP 1-on-1.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#06070d" />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}

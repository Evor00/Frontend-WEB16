import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HelpDesk Tecsup | Sistema de Mesa de Ayuda",
    template: "%s | HelpDesk Tecsup",
  },
  description:
    "Sistema web de Mesa de Ayuda (Help Desk) para registrar, dar seguimiento y resolver incidencias de soporte técnico de forma rápida y ordenada.",
  keywords: [
    "mesa de ayuda",
    "help desk",
    "tickets de soporte",
    "gestión de incidencias",
    "soporte técnico",
    "Tecsup",
  ],
  authors: [{ name: "Coello Palomino, Ricardo" }],
  openGraph: {
    title: "HelpDesk Tecsup | Sistema de Mesa de Ayuda",
    description:
      "Plataforma para registrar y dar seguimiento a incidencias de soporte técnico: crea tickets, asigna responsables y consulta el historial de atención.",
    url: SITE_URL,
    siteName: "HelpDesk Tecsup",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HelpDesk Tecsup | Sistema de Mesa de Ayuda",
    description:
      "Plataforma para registrar y dar seguimiento a incidencias de soporte técnico.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import {
  Inter,
  Luckiest_Guy,
  Mada,
  Playfair_Display,
  Dancing_Script,
  Caveat,
} from "next/font/google";
import "./globals.css";
import MobileBlocker from "@/components/MobileBlocker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest-guy",
  weight: "400",
  subsets: ["latin"],
});

const mada = Mada({
  variable: "--font-mada",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Editor fonts
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Magic Fold - A Digital Zine Experience",
  description: "Create and share magical digital zines with your loved ones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${luckiestGuy.variable} ${mada.variable} ${playfairDisplay.variable} ${dancingScript.variable} ${caveat.variable} antialiased`}>
        <MobileBlocker />
        <div className="hidden lg:block">
          {children}
        </div>
      </body>
    </html>
  );
}

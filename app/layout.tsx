import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/Cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Satyam Trders | Premium Home Decor & Bedding",
  description:
    "Discover curated collection of premium home essentials at Satyam Trders. Clean, modern, and elegant designs for your living space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body
        style={
          {
            "--font-main": "var(--font-inter)",
            "--font-heading": "var(--font-playfair)",
          } as React.CSSProperties
        }
      >
        <CartProvider>
          {children}
          {/* CartDrawer lives outside page tree so it persists across routes */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

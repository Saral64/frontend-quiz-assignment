import type { Metadata } from "next";
import { DM_Serif_Display, Lato } from "next/font/google"; 
import "./globals.css";

// 1. Setup the exact fonts from Figma
const dmSerif = DM_Serif_Display({ 
  weight: "400", 
  style: "italic",
  subsets: ["latin"], 
  variable: "--font-dm-serif" 
});

const lato = Lato({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-lato" 
});

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Frontend Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${lato.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontPlusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Dayflow - Enterprise Human Resources",
  description: "Human Resource Management System for Dayflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body-md antialiased text-on-surface",
          fontPlusJakarta.variable,
          fontPlayfair.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

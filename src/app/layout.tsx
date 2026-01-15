import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
});

const quicksand = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Us and Ours",
  description: "A private space for our memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${quicksand.variable} antialiased font-body selection:bg-rose-200 selection:text-rose-900`}
      >
        {children}
      </body>
    </html>
  );
}

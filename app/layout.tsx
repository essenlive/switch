import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from 'next/font/google'
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster"

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "switch",
  description: "Switch lines mini game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className={nunito.className}>
      
      <body className={`antialiased  text-black relative flex flex-col p-4 space-y-4 justify-start min-h-dvh max-w-xl mx-auto bg-gray-100`}>
          <Header />
          { children }
          <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from 'next/font/google'
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from 'react'
import Script from 'next/script'

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

      {process.env.NODE_ENV !== "development" && 
      <Script 
          defer
          src={`${process.env.NEXT_PUBLIC_ANALYTICS_SERVER_URL}/script.js` }
          data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID}
          strategy="afterInteractive" 
        />
    }

      <body className={`overscroll-contain antialiased  text-black relative flex flex-col p-4 space-y-4 justify-start min-h-dvh max-w-xl mx-auto bg-gray-100`}>
          <Header />
          <Suspense>
            { children }

          </Suspense>
          <Toaster />
      </body>
    </html>
  );
}

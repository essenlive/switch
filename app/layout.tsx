import type { Metadata } from "next";
import Score from "@/components/score"
import "./globals.css";
import { Nunito } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "swap",
  description: "Swap lines mini game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className}>
      <body className={`antialiased  bg-gray-100`}>
        <Toaster />
        <div className="min-h-screen max-w-2xl mx-auto text-black">

          <header className="flex justify-between w-full max-w-2xl items-center h-24 p-4 fixed">
              <h1 className="text-2xl md:text-4xl font-bold">SWAP</h1>
              <div className="flex items-center space-x-4">
                <Score />
              </div>
            </header>

            <main className="pt-24 h-screen w-full flex items-center justify-center flex-col">
                {children}
            </main>
        </div>


      </body>
    </html>
  );
}

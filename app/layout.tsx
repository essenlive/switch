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
      <body className={`antialiased`}>
        <Toaster />
        <div className="min-h-screen bg-gray-100 text-black  p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <header className="flex justify-between items-center mb-8 fixed">
              <h1 className="text-2xl md:text-4xl font-bold">SWAP</h1>
              <div className="flex items-center space-x-4">
                <Score />
              </div>
            </header>

            <main className="p-2 md:p-8 h-full w-full">
                {children}
            </main>
          </div>
        </div>


      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Button } from "@/components/ui/button"
import { Settings, Star } from 'lucide-react'
import "./globals.css";
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
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
    <html lang="en" className={inter.className}>
      <body className={`antialiased`}>

        <div className="min-h-screen bg-gray-100 text-black  p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold">SWAP</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="text-lg md:text-xl font-semibold">1337</span>
                </div>
                <Button variant="outline" size="icon">
                  <Settings className="w-5 h-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </header>

            <main className="bg-white/10 backdrop-blur-md rounded-lg p-6 md:p-8 shadow-xl">
                {children}
            </main>
          </div>
        </div>


      </body>
    </html>
  );
}

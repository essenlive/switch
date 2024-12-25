import type { Metadata } from "next";
import Score from "@/components/score"
import "./globals.css";
import { Nunito } from 'next/font/google'


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

        <div className="min-h-screen bg-gray-100 text-black  p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold">SWAP</h1>
              <div className="flex items-center space-x-4">
                <Score />
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

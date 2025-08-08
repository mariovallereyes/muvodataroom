import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MUVO CBD - Panel",
  description: "Dashboard de ventas y productos MUVO CBD",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className + " bg-[var(--bg)] text-[var(--fg)]"}>
        {children}
      </body>
    </html>
  )
}
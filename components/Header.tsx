"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import YearSelector from "@/components/YearSelector"
import { useStore } from "@/lib/useStore"
import { usePathname } from "next/navigation"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [dark, setDark] = useState(false)
  const { selectedYear } = useStore()
  const pathname = usePathname()
  // Detect Empresa robustly: strip locale only; basePath is handled by Next.js routing
  const stripLocale = (p?: string) => (p ? p.replace(/^\/(es|en)(?=\/|$)/, "") : "")
  const noLocale = stripLocale(pathname)
  const onEmpresa = /(^|\/)empresa(\/)?$/.test(noLocale)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    const preferDark =
      stored ? stored === "dark" : window.matchMedia?.("(prefers-color-scheme: dark)").matches
    setDark(preferDark)
    document.documentElement.classList.toggle("dark", preferDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <header className="relative">
      {/* NAV */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur">
          <div className="container-page h-14 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight">müvo</span>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={toggle}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                aria-label="Cambiar tema"
                title={dark ? "Cambiar a claro" : "Cambiar a oscuro"}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {dark ? "Claro" : "Oscuro"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* HERO with background image */}
      <div
        className="relative"
        style={{
          backgroundImage: `url(${(process.env.NEXT_PUBLIC_BASE_PATH || "") + (onEmpresa
            ? "/hero3.png"
            : selectedYear === "2022"
            ? "/hero4.webp"
            : selectedYear === "2024"
            ? "/hero1.webp"
            : selectedYear === "2025"
            ? "/hero2.webp"
            : "/hero.webp")})`,
          backgroundSize: "cover",
          backgroundPosition:
            onEmpresa
              ? "center"
              : selectedYear === "2022"
              ? "center 53%"
              : selectedYear === "2024"
              ? "center 80%"
              : selectedYear === "2025"
              ? "center 70%"
              : "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="bg-black/55">
          <div className="container-page py-10 md:py-16 text-white">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">MÜVO</h1>
            <p className="mt-2 max-w-2xl text-white/85">
              Bienvenidos al Data Room de MÚVO CBD.
              <span className="block text-sm md:text-xs text-white/70 mt-1">
                Última actualización: Agosto 2025
              </span>
            </p>
            <div className="mt-6">
              <YearSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
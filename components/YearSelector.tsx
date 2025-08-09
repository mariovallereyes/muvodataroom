"use client"

import { useStore } from "@/lib/useStore"
import { clsx } from "clsx"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function YearSelector() {
  const { selectedYear, setSelectedYear, salesByYear } = useStore()
  const years = Object.keys(salesByYear)
  const pathname = usePathname()
  const isEmpresa = pathname?.startsWith("/empresa")
  const baseBtn =
    "px-4 py-2 rounded-full border text-sm transition-transform duration-150 hover:scale-[1.02]"
  const router = useRouter()

  const handleYearClick = (y: string) => {
    setSelectedYear(y)
    if (pathname !== "/") router.replace("/")
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/empresa"
        className={clsx(
          baseBtn,
          isEmpresa
            ? "bg-primary text-white border-primary"
            : "bg-white/80 dark:bg-zinc-900 hover:bg-accent/40 border-black/10 dark:border-white/10"
        )}
      >
        Empresa
      </Link>
      {years.map((y) => (
        <button
          key={y}
          onClick={() => handleYearClick(y)}
          className={clsx(
            baseBtn,
            !isEmpresa && y === selectedYear
              ? "bg-primary text-white border-primary"
              : "bg-white/80 dark:bg-zinc-900 hover:bg-accent/40 border-black/10 dark:border-white/10"
          )}
          aria-pressed={y === selectedYear}
        >
          {y}
        </button>
      ))}
    </div>
  )
}
"use client"

import Image from "next/image"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useStore } from "@/lib/useStore"
import top5Units from "@/data/top5_units.json"
import * as React from "react"

// Color palette (soft green + coral + teal + amber + purple)
const COLORS = ["#66BB6A", "#FF6F61", "#26A69A", "#FFC107", "#7E57C2"]

export default function ProductCarousel() {
  const { selectedYear, products } = useStore()
  const [folderImages, setFolderImages] = React.useState<{ id: number; name: string; src: string }[]>([])
  const carouselRef = React.useRef<HTMLDivElement | null>(null)
  const speedRef = React.useRef<number>(1) // px per frame (effective)
  const posRef = React.useRef<number>(0)
  const list = products.items

  // Load all images from /public/products dynamically so the user only drops files
  React.useEffect(() => {
    fetch(((process.env.NEXT_PUBLIC_BASE_PATH as string) || "") + "/api/products")
      .then((r) => r.json())
      .then((d) => setFolderImages(d.images ?? []))
      .catch(() => setFolderImages([]))
  }, [])

  // Auto-scroll loop
  React.useEffect(() => {
    let raf: number
    const step = () => {
      const el = carouselRef.current
      if (el) {
        const max = el.scrollWidth - el.clientWidth - 1
        posRef.current = Math.min(max, posRef.current + speedRef.current)
        if (posRef.current >= max) posRef.current = 0
        el.scrollLeft = posRef.current
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Prefer units override for 2025 if provided
  const unitsOverride = (top5Units as Record<string, { name: string; units: number }[]>)?.[selectedYear]
  const isUnitsMode = Array.isArray(unitsOverride) && selectedYear === "2025"
  const pieData = isUnitsMode
    ? unitsOverride.map((d) => ({ name: d.name, value: d.units }))
    : list
        .map((p) => ({
          name: p.name,
          value: p.revenueByYear?.[selectedYear] ?? 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

  // Prefer monthly units override for 2025 if provided; otherwise derive a small fraction
  const unitsOverrideMonth = (top5Units as Record<string, { name: string; units: number }[]>)?.[`${selectedYear}_month`]
  const pieMonthData = isUnitsMode && Array.isArray(unitsOverrideMonth)
    ? unitsOverrideMonth.map((d) => ({ name: d.name, value: d.units }))
    : pieData.map((d) => ({ ...d, value: Math.max(1, Math.round(Number(d.value) * 0.08)) }))

  const money = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })
  const unitsFmt = (n: number) => n.toLocaleString("es-MX")

  return (
    <div className="grid grid-rows-[auto_1fr] gap-6">
      {/* Gráficos arriba: Año y Mes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center">
          <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-100">En el año</p>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={pieData}
                  outerRadius={96}
                  innerRadius={50}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} className="transition-transform duration-150" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#111827", color: "#fff", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#e5e7eb" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  formatter={(v: number, _name: any, entry: any) =>
                    isUnitsMode
                      ? [unitsFmt(Number(v)), String(entry?.name ?? "")]
                      : [money(Number(v)), "Ingresos"]
                  }
                  labelFormatter={(l: any) => (isUnitsMode ? "" : `Producto: ${String(l)}`)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-100">En el mes</p>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={pieMonthData}
                  outerRadius={96}
                  innerRadius={50}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieMonthData.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} className="transition-transform duration-150" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#111827", color: "#fff", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#e5e7eb" }}
                  itemStyle={{ color: "#e5e7eb" }}
                  formatter={(v: number, _name: any, entry: any) =>
                    isUnitsMode
                      ? [unitsFmt(Number(v)), String(entry?.name ?? "")]
                      : [money(Number(v)), "Ingresos"]
                  }
                  labelFormatter={(l: any) => (isUnitsMode ? "" : `Producto: ${String(l)}`)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Carrusel abajo (más ancho) */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-2 no-scrollbar"
        onMouseEnter={() => (speedRef.current = 0.15)}
        onMouseLeave={() => (speedRef.current = 1)}
      >
        {(folderImages.length > 0 ? folderImages : list).map((p: any) => (
          <div key={p.id ?? p.src} className="w-56 flex-shrink-0">
            <div className="group relative rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 transition-transform duration-200 ring-0 group-hover:ring-2 group-hover:ring-accent group-hover:border-accent/60">
              <div className="pointer-events-none absolute inset-0 bg-[rgba(165,214,167,0.22)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-800 transform transition-transform duration-200 group-hover:scale-110">
                <Image
                  src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + (((p.src as string) ?? (p.image as string)) as string)}
                  alt={(p.name as string) ?? "Producto"}
                  fill
                  className="object-contain"
                  sizes="224px"
                />
              </div>
              {/* Título removido por solicitud */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
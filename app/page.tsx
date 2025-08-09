"use client"

import Header from "@/components/Header"
import KpiCard from "@/components/KpiCard"
import SalesChart from "@/components/SalesChart"
import SalesTable from "@/components/SalesTable"
import ProductCarousel from "@/components/ProductCarousel"
import { useStore } from "@/lib/useStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    const hasYear = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("year")
    const base = (process.env.NEXT_PUBLIC_BASE_PATH as string) || ""
    if (!hasYear) router.replace(`${base}/empresa`)
  }, [router])
  const {
    selectedYear,
    salesByYear,
    products,
    company,
    setCompany,
    setSales,
    setProducts,
  } = useStore()

  // Edición deshabilitada para usuarios finales

  return (
    <main>
      <Header />
      {/* Header component already renders the hero with background and YearSelector */}

      <section className="container-page py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KpiCard />
        </div>
      </section>

      <section className="container-page pb-6">
        <div className="card relative">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ventas mensuales</h2>
          </div>
          <div className="mt-4">
            <SalesChart />
          </div>
        </div>
      </section>

      <section className="container-page pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card relative">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Top 5 de Productos</h2>
            </div>
            <div className="mt-4">
              <ProductCarousel />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold">Detalle de ventas</h2>
            <div className="mt-4">
              <SalesTable />
            </div>
          </div>
        </div>
      </section>

      <footer className="container-page py-10 text-sm text-neutral-500">
        © {new Date().getFullYear()} müvo CBD — Panel interno
      </footer>
    </main>
  )
}
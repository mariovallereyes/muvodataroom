"use client"

import { useStore } from "@/lib/useStore"

export default function SalesTable() {
  const { selectedYear, salesByYear } = useStore()
  const rows = salesByYear[selectedYear] ?? []

  const money = (n: number | null | undefined) =>
    (n ?? 0).toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })

  const totalRevenue = rows.reduce((s, r) => s + (r.revenue ?? 0), 0)
  const totalUnits = rows.reduce((s, r) => s + (r.units ?? 0), 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th className="py-2">Mes</th>
            <th className="py-2">Ingresos</th>
            <th className="py-2">Unidades</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} className="border-t border-black/5 dark:border-white/10">
              <td className="py-2">{r.month}</td>
              <td className="py-2">{money(r.revenue)}</td>
              <td className="py-2">{(r.units ?? 0).toLocaleString("es-MX")}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-black/5 dark:border-white/10 font-medium">
            <td className="py-2">Totales</td>
            <td className="py-2">{money(totalRevenue)}</td>
            <td className="py-2">{totalUnits.toLocaleString("es-MX")}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
"use client"

import { useStore } from "@/lib/useStore"

export default function KpiCard() {
  const { selectedYear, salesByYear, company } = useStore()
  const rows = salesByYear[selectedYear] ?? []
  const totals = rows.reduce(
    (acc, r) => {
      const revenue = r.revenue ?? 0
      const units = r.units ?? 0
      return { revenue: acc.revenue + revenue, units: acc.units + units }
    },
    { revenue: 0, units: 0 }
  )

  const previousYear = String(Number(selectedYear) - 1) as keyof typeof salesByYear
  const prevRows = salesByYear[previousYear] ?? []
  const prevRevenue = prevRows.reduce((s, r) => s + (r.revenue ?? 0), 0)
  const yoy = prevRevenue > 0 ? ((totals.revenue - prevRevenue) / prevRevenue) * 100 : 0

  const avgTicket = totals.units > 0 ? totals.revenue / totals.units : 0
  const repeatPct =
    company?.kpis?.repeatCustomersPct?.[selectedYear as keyof typeof company.kpis.repeatCustomersPct] ??
    0.35

  const formatter = (n: number) =>
    n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 })

  // Month-over-month vs last year (M vs M) for the latest month with data
  const getMonthOverMonthYoY = (): { label: string; value: string } => {
    const currentYearRows = salesByYear[selectedYear] ?? []
    const prevYearKey = String(Number(selectedYear) - 1)
    const previousYearRows = salesByYear[prevYearKey] ?? []

    // find latest month index that has revenue in current year
    let lastIdx = -1
    for (let i = currentYearRows.length - 1; i >= 0; i -= 1) {
      if (currentYearRows[i]?.revenue != null && currentYearRows[i]!.revenue! > 0) {
        lastIdx = i
        break
      }
    }
    if (lastIdx === -1) return { label: "Crecimiento interanual (Mes)", value: "—" }

    const current = currentYearRows[lastIdx]?.revenue ?? 0
    const previous = previousYearRows[lastIdx]?.revenue ?? 0
    const pct = previous > 0 ? ((current - previous) / previous) * 100 : 0
    return {
      label: `Crecimiento interanual (Mes)`,
      value: `${pct.toFixed(1)}%`,
    }
  }

  const yoyMonth = getMonthOverMonthYoY()

  const cards = [
    { label: "Ingresos totales", value: formatter(totals.revenue) },
    { label: "Unidades vendidas", value: totals.units.toLocaleString("es-MX") },
    { label: "Crecimiento interanual %", value: `${yoy.toFixed(1)}%` },
    { label: yoyMonth.label, value: yoyMonth.value },
    { label: "Ticket promedio", value: formatter(avgTicket) },
    { label: "Clientes recurrentes %", value: `${(repeatPct * 100).toFixed(0)}%` },
  ]

  return (
    <>
      {cards.map((c) => (
        <div className="card" key={c.label}>
          <p className="text-sm text-neutral-500">{c.label}</p>
          <p className="mt-2 text-2xl font-semibold">{c.value}</p>
        </div>
      ))}
    </>
  )
}
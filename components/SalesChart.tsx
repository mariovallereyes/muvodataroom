"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { useStore } from "@/lib/useStore"

const months = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
]

export default function SalesChart() {
  const { selectedYear, salesByYear } = useStore()
  const rows =
    (salesByYear[selectedYear] ?? []).map((r) => ({
      mes: r.month,
      ingresos: r.revenue ?? 0,
      unidades: r.units ?? 0,
    })) || []

  const formatMoney = (v: number) =>
    v.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="h-72 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barCategoryGap={12}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="mes" tick={{ fontSize: 12 }} interval={0} height={48} />
          <YAxis tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)} />
          <ReTooltip
            contentStyle={{ background: "#111827", color: "#fff", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#e5e7eb" }}
            formatter={(value: any, _name, payload: any) =>
              payload && payload.dataKey === "ingresos" && typeof value === "number"
                ? formatMoney(value)
                : value
            }
            labelFormatter={(l) => `Mes: ${l}`}
            cursor={{ fill: "rgba(165,214,167,0.22)" }}
          />
          <Bar
            dataKey="ingresos"
            name="Ingresos"
            fill="#1B5E20"
            radius={6}
            isAnimationActive
            animationDuration={300}
            activeBar={{ fill: "#2E7D32", stroke: "#A5D6A7", strokeWidth: 2, radius: 8 }}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-neutral-500">
        Ventas mensuales · {selectedYear}
      </p>
    </div>
  )
}
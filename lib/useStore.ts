"use client"

import { create } from "zustand"
import salesRaw from "@/data/sales.json"
import productsRaw from "@/data/products.json"
import companyRaw from "@/data/company.json"

type MonthRow = { month: string; revenue: number | null; units: number | null }
type SalesByYear = Record<string, MonthRow[]>

type Product = {
  id: string
  name: string
  description: string
  image: string
  revenueByYear: Record<string, number>
}

type Products = { items: Product[] }

type Company = {
  name: string
  kpis: { repeatCustomersPct: Record<string, number> }
}

type Store = {
  selectedYear: string
  salesByYear: SalesByYear
  products: Products
  company: Company
  setSelectedYear: (y: string) => void
  setSales: (s: SalesByYear) => void
  setProducts: (p: Products) => void
  setCompany: (c: Company) => void
}

export const useStore = create<Store>((set) => ({
  selectedYear: "2024",
  salesByYear: salesRaw as SalesByYear,
  products: productsRaw as Products,
  company: companyRaw as Company,
  setSelectedYear: (y) => set({ selectedYear: y }),
  setSales: (s) => set({ salesByYear: s }),
  setProducts: (p) => set({ products: p }),
  setCompany: (c) => set({ company: c }),
}))
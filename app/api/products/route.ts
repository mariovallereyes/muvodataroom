import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "products")
    const exists = fs.existsSync(dir)
    if (!exists) {
      return NextResponse.json({ images: [] })
    }
    const files = fs.readdirSync(dir)
    const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"])
    const images = files
      .filter((f) => allowed.has(path.extname(f).toLowerCase()))
      .sort()
      .map((f, idx) => ({ id: idx + 1, name: path.parse(f).name, src: `/products/${f}` }))

    return NextResponse.json({ images })
  } catch (e) {
    return NextResponse.json({ images: [] })
  }
}



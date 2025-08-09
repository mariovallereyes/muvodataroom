"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, TrendingUp, Shield, Users, AlertTriangle, Lightbulb, CheckCircle, Linkedin, Instagram } from "lucide-react"

type GalleryItem = { id: number; name: string; src: string }

export default function EmpresaPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    fetch(((process.env.NEXT_PUBLIC_BASE_PATH as string) || "") + "/api/products")
      .then((r) => r.json())
      .then((d) => setGallery(d.images ?? []))
      .catch(() => setGallery([]))
  }, [])

  const sections: { id: string; title: string; body: string }[] = [
    { id: "oportunidad", title: "Oportunidad & TAM", body: "Mercado de bienestar con CBD en crecimiento de doble dígito en LATAM. TAM México + e‑commerce transfronterizo." },
    { id: "problema", title: "Problema", body: "Consumidores buscan alivio natural confiable; barreras: desinformación, falta de trazabilidad y oferta inconsistente." },
    { id: "solucion", title: "Solución MUVO", body: "Productos de CBD con pureza certificada, sabores amigables y educación clara. D2C + retail selecto." },
    { id: "por-que-nosotros", title: "¿Por qué nosotros?", body: "Marca confiable, márgenes sanos, operación ágil, auditorías de calidad y comunidad creciente." },
    { id: "traccion", title: "Crecimiento hasta hoy", body: "Ingresos crecientes YoY, repetición >35%, expansión a nuevos SKUs y canales." },
    { id: "producto", title: "Portafolio & CBD", body: "Gotas 10/20ml, tópicos y gomitas. CBD aislado, libre de THC, pruebas de laboratorio públicas." },
    { id: "equipo", title: "Equipo", body: "Fundadores con experiencia en CPG, marketing de performance y supply chain." },
    { id: "tecnologia", title: "Tecnología & Operación", body: "Infra D2C, análisis de datos, cumplimiento regulatorio y logística last‑mile optimizada." },
    { id: "use-of-funds", title: "Uso de fondos", body: "Marketing escalable, working capital, expansión retail y R&D de nuevos formatos." },
    { id: "contacto", title: "Contacto", body: "hola@muvo.cbd · Solicita data room completo y KPIs granulares." }
  ]

  const resolveAsset = async (
    base: string,
    exts = ["png", "jpg", "jpeg", "webp", "PNG", "JPG", "JPEG", "WEBP"]
  ) => {
    for (const ext of exts) {
      const candidate = `${base}.${ext}`
      try {
        const res = await fetch(((process.env.NEXT_PUBLIC_BASE_PATH as string) || "") + candidate, {
          method: "HEAD",
        })
        if (res.ok) return candidate
      } catch {}
    }
    return null
  }

  const ImgSlot = ({ src, srcBase, alt, className = "" }: { src?: string; srcBase?: string; alt: string; className?: string }) => {
    const [resolved, setResolved] = useState<string | null>(src ?? null)
    useEffect(() => {
      let mounted = true
      if (!src && srcBase) {
        resolveAsset(srcBase).then((r) => mounted && setResolved(r))
      }
      return () => {
        mounted = false
      }
    }, [src, srcBase])
    return (
      <div className={"relative overflow-hidden rounded-lg bg-gradient-to-br from-accent/40 to-primary/30 " + className}>
        {resolved ? (
          <Image
            src={((process.env.NEXT_PUBLIC_BASE_PATH as string) || "") + resolved}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : null}
      </div>
    )
  }

  const MosaicItem = ({ src, srcBase, large }: { src?: string; srcBase?: string; large: boolean }) => {
    const [hide, setHide] = useState(false)
    const [resolved, setResolved] = useState<string | null>(src ?? null)
    useEffect(() => {
      let mounted = true
      if (!src && srcBase) {
        resolveAsset(srcBase).then((r) => mounted && setResolved(r))
      }
      return () => {
        mounted = false
      }
    }, [src, srcBase])
    if (hide) return null
    return (
      <div className={(large ? "col-span-2 row-span-2 " : "") + "relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800"}>
        {resolved ? (
          <Image
            src={((process.env.NEXT_PUBLIC_BASE_PATH as string) || "") + resolved}
            alt="galería"
            fill
            className="object-cover"
            onLoadingComplete={(img) => {
              const ratio = img.naturalWidth / img.naturalHeight
              if (ratio > 4) setHide(true) // descarta franjas horizontales
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-primary/30" />
        )}
      </div>
    )
  }

  const AvatarImg = ({ base, alt, initials }: { base: string; alt: string; initials: string }) => {
    const [resolved, setResolved] = useState<string | null>(null)
    useEffect(() => {
      resolveAsset(`/company/${base}`).then(setResolved)
    }, [base])
    return (
      <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-accent to-primary/70 flex items-center justify-center text-white font-semibold">
        {resolved ? (
          <Image
            src={((process.env.NEXT_PUBLIC_BASE_PATH as string) || "") + resolved}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    )
  }

  return (
    <main className="no-card-hover">
      <Header />

      {/* Hero editorial visual */}
      <section className="container-page pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Müvo CBD: marca líder en México</h1>
            <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-xl">
              La enorme oportunidad del CBD en México y América Latina
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary"/> Crecimiento</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">Ventas desde 2020</CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4 text-primary"/> Recompra</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">≥ 35%</CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><Shield className="h-4 w-4 text-primary"/> Calidad</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">Libre de THC</CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><Rocket className="h-4 w-4 text-primary"/> Go‑to‑Market</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">Multinivel & B2C</CardContent>
              </Card>
            </div>
            {/* Mini-secciones clave para el primer impacto */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary"/> Oportunidad & TAM</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">Mercado en hipercrecimiento; México y LATAM listos. MUVO capitaliza con marca confiable y educación.</CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary"/> Problema</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">Confusión y desconfianza: trazabilidad limitada y oferta inconsistente.</CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary"/> Solución MUVO</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">CBD puro, libre de THC, educación clara. D2C + e‑commerce.</CardContent>
              </Card>
              <Card className="bg-white/70 dark:bg-zinc-900/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary"/> ¿Por qué nosotros?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">Marca confiable, márgenes sanos, repetición ≥35%, operación ágil.</CardContent>
              </Card>
            </div>
          </div>
          {/* Mosaic visual */}
          <div className="mt-16 md:mt-20 grid grid-cols-3 grid-rows-2 gap-3 h-[500px]">
            {Array.from({ length: 6 }).map((_, i) => {
              const idx = (i % 3) + 1
              return <MosaicItem key={i} srcBase={`/company/collage${idx}`} large={i === 0} />
            })}
          </div>
        </div>
      </section>

      {/* Tabs editorial cortas */}
      <section className="container-page py-8">
        <div className="card">
          <Tabs defaultValue="resumen">
            <TabsList>
              <TabsTrigger value="resumen">One-Page Pitch</TabsTrigger>
              <TabsTrigger value="galeria" disabled className="text-neutral-400 cursor-not-allowed">Catálogo 2025</TabsTrigger>
              <TabsTrigger value="secciones" disabled className="text-neutral-400 cursor-not-allowed">Secciones</TabsTrigger>
            </TabsList>
            <TabsContent value="resumen" className="mt-4 grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 order-1">
                <CardHeader>
                  <CardTitle>Müvo CBD: marca líder en México</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">
                  <ImgSlot srcBase="/company/box1" alt="Tracción y comunidad" className="aspect-[21/9] mb-4" />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-base mb-1 uppercase">QUIÉNES SOMOS</h4>
                      <p className="leading-6 text-justify">
                        Compañía de bienestar con CBD enfocada en calidad, seguridad y educación clara. Diseñamos productos
                        que las personas disfrutan usar diariamente y construimos confianza con trazabilidad y servicio.
                      </p>
                      <p className="leading-6 text-justify mt-2">
                        Nuestro enfoque combina ciencia, diseño y escucha activa de la comunidad para mantener un portafolio
                        relevante, efectivo y sustentable en el tiempo.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base mb-1 uppercase">NUESTRA MISIÓN</h4>
                      <p className="leading-6 text-justify">
                        Liderar LATAM/US Hispanic con productos de alta pureza que mejoren el bienestar diario, eliminando la
                        fricción de adopción mediante educación simple y experiencias de marca memorables.
                      </p>
                      <p className="leading-6 text-justify mt-2">
                        Lo hacemos con operación liviana apoyada en datos y una cultura de excelencia: seguridad del usuario,
                        innovación responsable y servicio cercano.
                      </p>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="order-2">
                <CardHeader>
                  <CardTitle>Core Team</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        name: "Ernesto Rodríguez",
                        initials: "ER",
                        base: "ernesto",
                        lines: ["CEO & Cofundador", "15+ años en muebles/tech", "Producto y operación"],
                        linkedin: "https://linkedin.com",
                        instagram: "https://instagram.com"
                      },
                      {
                        name: "Edgardo Villanueva",
                        initials: "EV",
                        base: "edgardo",
                        lines: ["CPO & Cofundador", "Atracción de talento", "Liderazgo y e‑commerce"],
                        linkedin: "https://linkedin.com",
                        instagram: "https://instagram.com"
                      },
                      {
                        name: "Mario Valle Reyes",
                        initials: "MV",
                        base: "mario",
                        lines: ["Consejero / CSO", "Venture Capital", "Estrategia y Finanzas"],
                        linkedin: "https://linkedin.com",
                        instagram: "https://instagram.com"
                      },
                      {
                        name: "Marenko Plaza",
                        initials: "MP",
                        base: "marenko",
                        lines: ["Consejero / Operación", "Supply chain", "GoToMarket & B2B"],
                        linkedin: "https://linkedin.com",
                        instagram: "https://instagram.com"
                      },
                    ].map((m) => (
                      <div className="flex items-start gap-3" key={m.name}>
                        <AvatarImg base={m.base} alt={m.name} initials={m.initials} />
                        <div className="flex-1">
                          <p className="font-medium text-[var(--fg)]">{m.name}</p>
                          <p className="text-xs text-neutral-500 leading-snug">
                            {m.lines[0]}<br />{m.lines[1]}<br />{m.lines[2]}
                          </p>
                          <div className="mt-2 flex items-center gap-2 justify-end">
                            <a
                              href={m.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`LinkedIn de ${m.name}`}
                              title="LinkedIn"
                              className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/60 dark:bg-zinc-900/60 text-neutral-500"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                              href={m.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Instagram de ${m.name}`}
                              title="Instagram"
                              className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/60 dark:bg-zinc-900/60 text-neutral-500"
                            >
                              <Instagram className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="order-3">
                <CardHeader>
                  <CardTitle>TAM estimado</CardTitle>
                </CardHeader>
                <CardContent className="text-[13px] leading-5 text-neutral-600 dark:text-neutral-300">
                  <ImgSlot srcBase="/company/box3" alt="TAM" className="aspect-[16/9] mb-3" />
                  TAM global CBD 2021: $12.8 B · 2028: $56.2 B (CAGR 2022–2028: 21.7%). Categoría líder: aceites (2021: $3.1 B).
                  Mercado USA 2026: $16 B. 69 millones de hispanos en EE.UU. LATAM 2022: $300 M · 2028: $1.9 B.
                  México 2020: $9.2 M · 2028 estimado: $675 M (CAGR: 82.59%). Uno de los mercados con mayor crecimiento.
                </CardContent>
              </Card>
              <Card className="order-4">
                <CardHeader>
                  <CardTitle>Por qué MUVO</CardTitle>
                </CardHeader>
                <CardContent className="text-[13px] leading-5 text-neutral-600 dark:text-neutral-300">
                  <ImgSlot srcBase="/company/box4" alt="Por qué MUVO" className="aspect-[16/9] mb-3" />
                  <p className="mt-2">
                    En México, 1 de cada 4 hogares tiene un vendedor directo. ~3 millones de personas trabajan un promedio de 2.7 catálogos.
                    Müvo suma 1,200 müvers (0.05% del potencial). Meta: 1% en 18 meses (~30,000 distribuidores). Siguiente paso: LATAM y US Hispanic.
                  </p>
                </CardContent>
              </Card>

              <Card className="order-5">
                <CardHeader>
                  <CardTitle>Calidad Absoluta</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300 leading-6">
                  <ImgSlot srcBase="/company/box5" alt="Calidad Absoluta" className="aspect-[16/9] mb-3" />
                  Ingredientes de alta pureza y lotes controlados. Pruebas de laboratorio de terceros en cada producción. 
                  Trazabilidad completa y buenas prácticas de manufactura. Estabilidad y dosis consistentes para el usuario.
                  Procesos estandarizados y auditorías internas.
                </CardContent>
              </Card>
              <Card className="order-6">
                <CardHeader>
                  <CardTitle>Unit economics</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300 leading-6">
                  <ImgSlot srcBase="/company/box6" alt="Unit economics" className="aspect-[16/9] mb-3" />
                  Margen bruto 65–70% (promedio ponderado).
                  CAC controlado vía contenido y creadores (inferior al paid en MX).
                  Recompra ≥35% con ciclo de 3–4 meses.
                  Payback en 1–2 órdenes; LTV por cohorte al alza.
                </CardContent>
              </Card>
              <Card className="order-7">
                <CardHeader>
                  <CardTitle>Regulación</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600 dark:text-neutral-300 leading-6">
                  <ImgSlot srcBase="/company/box7" alt="Regulación" className="aspect-[16/9] mb-3" />
                  México autoriza CBD sin THC psicoactivo. Cumplimos normas y etiquetado; cada lote tiene COA externo.
                  Con trazabilidad completa y control de calidad, nuestros productos están aprobados para su venta y uso responsable.
                </CardContent>
              </Card>
              <Card className="order-8">
                <CardHeader>
                  <CardTitle>Roadmap 12 meses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImgSlot srcBase="/company/box8" alt="Roadmap" className="aspect-[16/9] mb-3" />
                  <ul className="list-disc pl-4 text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                    <li>Recuperar tendencia de crecimiento</li>
                    <li>Lanzar MUVO app</li>
                    <li>Nuevos productos</li>
                    <li>Longevidad y Bienestar</li>
                    <li>Expansión e‑commerce</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="galeria" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(gallery.length ? gallery : Array.from({ length: 8 }).map((_, i) => ({ id: i, src: "" }))).map((g, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {g.src ? <Image src={g.src} alt="galería" fill className="object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-primary/30" />}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="secciones" className="mt-4">
              <Accordion type="multiple" className="w-full">
                {sections.map((s) => (
                  <AccordionItem value={s.id} key={s.id}>
                    <AccordionTrigger>{s.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{s.body}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}



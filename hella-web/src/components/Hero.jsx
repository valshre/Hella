import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'

// Sección principal (Hero) con título impactante y llamada a la acción
export default function Hero() {
  return (
    <section className="px-4 pt-6 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-stone-900">
        {/* Imagen de fondo de alta calidad */}
        <img
          src="/images/hero-dish.png"
          alt="Platillo gourmet contemporáneo preparado por un chef privado"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        {/* Capa de degradado sutil para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/30" />

        <div className="relative flex flex-col items-start gap-6 px-6 py-20 sm:px-12 md:py-32 lg:max-w-2xl lg:py-40">
          {/* Distintivo superior */}
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-50/15 px-4 py-1.5 text-xs font-medium text-stone-100 ring-1 ring-stone-50/20 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-brand text-brand" />
            Chefs privados de alta cocina
          </span>

          <h1 className="text-balance font-serif text-4xl font-bold leading-[1.05] text-stone-50 sm:text-5xl md:text-6xl">
            La alta cocina llega a la comodidad de tu hogar
          </h1>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-stone-200 md:text-lg">
            En HELLA llevamos chefs profesionales a tu mesa. Menús diseñados a
            medida, ingredientes selectos y una experiencia gastronómica
            inolvidable, sin salir de casa.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/menu"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-stone-50 shadow-lg shadow-brand/30 transition-all hover:bg-brand-dark"
            >
              Ver nuestro menú
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/servicio"
              className="inline-flex items-center justify-center rounded-full bg-stone-50/10 px-7 py-3.5 text-sm font-semibold text-stone-50 ring-1 ring-stone-50/25 backdrop-blur-sm transition-colors hover:bg-stone-50/20"
            >
              Cómo funciona
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

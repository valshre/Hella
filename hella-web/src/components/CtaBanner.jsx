import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// Banner de llamada a la acción reutilizable al final de las páginas
export default function CtaBanner({
  title = '¿List@ para vivir la experiencia HELLA?',
  description = 'Cuéntanos sobre tu evento y diseñaremos un menú a tu medida.',
  buttonLabel = 'Reservar chef',
  to = '/contacto',
}) {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 rounded-[2.5rem] bg-brand px-7 py-14 text-center md:px-12 md:py-20">
        <h2 className="max-w-2xl text-balance font-serif text-3xl font-bold text-stone-50 md:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-pretty leading-relaxed text-stone-100/90">
          {description}
        </p>
        <Link
          to={to}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3.5 text-sm font-semibold text-brand-dark shadow-lg transition-all hover:bg-white"
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}

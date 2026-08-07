import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, UtensilsCrossed, BookOpen, CalendarCheck } from 'lucide-react'
import Hero from '../components/Hero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

const seasonData = {
  lluvias: {
    title: 'Cosecha de Lluvias',
    desc: 'Cacao profundo con notas terrosas y húmedas, ideal para paladares intensos.',
    promo: 'Compra 2 barras 70% cacao y obtén un 15% de descuento.',
    theme: 'bg-stone-900 text-stone-100'
  },
  sol: {
    title: 'Cosecha de Sol',
    desc: 'Cacao con notas frutales y florales, ligero y refrescante para el verano.',
    promo: 'Edición especial de bombones cítricos disponible ahora.',
    theme: 'bg-amber-50 text-stone-900'
  }
}

export default function Home() {

 const month = new Date().getMonth() + 1

const activeSeason =
  month >= 5 && month <= 10
    ? 'lluvias'
    : 'sol'

const [currentSeason, setCurrentSeason] = useState(activeSeason)
  const highlights = [
    {
      icon: UtensilsCrossed,
      title: 'Nuestro Menú',
      description: 'Descubre nuestra carta profesional: entradas, arroces, pastas, guarniciones y platos fuertes.',
      to: '/menu',
      cta: 'Ver el menú'
    },
    {
      icon: CalendarCheck,
      title: 'Cómo funciona',
      description: 'Un servicio de chef privado bajo contrato, paso a paso, pensado para tu tranquilidad.',
      to: '/servicio',
      cta: 'Conocer el servicio'
    },
    {
      icon: BookOpen,
      title: 'Nuestra historia',
      description: 'La pasión, el detalle y la calidad que dieron vida a HELLA. Conoce quiénes somos.',
      to: '/sobre-nosotros',
      cta: 'Leer la historia'
    },
  ]

  return (
    <>
      <Hero />

      <section className="px-4 pt-8 pb-4">
        <div className={`mx-auto max-w-7xl rounded-3xl p-8 transition-colors duration-500 ${seasonData[currentSeason].theme}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div>
            <span className="inline-block mb-3 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                  Activo ahora: {seasonData[activeSeason].title}
</span>

              <h3 className="font-serif text-2xl font-bold mb-2">
                {seasonData[currentSeason].title}
              </h3>

              <p className="opacity-90 max-w-md">
                {seasonData[currentSeason].desc}
              </p>

              <p className="mt-4 font-semibold text-brand-gold">
                {seasonData[currentSeason].promo}
              </p>
            </div>

            <div className="flex gap-3">
              {['lluvias', 'sol'].map((s) => (
                <button
                  key={s}
                  onClick={() => setCurrentSeason(s)}
                  className={`px-5 py-2.5 rounded-full border border-current transition-all capitalize ${
                    currentSeason === s
                      ? 'bg-white/20 font-bold scale-105 shadow-inner'
                      : 'hover:bg-white/10'
                  }`}
                >
                  Temporada {s}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
              Bienvenid@ a HELLA
            </span>

            <h2 className="text-balance font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Alta cocina, hecha a tu medida
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlights.map((item) => {

              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="group flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-stone-200/60 transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >

                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
                    <Icon className="h-6 w-6" />
                  </span>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-stone-500">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    to={item.to}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors group-hover:text-red-600"
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                </article>
              )

            })}
          </div>

        </div>
      </section>

      <CtaBanner />
    </>
  )
}
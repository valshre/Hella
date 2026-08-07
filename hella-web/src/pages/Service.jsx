import {
  PhoneCall,
  ClipboardList,
  ShoppingBasket,
  ChefHat,
  Sparkles,
  FileSignature,
  Leaf,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

// Pasos del servicio de chef privado
const steps = [
  {
    icon: PhoneCall,
    title: 'Primer contacto',
    text: 'Nos cuentas sobre tu evento: fecha, número de invitados, ocasión y estilo que imaginas.',
  },
  {
    icon: ClipboardList,
    title: 'Diseño del menú',
    text: 'Creamos contigo un menú a medida, considerando tus gustos, alergias y preferencias.',
  },
  {
    icon: ShoppingBasket,
    title: 'Compra de ingredientes',
    text: 'Seleccionamos productos frescos y de temporada de los mejores proveedores.',
  },
  {
    icon: ChefHat,
    title: 'El gran día',
    text: 'Tu chef llega a casa, cocina frente a ti y sirve cada tiempo en su punto ideal.',
  },
  {
    icon: Sparkles,
    title: 'Solo disfruta',
    text: 'Nos encargamos de todo, incluida la limpieza. Tú solo te ocupas de tus invitados.',
  },
]

// Pilares del modelo de servicio
const pillars = [
  {
    icon: FileSignature,
    title: 'Servicio bajo contrato',
    description:
      'Contrata a tu chef de manera recurrente o por evento, con condiciones claras y total transparencia.',
  },
  {
    icon: Sparkles,
    title: 'Experiencia personalizada',
    description:
      'Diseñamos cada menú contigo, adaptándonos a tus preferencias, restricciones y el estilo de tu celebración.',
  },
  {
    icon: Leaf,
    title: 'Ingredientes de alta calidad',
    description:
      'Seleccionamos productos frescos y de temporada de los mejores proveedores para cada preparación.',
  },
]

// Página que explica cómo funciona el servicio
export default function Service() {
  return (
    <>
      <PageHero
        eyebrow="Nuestro servicio"
        title="Cómo funciona HELLA"
        description="Un servicio de chef privado bajo contrato, pensado para que vivas la alta cocina sin preocuparte de nada."
        image="/images/evento.png"
      />

      {/* Pasos del servicio */}
      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center">
            <span className="rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
              Paso a paso
            </span>
            <h2 className="text-balance font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              De la primera llamada a tu mesa
            </h2>
            <p className="text-pretty leading-relaxed text-stone-500">
              Un proceso simple y transparente en cinco pasos.
            </p>
          </div>

          <ol className="flex flex-col gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <li
                  key={step.title}
                  className="flex items-start gap-5 rounded-3xl bg-white p-6 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60 md:p-7"
                >
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-stone-50">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-stone-50">
                      {index + 1}
                    </span>
                  </span>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-stone-500">
                      {step.text}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* Modelo de servicio (pilares) sobre fondo oscuro */}
      <section className="px-4 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2.5rem] bg-stone-900 p-7 md:grid-cols-2 md:p-12 lg:p-16">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/images/about-chef.png"
              alt="Chef privado de HELLA emplatando con dedicación"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <span className="w-fit rounded-full bg-brand/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-soft">
                Nuestro modelo
              </span>
              <h2 className="text-balance font-serif text-3xl font-bold text-stone-50 md:text-4xl">
                Un chef profesional, dedicado por completo a tu mesa
              </h2>
              <p className="text-pretty leading-relaxed text-stone-300">
                Nos encargamos de todo —del menú a la limpieza— para que solo te
                ocupes de disfrutar a tus invitados.
              </p>
            </div>
            <ul className="flex flex-col gap-5">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <li key={pillar.title} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-stone-50">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-serif text-lg font-semibold text-stone-50">
                        {pillar.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-stone-400">
                        {pillar.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <CtaBanner
        title="¿List@ para reservar tu chef?"
        description="Cuéntanos sobre tu evento y comencemos a planear tu experiencia."
      />
    </>
  )
}

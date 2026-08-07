import { FileSignature, Sparkles, Leaf } from 'lucide-react'

// Pilares del servicio de chef privado bajo contrato
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

// Sección que explica el modelo de servicio de HELLA
export default function ServiceSection() {
  return (
    <section id="servicio" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2.5rem] bg-stone-900 p-7 md:grid-cols-2 md:p-12 lg:p-16">
        {/* Imagen del chef */}
        <div className="overflow-hidden rounded-[2rem]">
          <img
            src="/images/about-chef.png"
            alt="Chef privado de HELLA emplatando con dedicación"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Texto y pilares */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded-full bg-brand/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-soft">
              Nuestro servicio
            </span>
            <h2 className="text-balance font-serif text-3xl font-bold text-stone-50 md:text-4xl">
              Un chef profesional, dedicado por completo a tu mesa
            </h2>
            <p className="text-pretty leading-relaxed text-stone-300">
              HELLA es un servicio de chefs privados bajo contrato. Nos
              encargamos de todo —del menú a la limpieza— para que solo te
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
  )
}

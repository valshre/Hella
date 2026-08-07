import { Heart, Award, Sparkles } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

// Valores que definen a HELLA
const values = [
  {
    icon: Heart,
    title: 'Pasión',
    description:
      'Cocinamos con el corazón. Cada platillo nace del amor por el oficio y el deseo de emocionar.',
  },
  {
    icon: Award,
    title: 'Calidad',
    description:
      'Solo trabajamos con ingredientes selectos y técnicas precisas. La excelencia es nuestro estándar.',
  },
  {
    icon: Sparkles,
    title: 'Detalle',
    description:
      'El secreto está en lo pequeño: el emplatado, el tiempo, la atención a cada invitado.',
  },
]

// Hitos de la historia
const timeline = [
  {
    year: '2018',
    title: 'El primer servicio',
    text: 'Una cena íntima para ocho personas marcó el inicio de un sueño: llevar la alta cocina al hogar.',
  },
  {
    year: '2020',
    title: 'Un equipo que crece',
    text: 'Chefs apasionados se unen a HELLA, ampliando estilos, técnicas y propuestas culinarias.',
  },
  {
    year: '2023',
    title: 'Experiencias a la medida',
    text: 'Lanzamos el servicio bajo contrato, con menús totalmente personalizados para cada ocasión.',
  },
  {
    year: 'Hoy',
    title: 'Tu mesa, nuestra pasión',
    text: 'Seguimos creando momentos memorables, un platillo y una sonrisa a la vez.',
  },
]

// Página "Sobre Nosotros" con historia
export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Sobre Nosotros"
        title="Una historia de pasión por la cocina"
        description="Detrás de HELLA hay chefs que sueñan con transformar cada comida en un recuerdo inolvidable."
        image="/images/historia.png"
      />

      {/* Historia narrativa con imagen */}
      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="overflow-hidden rounded-[2.5rem]">
            <img
              src="/images/historia.png"
              alt="Chef de HELLA preparando ingredientes en una cocina luminosa"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="w-fit rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
              Nuestra historia
            </span>
            <h2 className="text-balance font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Nacimos para llevar la alta cocina a tu hogar
            </h2>
            <p className="text-pretty leading-relaxed text-stone-500">
              HELLA comenzó con una idea sencilla pero poderosa: que nadie
              debería salir de casa para vivir una experiencia gastronómica
              extraordinaria. Lo que empezó como cenas para amigos y familia se
              convirtió en una vocación.
            </p>
            <p className="text-pretty leading-relaxed text-stone-500">
              Hoy somos un equipo de chefs profesionales que comparte una misma
              filosofía: respetar el producto, cuidar cada detalle y poner toda
              nuestra pasión al servicio de tu mesa. Cada menú es único, porque
              cada ocasión y cada persona también lo son.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="px-4 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16">
            <h2 className="text-balance font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Lo que nos define
            </h2>
            <p className="text-pretty leading-relaxed text-stone-500">
              Tres principios guían cada experiencia que creamos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <article
                  key={value.title}
                  className="flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-stone-50">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-500">
                    {value.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Línea de tiempo */}
      <section className="px-4 pb-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            Nuestro camino
          </h2>
          <ol className="flex flex-col gap-8">
            {timeline.map((item) => (
              <li key={item.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft font-serif text-sm font-bold text-brand-dark">
                    {item.year}
                  </span>
                  <span className="mt-2 w-px flex-1 bg-stone-200" />
                </div>
                <div className="flex flex-col gap-1.5 pb-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-500">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner
        title="Hagamos historia en tu mesa"
        description="Permítenos ser parte de tu próxima celebración."
      />
    </>
  )
}

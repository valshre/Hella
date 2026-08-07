
import PageHero from '../components/PageHero.jsx'
import DynamicEventMenu from '../components/DynamicEventMenu.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

export default function MenuEventos() {
  return (
    <>
      <PageHero
        eyebrow="Especiales y Temporada"
        title="Momentos únicos en tu mesa"
        description="Descubre nuestro menú dinámico: sugerencias semanales, platillos por tiempo limitado y creaciones exclusivas inspiradas en la estación."
        image="/images/hero-dish.png" /* Puedes cambiar la imagen después por una de temporada */
      />

      {/* Aquí inyectamos tu nuevo componente que maneja los eventos */}
      <DynamicEventMenu />

      <div className="mx-auto max-w-5xl px-4 md:px-8 pb-12">
        <p className="rounded-3xl bg-brand-soft px-6 py-5 text-center text-sm leading-relaxed text-brand-dark font-medium">
          Nuestros platillos de temporada cambian regularmente para garantizar la mayor frescura de los ingredientes.
        </p>
      </div>

      <CtaBanner
        title="¿Tienes un evento en puerta?"
        description="Sorprende a tus invitados con nuestros platillos especiales y de temporada."
        buttonLabel="Cotizar mi evento"
      />
    </>
  )
}
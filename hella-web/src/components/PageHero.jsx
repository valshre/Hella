// Encabezado reutilizable para las páginas internas
export default function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="px-4 pt-6 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-stone-900">
        {/* Imagen de fondo */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-stone-950/40" />

        <div className="relative flex flex-col items-center gap-4 px-6 py-20 text-center sm:px-12 md:py-28">
          {eyebrow && (
            <span className="rounded-full bg-stone-50/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-100 ring-1 ring-stone-50/20 backdrop-blur-sm">
              {eyebrow}
            </span>
          )}
          <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold leading-[1.05] text-stone-50 md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-stone-200 md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

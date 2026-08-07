// Tarjeta reutilizable para mostrar una categoría del menú profesional
export default function MenuCard({ title, image, description, items }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm shadow-stone-200/60 ring-1 ring-stone-200/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-300/40">
      {/* Imagen de la categoría */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-stone-500">
            {description}
          </p>
        </div>

        {/* Lista de platillos */}
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

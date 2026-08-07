import { useState } from 'react'
import { Search } from 'lucide-react'
import MenuCard from './MenuCard.jsx'

// Menú para Eventos (tu código original)
const menuEventos = [
  {
    title: 'Entradas',
    image: '/images/entradas.png',
    description: 'El inicio perfecto: reconfortantes y llenas de sabor.',
    items: ['Sopas', 'Caldos', 'Cremas'],
  },
  {
    title: 'Arroces y pastas',
    image: '/images/arroces.png',
    description: 'Clásicos reinventados con técnica y dedicación.',
    items: ['Risottos', 'Paellas', 'Pastas frescas'],
  },
  {
    title: 'Guarniciones y ensaladas',
    image: '/images/ensaladas.png',
    description: 'Acompañamientos frescos que realzan cada platillo.',
    items: ['Ensaladas', 'Vegetales', 'Guarniciones'],
  },
  {
    title: 'Platos fuertes',
    image: '/images/cocina.png',
    description: 'El corazón de la experiencia, a tu elección.',
    items: ['Pollo', 'Carnes rojas', 'Pescados', 'Mariscos', 'Vegetariano'],
  },
]

// Menú Semanal (nueva opción para la pestaña)
const menuSemanal = [
  {
    title: 'Lunes a Miércoles',
    image: '/images/entradas.png',
    description: 'Opciones ligeras para comenzar la semana con energía.',
    items: ['Crema de calabaza', 'Pechuga al grill', 'Ensalada fresca'],
  },
  {
    title: 'Jueves a Viernes',
    image: '/images/arroces.png',
    description: 'Sabores más intensos para acercarnos al fin de semana.',
    items: ['Pasta al pesto', 'Pescado empapelado', 'Verduras asadas'],
  },
]

export default function MenuSection() {
  // Estados para controlar la pestaña activa y lo que el usuario escribe
  const [activeTab, setActiveTab] = useState('eventos')
  const [searchTerm, setSearchTerm] = useState('')

  // 1. Seleccionamos qué menú mostrar según la pestaña activa
  const currentMenu = activeTab === 'eventos' ? menuEventos : menuSemanal

  // 2. Filtramos el menú seleccionado según lo que escriban en el buscador
  const filteredCategories = currentMenu.filter((category) => {
    const searchLower = searchTerm.toLowerCase()
    // Busca coincidencias en el título de la categoría o en los platillos (items)
    const matchTitle = category.title.toLowerCase().includes(searchLower)
    const matchItems = category.items.some((item) =>
      item.toLowerCase().includes(searchLower)
    )
    return matchTitle || matchItems
  })

  return (
    <section id="menu" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado de la sección */}
        <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-dark">
            Nuestro Menú
          </span>
          <h2 className="text-balance font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            Una carta diseñada para tu ocasión
          </h2>
          <p className="text-pretty leading-relaxed text-stone-500">
            Cada categoría se personaliza según tus gustos. Selecciona tu tipo de
            servicio o busca un platillo en específico.
          </p>
        </div>

        {/* Controles: Pestañas y Buscador */}
        <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center justify-between gap-6 md:flex-row md:gap-4">
          
          {/* Pestañas (Tabs) */}
          <div className="flex rounded-full bg-stone-200/60 p-1 shadow-inner">
            <button
              onClick={() => setActiveTab('eventos')}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === 'eventos'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Menú para Eventos
            </button>
            <button
              onClick={() => setActiveTab('semanal')}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === 'semanal'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Menú Semanal
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Buscar platillos, pastas, sopas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-brand focus:ring-2 focus:ring-brand-soft"
            />
          </div>
        </div>

        {/* Grid responsivo de categorías filtradas */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <MenuCard key={category.title} {...category} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-500">
            No encontramos platillos que coincidan con tu búsqueda.
          </div>
        )}
      </div>
    </section>
  )
}
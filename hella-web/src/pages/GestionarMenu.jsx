import { useState } from 'react'
import { Plus, Edit2, Trash2, ChefHat } from 'lucide-react'

export default function GestionarMenu() {
  // Datos simulados para que tu captura de pantalla se vea realista
  const [platillos, setPlatillos] = useState([
    { id: 1, nombre: 'Sopa de Nopal a la mexicana', categoria: 'Sopas, caldos y cremas', estado: 'Disponible' },
    { id: 2, nombre: 'Risotto con Champiñones', categoria: 'Arroces y pastas', estado: 'Disponible' },
    { id: 3, nombre: 'Filete Mignon', categoria: 'Plato Fuerte: Carnes rojas', estado: 'Agotado' },
  ])

  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Cabecera del Panel */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700">
              <ChefHat className="h-4 w-4" />
              Panel de Cocina
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Gestión de Menú
            </h2>
            <p className="mt-1 text-stone-500">
              Administra los platillos, recetas y disponibilidad para los eventos.
            </p>
          </div>
          
          <button className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800">
            <Plus className="h-4 w-4" />
            Añadir Platillo
          </button>
        </div>

        {/* Tabla / Lista de Platillos */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Platillo</th>
                  <th className="px-6 py-4 font-semibold">Categoría</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {platillos.map((platillo) => (
                  <tr key={platillo.id} className="transition-colors hover:bg-stone-50/50">
                    <td className="px-6 py-4 font-medium text-stone-900">
                      {platillo.nombre}
                    </td>
                    <td className="px-6 py-4">{platillo.categoria}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        platillo.estado === 'Disponible' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {platillo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="mr-3 text-stone-400 hover:text-stone-900 transition-colors">
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button className="text-stone-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
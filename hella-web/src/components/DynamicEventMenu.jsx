import { useState, useMemo } from 'react'
import { Calendar, Star, Timer, Settings2 } from 'lucide-react'
import { fixedMenus, getSeasonalMenu } from '../data/eventMenusData.js'

export default function DynamicEventMenu() {
  const [activeTab, setActiveTab] = useState('semanal')
  
  // NUEVO ESTADO: Guarda el mes seleccionado en la barra de demostración
  const [forcedMonth, setForcedMonth] = useState(null)
  
  // Actualizamos el useMemo para que recalcule si cambia el mes forzado
  const seasonalMenu = useMemo(() => getSeasonalMenu(forcedMonth), [forcedMonth])

  const eventMenus = {
    ...fixedMenus,
    temporada: seasonalMenu
  }

  const currentMenu = eventMenus[activeTab]

  // Configuración de los botones de la barra de demostración
  const demoSeasons = [
    { label: 'Automático', month: null, color: 'bg-stone-400' },
    { label: 'San Valentín', month: 1, color: 'bg-rose-500' },
    { label: 'Primavera', month: 3, color: 'bg-brand' }, // Usa el verde de tu marca
    { label: 'Verano', month: 6, color: 'bg-sky-500' },
    { label: 'Patrio', month: 8, color: 'bg-emerald-500' },
    { label: 'Día de Muertos', month: 9, color: 'bg-orange-500' },
    { label: 'Navidad', month: 11, color: 'bg-red-600' },
  ]

  return (
    <section className="px-4 py-8 md:px-8 bg-transparent">
      <div className="mx-auto max-w-5xl">
        
        {/* NUEVO: BARRA DE SIMULACIÓN DE TEMPORADAS */}
        <div className="mb-10 rounded-2xl bg-stone-100 p-4 border border-stone-200/80 shadow-inner flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-600 font-semibold text-sm shrink-0">
            <Settings2 className="w-4 h-4" />
            <span>Simulador de Temporada:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {demoSeasons.map((season) => (
              <button
                key={season.label}
                onClick={() => {
                  setForcedMonth(season.month)
                  setActiveTab('temporada') // Cambia a la pestaña de temporada automáticamente para que veas el cambio
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  forcedMonth === season.month 
                    ? `${season.color} text-white border-transparent shadow-sm scale-105` 
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {/* Círculo de color si no está seleccionado */}
                {forcedMonth !== season.month && (
                  <span className={`w-2 h-2 rounded-full ${season.color}`}></span>
                )}
                {season.label}
              </button>
            ))}
          </div>
        </div>
        {/* FIN DE BARRA DE SIMULACIÓN */}

        {/* Navegación por pestañas */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('semanal')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'semanal' 
                ? 'bg-stone-900 text-white shadow-md' 
                : 'bg-white text-stone-500 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> Semanal
          </button>
          
          <button
            onClick={() => setActiveTab('especiales')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'especiales' 
                ? 'bg-stone-900 text-white shadow-md' 
                : 'bg-white text-stone-500 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Star className="w-4 h-4" /> Especiales
          </button>

          <button
            onClick={() => setActiveTab('temporada')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === 'temporada' 
                ? `${seasonalMenu.badgeColor} shadow-md border-transparent` 
                : 'bg-white text-stone-500 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Timer className="w-4 h-4" /> Temporada
          </button>
        </div>

        {/* Contenedor Dinámico */}
        <div className={`rounded-3xl border shadow-sm overflow-hidden relative transition-all duration-500 ${currentMenu.bgClass}`}>
          
          {/* MARCO DECORATIVO */}
          {currentMenu.bgImage && (
            <div 
              className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-500"
              style={{ backgroundImage: `url(${currentMenu.bgImage})` }}
            />
          )}

          {/* CONTENIDO */}
          <div className="relative z-10 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase transition-colors duration-500 ${currentMenu.badgeColor}`}>
                {activeTab === 'temporada' ? 'Por tiempo limitado' : activeTab}
              </span>
            </div>

            <h3 className="text-3xl font-serif font-bold text-stone-900 mb-2 drop-shadow-sm transition-colors duration-500">
              {currentMenu.title}
            </h3>
            <p className="text-stone-700 font-medium mb-8 border-b border-stone-300/60 pb-6 drop-shadow-sm transition-colors duration-500">
              {currentMenu.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {currentMenu.items.map((item, index) => (
                <div key={index} className="bg-white/85 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/60 flex flex-col gap-2 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start gap-2.5">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full mt-2 transition-colors duration-500 ${activeTab === 'temporada' ? seasonalMenu.badgeColor.split(' ')[0] : 'bg-stone-800'}`} />
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm md:text-base">{item.name}</h4>
                      <p className="text-xs md:text-sm text-stone-600 leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import MenuDom from '../components/MenuDom.jsx'
import DynamicEventMenu from '../components/DynamicEventMenu.jsx'
import PedidoCliente from './PedidoCliente.jsx' // Importamos el componente de pedidos para usuarios registrados

export default function Menu() {
  // Estado para controlar qué pestaña está activa: 'general', 'eventos' o 'pedidos'
  const [activeMenuTab, setActiveMenuTab] = useState('general')

  return (
    <>
      <PageHero
        eyebrow="Menú profesional"
        title="Una carta diseñada para tu ocasión"
        description="Cada categoría se personaliza según tus gustos. Nuestros chefs adaptan recetas, porciones e ingredientes a la medida de tu evento."
        image="/images/hero-dish.png"
      />

      {/* CONTROL DE PESTAÑAS PRINCIPAL */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-12 flex justify-center">
        <div className="inline-flex rounded-full bg-stone-100 p-1.5 border border-stone-200/60 shadow-sm flex-wrap justify-center gap-1">
          <button
            onClick={() => setActiveMenuTab('general')}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeMenuTab === 'general'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Menú Fijo General
          </button>
          
          <button
            onClick={() => setActiveMenuTab('eventos')}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeMenuTab === 'eventos'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Especiales y Temporadas
          </button>

          <button
            onClick={() => setActiveMenuTab('pedidos')}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeMenuTab === 'pedidos'
                ? 'bg-brand text-stone-50 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Realizar Pedido
          </button>
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL DE LOS MENÚS Y PEDIDOS */}
      <div className="transition-all duration-500">
        {activeMenuTab === 'general' && <MenuDom />}
        {activeMenuTab === 'eventos' && <DynamicEventMenu />}
        {activeMenuTab === 'pedidos' && <PedidoCliente />}
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-8 pb-12">
        <p className="rounded-3xl bg-brand-soft px-6 py-5 text-center text-sm leading-relaxed text-brand-dark font-medium">
          Todos los platillos son personalizables. Cuéntanos tus preferencias,
          alergias o restricciones y nuestro chef diseñará el menú ideal para ti.
        </p>
      </div>

      <CtaBanner
        title="Diseñemos tu menú juntos"
        description="Reserva una consulta y crea una carta a la medida de tu evento."
        buttonLabel="Solicitar menú personalizado"
      />
    </>
  )
}
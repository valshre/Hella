import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import MenuCard from './MenuCard.jsx'

// tarjetas con categorías
const categories = [
  {
    title: 'Entradas',
    image: '/images/entradas.png',
    description: 'El inicio perfecto: reconfortantes y llenas de sabor.',
    items: ['Sopas', 'Caldos', 'Cremas'],
    targetId: 'sopas,-caldos-y-cremas'
  },
  {
    title: 'Arroces y pastas',
    image: '/images/arroces.png',
    description: 'Clásicos reinventados con técnica y dedicación.',
    items: ['Risottos', 'Paellas', 'Pastas frescas'],
    targetId: 'arroces-y-pastas'
  },
  {
    title: 'Guarniciones y ensaladas',
    image: '/images/ensaladas.png',
    description: 'Acompañamientos frescos que realzan cada platillo.',
    items: ['Ensaladas', 'Vegetales', 'Guarniciones'],
    targetId: 'guarniciones-y-ensaladas'
  },
  {
    title: 'Platos fuertes',
    image: '/images/cocina.png',
    description: 'El corazón de la experiencia, a tu elección.',
    items: ['Pollo', 'Carnes rojas', 'Pescados', 'Mariscos', 'Vegetariano'],
    targetId: 'plato-fuerte:-pollo'
  },
]

// datos completos
const menuData = [
  {
    categoria: "Sopas, caldos y cremas",
    platillos: ["De nopal", "Nopal a la mexicana", "Acelgas", "De pasta (aguada)", "Minestrone", "Papa", "Champiñones", "Champiñones al ajillo", "Champiñones con setas", "Lentejas", "Lentejas árabes (estofado de lentejas con pequeñas albóndigas de carne y especias)", "Fideo seco", "Cebolla", "De verduras", "Azteca (queso panela, chile pasilla y tortilla)", "Poro y papa", "Calabazas con elote y queso panela", "Milpa (calabaza, poblano, cebolla, pollo y elote)", "Caldito tlalpeño (Jitomate, chipotle, calabaza, zanahoria y pollo)", "Mole de olla", "De pollo", "Camarón", "Crema de zanahoria", "Espinacas", "Champiñones", "De calabazas con espinacas"]
  },
  {
    categoria: "Arroces y pastas",
    platillos: ["Rojo", "A la jardinera (rojo, zanahoria y chícharo)", "Blanco", "Blanco con elote y/o ejote", "Al vapor", "Con champiñones", "Al cilantro", "A la mantequilla", "Con poblano y cilantro", "Yakimeshi (Salsa de soya, proteína, zanahoria y calabaza)", "Hierbas finas", "Curry", "Ajo y mantequilla", "Pasta aurora (jitomate y crema)", "Con crema jamón y queso", "Con crema de champiñones", "Al poblano", "Alfredo", "Crema de tocino y chipotle", "Crema de espinaca", "Pollo, brócoli y mantequilla", "Tepanyaki", "Pomodoro (Jitomate, albahaca, ajo y aceite de oliva)", "Pesto", "Al aceite de oliva", "Con champiñones, espinacas y crema", "La mantequilla", "Bologñesa", "Pimientos, pollo, salsa de soya, cebolla y zanahoria", "Con res en salsa de champiñon", "Ajo mantequilla", "Brocolí, pimientos y proteína a elegir", "Crema de nuez", "Crema de chipotle (puede adicionar proteína)", "Toscana (pollo, crema, cherrys, parmesano y espinacas)", "Hierbas finas", "Mac and cheese", "Mac and cheese con pollo adobado", "Coditos al poblano", "Al poblano y gratín"]
  },
  {
    categoria: "Guarniciones y Ensaladas",
    platillos: ["Verduras al vapor", "A la mantequilla o aceite de oliva", "Ajo mantequilla", "Finas hierbas", "Ensalada de nopales a la mexicana", "Nopales en salsa de guajillo", "Ejotes salteados a la mantequilla", "Ejotes orientales (salsa de soya, ajo y toque de limón)", "Champiñones orientales (Salsa de soya, ajo y limón)", "Puré de papa", "Puré de papa rustico (mantequilla, trocitos de cebolla y parmesano)", "Puré de papa con pimientos", "Papas cambray a la mantequilla", "Cambray adobadas", "Búfalo (Salsa búfalo y especias)", "Ensalada de papa, zanahoria y chicharos"]
  },
  {
    categoria: "Plato Fuerte: Pollo",
    platillos: ["Milanesas al pesto", "Fajitas de pollo", "Con huitlacoche a la mexicana (sujeto a temporadas)", "Hierbas finas", "A la jardinera (jitomate, zanahoria y chicharos)", "Con crema de champiñones", "Picadillo", "Salsa pomodoro (jitomate, albahaca, ajo y aceite de oliva)", "Ensalada de pollo (Lechuga, zanahoria, calabaza, papa, mayonesa y crema)", "Milanesas rellenas de espinaca, queso crema y hierbas finas", "Rellenas de queso (queso crema, panela o manchego) y jamón", "Al ajo romero (recomendación pierna y muslo)", "Alambre de pollo (cebolla, pimientos y queso)", "Yogurt mostaza", "Crema de chipotle", "Tinga de pollo", "Arañitas (tortitas de pollo en caldillo de jitomate)", "Tinga verde", "A la toscana (Cherry, crema, parmesano y espinacas)", "Thai (Jengibre, limón, ajo y pimientos)", "A la plancha con aderezo de yogurt, aceite de oliva, miel y limón", "Salteado de pollo, brócoli y mantequilla", "Muslitos adobados con papas", "Con achiote y nopales (recomendación pierna y muslo)", "Empanizadas", "A la mexicana"]
  },
  {
    categoria: "Plato Fuerte: Carnes rojas",
    platillos: ["Picadillo", "A la mexicana", "Bistec encebollado", "Fajitas", "Alambre (pimientos, cebolla y queso)", "Empanizados", "Albóndigas", "Costillas en salsa de pasilla y papas", "Chuleta ahumada con nopal", "Al pastor (acompañado de salsa, cebolla y cilantro)", "Chop suey (zanahoria, calabaza, pimientos, germen de soya y salsa de soya)", "Deshebrada con jitomate y papas", "Arrachera con pimientos", "Pastel de carne (trigo bulgur, cebolla, hierbabuena y especias platillo árabe)", "Hamburguesas de res", "Arañitas (tortitas de carne deshebrada con caldillo de jitomate)", "Cochinita pibil", "Arrachera con cebolla y brócoli", "Costillas en salsa verde", "Hígado encebollado", "Pancita", "Morisqueta (salsa de jitomate asado)", "Lomo en salsa de guajillo", "Discada", "Chuletas en salsa de queso de cabra"]
  },
  {
    categoria: "Pescados y mariscos",
    platillos: ["Pescado thai (pimientos, jugo de limón, jengibre y ajo)", "Pescado o camarón al achiote", "Marlín al escabeche (col, zanahoria, chile jalapeño y cebolla)", "pescado empapelado", "Camarón o pescado en crema de chipotle", "Ensalada de atún", "A la vizcaína", "Mojo de ajo", "A la mantequilla", "Putanesca (Jitomate, aceitunas y alcaparras)", "A la veracruzana"]
  },
  {
    categoria: "Vegetarianos",
    platillos: ["Salteado de champiñones con setas (pimientos, salsa de soya y cebolla)", "Calabacitas a la mexicana", "Rajas poblanas", "Tinga de col", "Calabacitas con jamon y queso", "Panela asaco con nopales en salsa roja", "Yakimeshi veggie", "Tortitas de calabaza y queso", "Filetes de coliflor", "Hamburguesas de lentejas", "picadillo de soya", "Col oriental (salsa de soya, aceite de ajonjolí, semilla de sésamo y ajo)"]
  }
]

export default function MenuDom() {
  const [searchTerm, setSearchTerm] = useState('')
  const contenedorRef = useRef(null)

  // Función para hacer scroll suave al tocar una tarjeta
  const scrollToSection = (id) => {
    const elemento = document.getElementById(id)
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // se ejecuta cada vez que el usuario escribe en el buscador
  useEffect(() => {
    const contenedor = contenedorRef.current
    contenedor.innerHTML = '' // limpia el contenedor para que no se duplique

    // Ffiltra los datos según lo que el usuario escribió
    const datosFiltrados = menuData.map(seccion => {
      const busqueda = searchTerm.toLowerCase()
      const platillosFiltrados = seccion.platillos.filter(platillo => 
        platillo.toLowerCase().includes(busqueda)
      )
      const coincideTitulo = seccion.categoria.toLowerCase().includes(busqueda)

      if (coincideTitulo || platillosFiltrados.length > 0) {
        return {
          categoria: seccion.categoria,
          platillos: platillosFiltrados.length > 0 ? platillosFiltrados : seccion.platillos
        }
      }
      return null
    }).filter(Boolean)

    if (datosFiltrados.length === 0) {
      const mensaje = document.createElement('p')
      mensaje.textContent = "No encontramos platillos que coincidan con tu búsqueda."
      mensaje.className = "py-12 text-center text-stone-500 font-medium"
      contenedor.appendChild(mensaje)
      return
    }

    // crea la estructura
    datosFiltrados.forEach((seccion) => {
      const bloqueSeccion = document.createElement('div')
      // crea un id para que el scroll lo encuentre
      bloqueSeccion.id = seccion.categoria.replace(/\s+/g, '-').toLowerCase()
      bloqueSeccion.className = 'scroll-mt-28 mb-12' // scroll-mt da margen para que el encabezado no tape el título

      const titulo = document.createElement('h3')
      titulo.textContent = seccion.categoria
      titulo.className = 'font-serif text-2xl font-bold text-stone-900 mb-6 border-b border-stone-200 pb-2'
      bloqueSeccion.appendChild(titulo)

      const lista = document.createElement('ul')
      lista.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4'

      seccion.platillos.forEach((platillo) => {
        const item = document.createElement('li')
        item.className = 'flex items-start gap-2.5 text-stone-600 text-sm'
        
        const viñeta = document.createElement('span')
        viñeta.className = 'h-1.5 w-1.5 shrink-0 rounded-full bg-brand mt-1.5'
        
        const texto = document.createElement('span')
        texto.textContent = platillo

        item.appendChild(viñeta)
        item.appendChild(texto)
        lista.appendChild(item)
      })

      bloqueSeccion.appendChild(lista)
      contenedor.appendChild(bloqueSeccion)
    })
  }, [searchTerm]) // hace que el DOM se regenere al buscar

  return (
    <section id="menu-interactivo" className="px-4 py-16 md:px-8 md:py-24 bg-stone-50/50">
      <div className="mx-auto max-w-7xl">
        
        {/* BUSCADOR */}
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-6 text-center">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Buscar platillos, pastas, sopas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-brand shadow-sm"
            />
          </div>
        </div>

        {/* TARJETAS INTERACTIVAS */}
        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div 
              key={category.title} 
              onClick={() => scrollToSection(category.targetId)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <MenuCard {...category} />
            </div>
          ))}
        </div>

        {/* CONTENEDOR DOM: Aquí se inyecta la lista filtrada con JS puro */}
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm border border-stone-100 md:p-10">
          <div ref={contenedorRef} id="contenedor-menu-dom"></div>
        </div>

      </div>
    </section>
  )
}
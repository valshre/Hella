// Archivo: src/data/eventMenusData.js

export const fixedMenus = {
  semanal: {
    title: 'Menú de la Semana',
    description: 'Nuestras sugerencias balanceadas y deliciosas de lunes a viernes.',
    badgeColor: 'bg-stone-200 text-stone-800',
    bgClass: 'bg-stone-50 border-stone-200/60',
    items: [
      { name: 'Pechuga a la Toscana', desc: 'Con crema, tomates cherry, espinacas y parmesano.' },
      { name: 'Sopa Minestrone', desc: 'Clásica receta italiana con vegetales frescos de huerto.' },
      { name: 'Bowl de Salmón', desc: 'Base de arroz al cilantro con vegetales asados y aguacate.' },
      { name: 'Lasaña Clásica de Res', desc: 'Capas de pasta con boloñesa de la casa y gratinado provolone.' },
      { name: 'Ensalada César con Pollo al Grill', desc: 'Lechuga orejona, crutones artesanales y aderezo original.' },
      { name: 'Crema de Champiñones y Setas', desc: 'Textura sedosa con un toque de ajo asado y tomillo.' },
      { name: 'Tacos de Pescado Estilo Baja', desc: 'Rebozado crujiente, col morada y aderezo de chipotle.' },
      { name: 'Milanesa de Pollo al Pesto', desc: 'Jugosa pechuga empanizada bañada en pesto genovés.' },
      { name: 'Espagueti Pomodoro', desc: 'Salsa de jitomate, albahaca fresca, ajo y aceite de oliva.' },
      { name: 'Filete de Cerdo en Salsa Verde', desc: 'Acompañado de nopales tiernos y arroz blanco.' }
    ]
  },
  especiales: {
    title: 'Especiales del Chef',
    description: 'Nuestras creaciones exclusivas y platillos insignia para consentirte.',
    badgeColor: 'bg-stone-800 text-stone-100',
    bgClass: 'bg-stone-50 border-stone-200/60',
    items: [
      { name: 'Risotto de Huitlacoche', desc: 'Fusión italo-mexicana con un toque de epazote y queso de cabra.' },
      { name: 'Corte Ribeye al Romero', desc: 'Acompañado de puré de papa rústico y espárragos envueltos.' },
      { name: 'Salmón Glaseado', desc: 'Marinado en miel y mostaza antigua sobre cama de quinoa.' },
      { name: 'Pato a la Naranja', desc: 'Pechuga de pato sellada con reducción de cítricos.' },
      { name: 'Paella Mixta Tradicional', desc: 'Azafrán, mariscos frescos, pollo y chorizo español.' },
      { name: 'Filete Mignon', desc: 'Coronado con champiñones al ajillo y salsa de vino tinto.' },
      { name: 'Ravioles de Langosta', desc: 'Pasta artesanal bañada en una delicada salsa de azafrán.' },
      { name: 'Pulpo a las Brasas', desc: 'Macerado en pimentón, acompañado de papas cambray al perejil.' },
      { name: 'Corona de Cordero', desc: 'Costillar horneado con costra de hierbas finas y pistachos.' },
      { name: 'Lomo de Cerdo en Ciruela', desc: 'Medallones tiernos en una reducción agridulce de ciruela pasa.' }
    ]
  }
}

export const getSeasonalMenu = (forcedMonth = null) => {
  // Si nos mandan un mes manual, lo usamos. Si no, usamos el mes actual.
  const month = forcedMonth !== null ? forcedMonth : new Date().getMonth() 
  
  if (month === 1) { // Febrero
    return {
      title: 'Romance y Sabor',
      description: 'Celebra el mes del amor con cenas románticas, detalles dulces y platillos para compartir.',
      badgeColor: 'bg-rose-600 text-white',
      bgClass: 'bg-rose-50 border-rose-200',
      bgImage: '/images/marco-valentin.png', // Imagen asignada
      items: [
        { name: 'Fondue de Quesos Suizos', desc: 'Ideal para compartir, con crutones artesanales, uvas y manzanas.' },
        { name: 'Filete Mar y Tierra', desc: 'Corte de res y camarones al ajillo, símbolo de la unión perfecta.' },
        { name: 'Fetuccini Alfredo con Trufa', desc: 'Pasta sedosa con crema, parmesano y un toque de aceite de trufa.' },
        { name: 'Volcán de Chocolate', desc: 'Centro líquido de chocolate oscuro, servido con helado de vainilla.' },
        { name: 'Fresas Cubiertas Gourmet', desc: 'Selección de fresas bañadas en chocolate semiamargo y blanco.' },
        { name: 'Salmón en Salsa de Frutos Rojos', desc: 'Contraste perfecto de sabores, acompañado de espárragos.' },
        { name: 'Crema de Pimientos Asados', desc: 'De un intenso color rojo, adornada con queso de cabra.' },
        { name: 'Tabla de Charcutería para Dos', desc: 'Selección de carnes frías, quesos maduros y mermelada de higo.' },
        { name: 'Cheesecake de Frambuesa', desc: 'Textura cremosa con coulis fresco de frambuesas.' },
        { name: 'Coctel Beso de Ángel', desc: 'Bebida dulce a base de fresa, crema de coco y un toque de ron.' }
      ]
    }
  } 
  else if (month >= 5 && month <= 7) { // Verano
    return {
      title: 'Frescura de Verano',
      description: 'Platillos ligeros, mariscos y bebidas refrescantes para combatir el calor.',
      badgeColor: 'bg-sky-500 text-white',
      bgClass: 'bg-sky-50 border-sky-200',
     bgImage: '/images/marco-verano.png',
      items: [
        { name: 'Ceviche Tropical', desc: 'Pescado fresco curtido al limón con trozos de mango manila y habanero.' },
        { name: 'Ensalada de Sandía y Feta', desc: 'Combinación ultra refrescante con menta y reducción de balsámico.' },
        { name: 'Aguachile Verde de Camarón', desc: 'Picante y fresco, con pepino, cebolla morada y cilantro.' },
        { name: 'Tacos de Lechuga con Pollo Thai', desc: 'Hojas frescas rellenas de pollo marinado en cacahuate y soya.' },
        { name: 'Gazpacho Andaluz', desc: 'Sopa fría tradicional de jitomate y vegetales crudos.' },
        { name: 'Limonada de Frutos Rojos', desc: 'Bebida helada natural, perfecta para acompañar tus comidas.' },
        { name: 'Tartar de Atún', desc: 'Atún aleta amarilla con aguacate, ajonjolí y toques cítricos.' },
        { name: 'Brochetas Hawaianas', desc: 'Pollo y piña asada al carbón con glaseado teriyaki.' },
        { name: 'Smoothie Bowl de Mango', desc: 'Bowl frío de frutas de temporada con granola artesanal.' },
        { name: 'Pescado Empapelado con Cítricos', desc: 'Filete blanco cocinado al vapor en sus propios jugos y rodajas de naranja.' }
      ]
    }
  }
  else if (month === 8) { // Septiembre
    return {
      title: 'Noches Mexicanas',
      description: 'El orgullo de nuestra tierra en cada bocado. Colores patrios y tradición.',
      badgeColor: 'bg-emerald-600 text-white',
      bgClass: 'bg-emerald-50 border-emerald-200',
      bgImage: '/images/marco-mexicano.png',
      items: [
        { name: 'Chiles en Nogada', desc: 'El rey de la temporada: relleno de carne y frutas, bañado en salsa de nuez.' },
        { name: 'Pozole Rojo de Cerdo', desc: 'Caldo tradicional con cacahuazintle, rábano, lechuga y tostadas.' },
        { name: 'Sopes Surtidos', desc: 'Base de maíz con frijoles, pollo, bistec, crema y queso fresco.' },
        { name: 'Tostadas de Tinga', desc: 'Pollo deshebrado en caldillo de jitomate y chipotle.' },
        { name: 'Enchiladas Potosinas', desc: 'Masa enchilada rellena de queso y cebolla, fritas y crujientes.' },
        { name: 'Cantarito Preparado', desc: 'Bebida cítrica fría servida en barro tradicional.' },
        { name: 'Flan Napolitano', desc: 'Postre clásico mexicano bañado en caramelo.' },
        { name: 'Guacamole en Molcajete', desc: 'Recién preparado con pico de gallo y totopos horneados.' },
        { name: 'Tamalitos Oaxaqueños', desc: 'De mole y verde, envueltos en hoja de plátano.' },
        { name: 'Agua de Horchata y Jamaica', desc: 'El dúo clásico para refrescar la noche mexicana.' }
      ]
    }
  }
  else if (month === 9 || month === 10) { // Octubre y Noviembre
    return {
      title: 'Tradición y Recuerdo',
      description: 'Sabores que trascienden: pan de muerto, mole y la herencia de nuestras abuelas.',
      badgeColor: 'bg-orange-600 text-white',
      bgClass: 'bg-orange-50 border-orange-200',
      bgImage: '/images/marco-muertos.png',
      items: [
        { name: 'Pan de Muerto Tradicional', desc: 'Esponjoso, con esencia de azahar y cubierto de azúcar.' },
        { name: 'Pan de Muerto Relleno', desc: 'Variedad rellena de crema de nata o crema de avellanas.' },
        { name: 'Mole Poblano con Pollo', desc: 'Nuestra receta secreta de más de 20 ingredientes con arroz rojo.' },
        { name: 'Calabaza en Tacha', desc: 'Dulce tradicional cocido a fuego lento con piloncillo y canela.' },
        { name: 'Chocolate Caliente Espumoso', desc: 'Hecho con tablilla de chocolate artesanal, ideal para chopear.' },
        { name: 'Tamales de Dulce y Sal', desc: 'Selección de tamales rosados con pasas y de rajas con queso.' },
        { name: 'Atole de Cempasúchil', desc: 'Innovación de la casa, una bebida cremosa y aromática.' },
        { name: 'Corundas Michoacanas', desc: 'Tamalitos en forma de estrella servidos con crema y salsa.' },
        { name: 'Dulce de Tejocote', desc: 'En almíbar de canela, el postre perfecto de otoño.' },
        { name: 'Sopa de Médula', desc: 'Reconfortante y caliente, un clásico de la cocina de recolección.' }
      ]
    }
  }
  else if (month === 11 || month === 0) { // Diciembre y Enero
    return {
      title: 'Fiestas Decembrinas',
      description: 'El calor del hogar en nuestra mesa. Cenas festivas, abrazos y recalentado.',
      badgeColor: 'bg-red-700 text-white',
      bgClass: 'bg-red-50 border-red-200',
      bgImage: '/images/marco-navidad.png',
      items: [
        { name: 'Pavo Rostizado', desc: 'Relleno de carne molida, frutos secos y bañado en su gravy.' },
        { name: 'Romeritos con Mole', desc: 'Platillo tradicional con tortitas de camarón y papas cambray.' },
        { name: 'Bacalao a la Vizcaína', desc: 'Preparado con aceite de oliva, pimientos, aceitunas y alcaparras.' },
        { name: 'Lomo de Cerdo Adobado', desc: 'Horneado lentamente, jugoso y con un ligero toque picante.' },
        { name: 'Ensalada de Manzana', desc: 'La clásica navideña con crema, nuez, pasas y piña.' },
        { name: 'Ponche de Frutas Caliente', desc: 'Bebida reconfortante con caña, tejocote, guayaba y jamaica.' },
        { name: 'Pierna Claveteada', desc: 'Pierna de cerdo al horno marinada en vino blanco y clavo.' },
        { name: 'Espagueti Verde al Poblano', desc: 'Pasta cremosa horneada con queso manchego fundido.' },
        { name: 'Tronco Navideño', desc: 'Pastel de rollo sabor chocolate decorado para las fiestas.' },
        { name: 'Crema de Nuez', desc: 'Entrada cálida y elegante para iniciar tu cena de Nochebuena.' }
      ]
    }
  }
  else { // Primavera
    return {
      title: 'Brote de Primavera',
      description: 'Ingredientes orgánicos, flores comestibles y colores vibrantes de temporada.',
      badgeColor: 'bg-brand text-white',
      bgClass: 'bg-brand-soft border-brand/20',
      bgImage:'/images/primavera.png',
      items: [
        { name: 'Ensalada de Berros y Fresa', desc: 'Hojas frescas, nuez tostada y aderezo de miel y mostaza.' },
        { name: 'Pechuga Rellena de Flor de Calabaza', desc: 'Bañada en una ligera salsa de poblano.' },
        { name: 'Tarta de Frutas Frescas', desc: 'Base de pasta quebrada, crema pastelera y fruta de estación.' },
        { name: 'Risotto de Espárragos', desc: 'Cremoso y vibrante, decorado con virutas de parmesano.' },
        { name: 'Agua Fresca de Pepino y Limón', desc: 'Con un toque de chía, perfecta para refrescar la tarde.' },
        { name: 'Crema de Chícharos a la Menta', desc: 'Sopa ligera y aromática de color verde intenso.' },
        { name: 'Pollo al Limón y Romero', desc: 'Aves de granja cocinadas al horno con hierbas frescas.' },
        { name: 'Ceviche de Champiñones', desc: 'Opción vegana y fresca marinada en jugo de limón y pico de gallo.' },
        { name: 'Helado Artesanal de Lavanda', desc: 'Postre delicado con notas florales inconfundibles.' },
        { name: 'Carpaccio de Calabacín', desc: 'Láminas súper finas de calabaza con aceite de oliva y piñones.' }
      ]
    }
  }
}
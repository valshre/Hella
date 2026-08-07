import { Client } from '@elastic/elasticsearch';

const client = new Client({
  // RECUERDA PONER TUS CREDENCIALES REALES AQUÍ:
  node: 'https://my-elasticsearch-project-ec2f3b.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: 'U2d3SHhwOEJUQ0pRazdZVkpwcjU6bm5ROHFBTWxneEx6eGpzSnV1ekRGQQ=='
  }
});

const indexName = 'hella-todo-sitio';

async function poblarBuscador() {
  try {
    const indexExists = await client.indices.exists({ index: indexName });
    if (indexExists) await client.indices.delete({ index: indexName });

    const datosFinales = [
      // ==========================================
      // 1. INICIO
      // ==========================================
      {
        titulo: 'Inicio - HELLA',
        descripcion: 'Chefs profesionales a tu mesa. Menús diseñados a medida y experiencias gastronómicas inolvidables.',
        ruta: '/',
        contenido: 'INICIO:La alta cocina llega a la comodidad de tu hogar En HELLA llevamos chefs profesionales a tu mesa. Menús diseñados a medida, ingredientes selectos y una experiencia gastronómica inolvidable, sin salir de casa. Activo ahora: Cosecha de Lluvias Cosecha de Lluvias Cacao profundo con notas terrosas y húmedas, ideal para paladares intensos. Compra 2 barras 70% cacao y obtén un 15% de descuento. lta cocina, hecha a tu medida Nuestro Menú Descubre nuestra carta profesional: entradas, arroces, pastas, guarniciones y platos fuertes. Ver el menú Cómo funciona Un servicio de chef privado bajo contrato, paso a paso, pensado para tu tranquilidad. Conocer el servicio Nuestra historia La pasión, el detalle y la calidad que dieron vida a HELLA. Conoce quiénes somos. Leer la historia footer: HELLA Chefs privados a domicilio. Experiencias gastronómicas de lujo, hechas a tu medida. Contacto +52 55 1234 5678 hella@gmail.com Querétaro, Qro. Navegación Inicio Menú Servicio Sobre Nosotros Contacto'
      },
      
      // ==========================================
      // 2. SERVICIO
      // ==========================================
      {
        titulo: 'Servicio y Contratación',
        descripcion: 'Un servicio de chef privado bajo contrato, pensado para que vivas la alta cocina sin preocuparte de nada.',
        ruta: '/servicio',
        contenido: 'SERVICIO:Un servicio de chef privado bajo contrato, pensado para que vivas la alta cocina sin preocuparte de nada. Paso a paso De la primera llamada a tu mesa Un proceso simple y transparente en cinco pasos. 1 Primer contacto Nos cuentas sobre tu evento: fecha, número de invitados, ocasión y estilo que imaginas. 2 Diseño del menú Creamos contigo un menú a medida, considerando tus gustos, alergias y preferencias. 3 Compra de ingredientes Seleccionamos productos frescos y de temporada de los mejores proveedores. 4 El gran día Tu chef llega a casa, cocina frente a ti y sirve cada tiempo en su punto ideal. 5 Solo disfruta Nos encargamos de todo, incluida la limpieza. Tú solo te ocupas de tus invitados. Chef privado de HELLA emplatando con dedicación Nuestro modelo Un chef profesional, dedicado por completo a tu mesa Nos encargamos de todo —del menú a la limpieza— para que solo te ocupes de disfrutar a tus invitados. Servicio bajo contrato Contrata a tu chef de manera recurrente o por evento, con condiciones claras y total transparencia. Experiencia personalizada Diseñamos cada menú contigo, adaptándonos a tus preferencias, restricciones y el estilo de tu celebración. Ingredientes de alta calidad Seleccionamos productos frescos y de temporada de los mejores proveedores para cada preparación. ¿List@ para reservar tu chef? Cuéntanos sobre tu evento y comencemos a planear tu experiencia. Reservar chef'
      },

      // ==========================================
      // 3. SOBRE NOSOTROS
      // ==========================================
      {
        titulo: 'Sobre Nosotros',
        descripcion: 'La historia de HELLA: Pasión, calidad y detalle en cada platillo.',
        ruta: '/sobre-nosotros',
        contenido: 'SOBRE NOSOTROS: Una historia de pasión por la cocina Detrás de HELLA hay chefs que sueñan con transformar cada comida en un recuerdo inolvidable. Chef de HELLA preparando ingredientes en una cocina luminosa Nuestra historia Nacimos para llevar la alta cocina a tu hogar HELLA comenzó con una idea sencilla pero poderosa: que nadie debería salir de casa para vivir una experiencia gastronómica extraordinaria. Lo que empezó como cenas para amigos y familia se convirtió en una vocación. Hoy somos un equipo de chefs profesionales que comparte una misma filosofía: respetar el producto, cuidar cada detalle y poner toda nuestra pasión al servicio de tu mesa. Cada menú es único, porque cada ocasión y cada persona también lo son. Lo que nos define Tres principios guían cada experiencia que creamos. Pasión Cocinamos con el corazón. Cada platillo nace del amor por el oficio y el deseo de emocionar. Calidad Solo trabajamos con ingredientes selectos y técnicas precisas. La excelencia es nuestro estándar. Detalle El secreto está en lo pequeño: el emplatado, el tiempo, la atención a cada invitado. Nuestro camino 2018 El primer servicio Una cena íntima para ocho personas marcó el inicio de un sueño: llevar la alta cocina al hogar. 2020 Un equipo que crece Chefs apasionados se unen a HELLA, ampliando estilos, técnicas y propuestas culinarias. 2023 Experiencias a la medida Lanzamos el servicio bajo contrato, con menús totalmente personalizados para cada ocasión. Hoy Tu mesa, nuestra pasión Seguimos creando momentos memorables, un platillo y una sonrisa a la vez. Hagamos historia en tu mesa Permítenos ser parte de tu próxima celebración. Reservar chef'
      },

      // ==========================================
      // 4. CONTACTO Y PALABRAS CLAVE EXTRA
      // ==========================================
      {
        titulo: 'Contacto',
        descripcion: 'Hablemos de tu evento. Estamos listos para ayudarte a crear una experiencia gastronómica inolvidable.',
        ruta: '/contacto',
        // AQUÍ ESTÁN LAS PALABRAS EXTRA (numero, celular, whatsapp) PARA QUE EL BUSCADOR LAS ENCUENTRE:
        contenido: 'CONTACTO: Cuéntanos sobre tu evento y nuestro equipo te contactará para diseñar un menú a tu medida. Hablemos de tu evento Estamos list@s para ayudarte a crear una experiencia gastronómica inolvidable. Escríbenos por el medio que prefieras. Teléfono +52 55 1234 5678 Correo hella@gmail.com Cobertura Querétaro, Qro. Horario Lun a Dom · 9:00 - 21:00 numero celular whatsapp telefono movil ubicacion direccion dudas soporte ayuda mensaje'
      },

      // ==========================================
      // 5. MENÚ (Dividido en secciones para resultados más precisos)
      // ==========================================
      {
        titulo: 'Menú - Sopas, Caldos y Cremas',
        descripcion: 'Reconfortantes y llenas de sabor: Minestrone, Mole de olla, Cremas y más.',
        ruta: '/menu',
        contenido: 'MENU:Una carta diseñada para tu ocasión Cada categoría se personaliza según tus gustos. Nuestros chefs adaptan recetas, porciones e ingredientes a la medida de tu evento. Menú Fijo General Especiales y Temporadas Buscar platillos, pastas, sopas... Entradas El inicio perfecto: reconfortantes y llenas de sabor. Sopas Caldos Cremas Sopas, caldos y cremas De nopal Nopal a la mexicana Acelgas De pasta (aguada) Minestrone Papa Champiñones Champiñones al ajillo Champiñones con setas Lentejas Lentejas árabes (estofado de lentejas con pequeñas albóndigas de carne y especias) Fideo seco Cebolla De verduras Azteca (queso panela, chile pasilla y tortilla) Poro y papa Calabazas con elote y queso panela Milpa (calabaza, poblano, cebolla, pollo y elote) Caldito tlalpeño (Jitomate, chipotle, calabaza, zanahoria y pollo) Mole de olla De pollo Camarón Crema de zanahoria Espinacas Champiñones De calabazas con espinacas'
      },
      {
        titulo: 'Menú - Arroces y Pastas',
        descripcion: 'Clásicos reinventados con técnica: Yakimeshi, Pastas frescas, Risottos y Paellas.',
        ruta: '/menu',
        contenido: 'Arroces y pastas Clásicos reinventados con técnica y dedicación. Risottos Paellas Pastas frescas Arroces y pastas Rojo A la jardinera (rojo, zanahoria y chícharo) Blanco Blanco con elote y/o ejote Al vapor Con champiñones Al cilantro A la mantequilla Con poblano y cilantro Yakimeshi (Salsa de soya, proteína, zanahoria y calabaza) Hierbas finas Curry Ajo y mantequilla Pasta aurora (jitomate y crema) Con crema jamón y queso Con crema de champiñones Al poblano Alfredo Crema de tocino y chipotle Crema de espinaca Pollo, brócoli y mantequilla Tepanyaki Pomodoro (Jitomate, albahaca, ajo y aceite de oliva) Pesto Al aceite de oliva Con champiñones, espinacas y crema La mantequilla Bologñesa Pimientos, pollo, salsa de soya, cebolla y zanahoria Con res en salsa de champiñon Ajo mantequilla Brocolí, pimientos y proteína a elegir Crema de nuez Crema de chipotle (puede adicionar proteína) Toscana (pollo, crema, cherrys, parmesano y espinacas) Hierbas finas Mac and cheese Mac and cheese con pollo adobado Coditos al poblano Al poblano y gratín'
      },
      {
        titulo: 'Menú - Guarniciones y Ensaladas',
        descripcion: 'Acompañamientos frescos que realzan cada platillo.',
        ruta: '/menu',
        contenido: 'Guarniciones y ensaladas Acompañamientos frescos que realzan cada platillo. Ensaladas Vegetales Guarniciones Guarniciones y Ensaladas Verduras al vapor A la mantequilla o aceite de oliva Ajo mantequilla Finas hierbas Ensalada de nopales a la mexicana Nopales en salsa de guajillo Ejotes salteados a la mantequilla Ejotes orientales (salsa de soya, ajo y toque de limón) Champiñones orientales (Salsa de soya, ajo y limón) Puré de papa Puré de papa rustico (mantequilla, trocitos de cebolla y parmesano) Puré de papa con pimientos Papas cambray a la mantequilla Cambray adobadas Búfalo (Salsa búfalo y especias) Ensalada de papa, zanahoria y chicharos'
      },
      {
        titulo: 'Menú - Platos Fuertes (Pollo y Carnes)',
        descripcion: 'El corazón de la experiencia: Aves, Cortes de Res y preparaciones tradicionales.',
        ruta: '/menu',
        contenido: 'Platos fuertes El corazón de la experiencia, a tu elección. Pollo Carnes rojas Plato Fuerte: Pollo Milanesas al pesto Fajitas de pollo Con huitlacoche a la mexicana (sujeto a temporadas) Hierbas finas A la jardinera (jitomate, zanahoria y chicharos) Con crema de champiñones Picadillo Salsa pomodoro (jitomate, albahaca, ajo y aceite de oliva) Ensalada de pollo (Lechuga, zanahoria, calabaza, papa, mayonesa y crema) Milanesas rellenas de espinaca, queso crema y hierbas finas Rellenas de queso (queso crema, panela o manchego) y jamón Al ajo romero (recomendación pierna y muslo) Alambre de pollo (cebolla, pimientos y queso) Yogurt mostaza Crema de chipotle Tinga de pollo Arañitas (tortitas de pollo en caldillo de jitomate) Tinga verde A la toscana (Cherry, crema, parmesano y espinacas) Thai (Jengibre, limón, ajo y pimientos) A la plancha con aderezo de yogurt, aceite de oliva, miel y limón Salteado de pollo, brócoli y mantequilla Muslitos adobados con papas Con achiote y nopales (recomendación pierna y muslo) Empanizadas A la mexicana Plato Fuerte: Carnes rojas Picadillo A la mexicana Bistec encebollado Fajitas Alambre (pimientos, cebolla y queso) Empanizados Albóndigas Costillas en salsa de pasilla y papas Chuleta ahumada con nopal Al pastor (acompañado de salsa, cebolla y cilantro) Chop suey (zanahoria, calabaza, pimientos, germen de soya y salsa de soya) Deshebrada con jitomate y papas Arrachera con pimientos Pastel de carne (trigo bulgur, cebolla, hierbabuena y especias platillo árabe) Hamburguesas de res Arañitas (tortitas de carne deshebrada con caldillo de jitomate) Cochinita pibil Arrachera con cebolla y brócoli Costillas en salsa verde Hígado encebollado Pancita Morisqueta (salsa de jitomate asado) Lomo en salsa de guajillo Discada Chuletas en salsa de queso de cabra'
      },
      {
        titulo: 'Menú - Pescados, Mariscos y Vegetarianos',
        descripcion: 'Frescura del mar y alternativas plant-based llenas de sabor.',
        ruta: '/menu',
        contenido: 'Pescados Mariscos Vegetariano Pescados y mariscos Pescado thai (pimientos, jugo de limón, jengibre y ajo) Pescado o camarón al achiote Marlín al escabeche (col, zanahoria, chile jalapeño y cebolla) pescado empapelado Camarón o pescado en crema de chipotle Ensalada de atún A la vizcaína Mojo de ajo A la mantequilla Putanesca (Jitomate, aceitunas y alcaparras) A la veracruzana Vegetarianos Salteado de champiñones con setas (pimientos, salsa de soya y cebolla) Calabacitas a la mexicana Rajas poblanas Tinga de col Calabacitas con jamon y queso Panela asaco con nopales en salsa roja Yakimeshi veggie Tortitas de calabaza y queso Filetes de coliflor Hamburguesas de lentejas picadillo de soya Col oriental (salsa de soya, aceite de ajonjolí, semilla de sésamo y ajo) Todos los platillos son personalizables. Cuéntanos tus preferencias, alergias o restricciones y nuestro chef diseñará el menú ideal para ti. Diseñemos tu menú juntos Reserva una consulta y crea una carta a la medida de tu evento. Solicitar menú personalizado vegano'
      }
    ];

    console.log(`Insertando ${datosFinales.length} bloques de contenido en Elasticsearch...`);

    for (const doc of datosFinales) {
      await client.index({
        index: indexName,
        document: doc,
      });
    }

    await client.indices.refresh({ index: indexName });
    console.log("✅ ¡Buscador poblado con éxito con TODO el contenido literal de HELLA!");

  } catch (error) {
    console.error("❌ Error al poblar:", error.message);
  }
}

poblarBuscador();
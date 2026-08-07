import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'https://my-elasticsearch-project-b2a097.es.us-central1.gcp.elastic.cloud:443',
  auth: { apiKey: 'RFFIT0VaOEJHLThrU00wQjhFVGU6bWxXc1AwV0tCS1BJRFB3SlpnZTZPUQ==' }
});

async function llenarDatos() {
  const indice = 'hella-contenido';
  const datos = [
    { titulo: 'Inicio', contenido: 'Chefs privados a domicilio. Experiencias gastronómicas de lujo, hechas a tu medida.', descripcion: 'Página de inicio' },
    { titulo: 'Menú', contenido: 'Explora nuestros platillos de temporada, ingredientes frescos, cocina de autor, salmón, carnes, postres.', descripcion: 'Nuestro menú' },
    { titulo: 'Servicio', contenido: 'Eventos personalizados, chef en casa, cenas románticas, reuniones familiares.', descripcion: 'Detalles del servicio' },
    { titulo: 'Sobre Nosotros', contenido: 'Héctor Torres, experiencia culinaria, trayectoria, pasión por la cocina.', descripcion: 'Conócenos' },
    { titulo: 'Contacto', contenido: 'Agenda tu evento, cotizaciones, reserva, teléfono, correo electrónico.', descripcion: 'Contacto' }
  ];

  try {
    // Borrar índice previo si existe
    if (await client.indices.exists({ index: indice })) {
      await client.indices.delete({ index: indice });
    }
    // Crear nuevo
    await client.indices.create({ index: indice });
    
    // Subir datos
    const operations = datos.flatMap(doc => [{ index: { _index: indice } }, doc]);
    await client.bulk({ refresh: true, operations });
    
    console.log('✅ ¡Índice creado y datos cargados exitosamente!');
  } catch (err) {
    console.error('❌ Error al cargar datos:', err);
  }
}

llenarDatos();
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'https://my-elasticsearch-project-b2a097.es.us-central1.gcp.elastic.cloud:443',
  auth: { apiKey: 'RFFIT0VaOEJHLThrU00wQjhFVGU6bWxXc1AwV0tCS1BJRFB3SlpnZTZPUQ==' }
});

async function run() {
  try {
    // 1. Eliminar índice viejo si existe para evitar errores
    if (await client.indices.exists({ index: 'hella-contenido' })) {
      await client.indices.delete({ index: 'hella-contenido' });
    }

    // 2. Crear índice nuevo
    await client.indices.create({ index: 'hella-contenido' });

    // 3. Subir datos
    const docs = [
      { titulo: 'Inicio', descripcion: 'Chefs privados a domicilio.', ruta: '/', contenido: 'chef privado a domicilio querétaro' },
      { titulo: 'Menú', descripcion: 'Platillos de temporada.', ruta: '/menu', contenido: 'salmón res carne vegano platillos' },
      { titulo: 'Servicios', descripcion: 'Eventos personalizados.', ruta: '/servicio', contenido: 'bodas eventos catering banquetes' }
    ];

    const operations = docs.flatMap(doc => [{ index: { _index: 'hella-contenido' } }, doc]);
    await client.bulk({ refresh: true, operations });

    console.log('✅ Base de datos lista. El buscador ya debería funcionar.');
  } catch (e) {
    console.error('❌ Error crítico:', e);
  }
}
run();
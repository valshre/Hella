import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  node: 'https://my-elasticsearch-project-b2a097.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: 'bHdIMUVaOEJHLThrU00wQklFYWw6VnJMZWZySXlPV2xfbnNYcHB0UjROZw=='
  }
});

async function indexarTodo() {
  const indice = 'hella-todo-sitio';

  const carpetasAIndexar = [
    path.join(__dirname, '../hella-web/src/pages'),
    path.join(__dirname, '../hella-web/src/components')
  ];

  let todosLosDocumentos = [];

  for (const carpeta of carpetasAIndexar) {

    if (!fs.existsSync(carpeta)) {
      console.warn(`⚠️ Carpeta no encontrada: ${carpeta}`);
      continue;
    }

    const archivos = fs.readdirSync(carpeta);

    for (const archivo of archivos) {

      if (!archivo.endsWith('.jsx')) continue;

      const rutaCompleta = path.join(carpeta, archivo);

      const contenido = fs.readFileSync(rutaCompleta, 'utf-8');

      // EXTRAER TEXTO HUMANO
      const textoLimpio = contenido
        .replace(/import[\s\S]*?from.*?;/g, ' ')
        .replace(/export default/g, ' ')
        .replace(/className=/g, ' ')
        .replace(/[{}<>/=();"]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      todosLosDocumentos.push({
        titulo: archivo.replace('.jsx', ''),
        contenido: textoLimpio,
        ruta: '/' + archivo.replace('.jsx', '').toLowerCase()
      });

      console.log(`✅ Archivo indexado: ${archivo}`);
    }
  }

  try {
  await client.indices.delete({
    index: indice
  });

  console.log('🗑 Índice eliminado');
} catch (error) {
  console.log('ℹ️ El índice no existía, continuando...');
}

  // CREAR ÍNDICE
  await client.indices.create({
    index: indice,
    mappings: {
      properties: {
        titulo: { type: 'text' },
        contenido: { type: 'text' },
        ruta: { type: 'keyword' }
      }
    }
  });

  // SUBIR DOCUMENTOS
  const operations = todosLosDocumentos.flatMap(doc => [
    { index: { _index: indice } },
    doc
  ]);

  await client.bulk({
    refresh: true,
    operations
  });

  console.log(`🎉 Se indexaron ${todosLosDocumentos.length} archivos`);
}

indexarTodo();
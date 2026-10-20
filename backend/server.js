import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import { Client } from '@elastic/elasticsearch';

// ==========================
// IMPORTAR RUTAS Y DEPENDENCIAS DE SEGURIDAD
// ==========================
import authRoutes from './authRoutes.js'; 
import jwt from 'jsonwebtoken'; // <-- NUEVO: Para verificar el token
import pool from './config/db.js'; // <-- NUEVO: Conexión a tu BD PostgreSQL

const app = express();
const SECRET_KEY = 'clave_secreta_hella_2026'; // Debe coincidir con la de authRoutes

// ==========================
// MIDDLEWARES
// ==========================
app.use(cors({
  origin: 'https://hella-cyan.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ==========================
// ACTIVAR RUTAS DE AUTENTICACIÓN
// ==========================
app.use('/api', authRoutes);
app.use('/api', authRoutes);
// ==========================
// RESEND
// ==========================
const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================
// ELASTICSEARCH
// ==========================
const client = new Client({
  node: 'https://my-elasticsearch-project-ec2f3b.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: 'U2d3SHhwOEJUQ0pRazdZVkpwcjU6bm5ROHFBTWxneEx6eGpzSnV1ekRGQQ=='
  }
});

// ==========================
// PROBAR CONEXIÓN ELASTIC
// ==========================
client.info()
  .then(response => {
    console.log(' Conexión exitosa a Elastic Cloud');
  })
  .catch(error => {
    console.error('Error conectando a Elastic:', error.message);
  });

// ==========================
// RUTA CONTACTO (SEGURIZADA)
// ==========================
app.post('/api/contacto', async (req, res) => {
  try {
    // 1. Extraemos los campos del body
    const { fecha, invitados, mensaje, asunto } = req.body;
    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let usuario_id = null;

    // 2. VERIFICACIÓN DE SEGURIDAD (JWT)
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        // Extraemos el ID del token
        const decoded = jwt.verify(token, SECRET_KEY);
        usuario_id = decoded.id;
        
        // Consultamos la BD para obtener la información REAL, ignorando al frontend
        const result = await pool.query('SELECT nombre, email FROM usuarios WHERE id = $1', [usuario_id]);
        
        if (result.rows.length > 0) {
          nombre = result.rows[0].nombre;
          correo = result.rows[0].email;
        }
      } catch (tokenError) {
        // Rechazamos peticiones con tokens manipulados o expirados
        return res.status(401).json({ error: "Sesión inválida o expirada. Vuelve a iniciar sesión." });
      }
    }

    // 3. Validación básica de datos obligatorios
    if (!nombre || !correo || !asunto || !mensaje) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

  // 4. Enviar correo vía Resend con los datos validados y un hermoso diseño HTML
    const data = await resend.emails.send({
      from: 'HELLA <onboarding@resend.dev>',
      to: ['valecorts6@gmail.com'],
      subject: `Nueva solicitud de ${asunto} - ${nombre}`, // Asunto dinámico
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Encabezado Rojo -->
          <div style="background-color: #E60000; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">Nueva ${asunto}</h1>
          </div>
          
          <!-- Contenido -->
          <div style="padding: 30px; background-color: #ffffff;">
            
            <h3 style="color: #E60000; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; font-size: 18px;">👤 Datos del Cliente</h3>
            <p style="color: #374151; font-size: 15px; margin: 8px 0;"><strong>Nombre:</strong> ${nombre}</p>
            <p style="color: #374151; font-size: 15px; margin: 8px 0;"><strong>Correo:</strong> ${correo}</p>

            <!-- Renderizado dinámico: Solo aparece si es Reservación -->
            ${asunto === 'Reservacion' ? `
              <h3 style="color: #E60000; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; font-size: 18px; margin-top: 25px;">📅 Detalles del Evento</h3>
              <p style="color: #374151; font-size: 15px; margin: 8px 0;"><strong>Fecha:</strong> ${fecha || 'No especificada'}</p>
              <p style="color: #374151; font-size: 15px; margin: 8px 0;"><strong>Nº de Invitados:</strong> ${invitados || 'No especificados'}</p>
            ` : ''}

            <h3 style="color: #E60000; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; font-size: 18px; margin-top: 25px;">📝 Mensaje / Detalles</h3>
            <div style="background-color: #f9fafb; border-left: 4px solid #E60000; padding: 15px; border-radius: 0 8px 8px 0; margin-top: 15px;">
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${mensaje}</p>
            </div>
            
          </div>
          
          <!-- Pie de página -->
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">Este mensaje fue enviado automáticamente desde el formulario web de <strong>HELLA</strong>.</p>
          </div>

        </div>
      `
    });
    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error(' Error en endpoint de contacto:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================
// RUTA BUSCADOR ULTRA-FLEXIBLE
// ==========================
app.get('/api/buscar', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Debes escribir algo para buscar' });
    }

    // 1. Transformamos la búsqueda. 
    // Ejemplo: Si el usuario escribe "pan num", se convierte en "*pan* AND *num*"
    const busquedaComodines = q.trim().split(/\s+/).map(palabra => `*${palabra}*`).join(' AND ');

    // 2. Buscamos usando query_string, que acepta los asteriscos para buscar fragmentos
    const result = await client.search({
      index: 'hella-todo-sitio',
      query: {
        query_string: {
          query: busquedaComodines,
          fields: ['titulo^3', 'descripcion^2', 'contenido'] // Busca en los tres campos a la vez
        }
      }
    });

    const hits = result.hits.hits.map(hit => ({
      id: hit._id,
      titulo: hit._source.titulo,           
      descripcion: hit._source.descripcion, 
      ruta: hit._source.ruta                
    }));

    return res.json(hits);

  } catch (error) {
    console.error('Error en Elasticsearch:', error);
    return res.status(500).json({ error: 'Error al realizar la búsqueda' });
  }
});
// ==========================
// RUTA ADMIN: LISTA DE USUARIOS
// ==========================
app.get('/api/admin/usuarios', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });

    // Traemos todos los usuarios, su rol y su estado actual
    const query = `
      SELECT u.id, u.nombre, u.email, u.deshabilitado_en, r.nombre AS rol 
      FROM usuarios u 
      JOIN usuario_rol ur ON u.id = ur.usuario_id 
      JOIN roles r ON ur.rol_id = r.id
      ORDER BY u.id ASC;
    `;
    const resultado = await pool.query(query);
    res.status(200).json(resultado.rows);

  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
});

// ==========================
// RUTA ADMIN: HABILITAR/INHABILITAR USUARIO
// ==========================
app.put('/api/admin/usuarios/:id/toggle', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });

    const usuarioId = req.params.id;

    // 1. Revisamos el estado actual del usuario
    const checkQuery = 'SELECT deshabilitado_en FROM usuarios WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [usuarioId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const estaDeshabilitado = checkResult.rows[0].deshabilitado_en !== null;

    // 2. Invertimos el estado (Si está inhabilitado, lo volvemos NULL. Si está activo, le ponemos la fecha actual)
    const updateQuery = `
      UPDATE usuarios 
      SET deshabilitado_en = CASE WHEN $2::boolean THEN NULL ELSE CURRENT_TIMESTAMP END
      WHERE id = $1
    `;
    
    await pool.query(updateQuery, [usuarioId, estaDeshabilitado]);

    res.status(200).json({ mensaje: "Estado del usuario actualizado correctamente." });

  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    res.status(500).json({ error: "Error interno al actualizar usuario." });
  }
});
// ==========================
// RUTA ADMIN: ESTADÍSTICAS
// ==========================
app.get('/api/admin/stats', async (req, res) => {
  try {
    // 1. Verificación de seguridad (Opcional pero recomendada: verificar que el token sea de un Admin)
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });
    // Aquí podrías desencriptar el JWT y validar que el rol sea 'Administrador'

    // 2. Consulta real: Conteo de usuarios agrupados por rol
    const queryUsuarios = `
      SELECT r.nombre AS rol, COUNT(u.id) AS cantidad 
      FROM roles r
      LEFT JOIN usuario_rol ur ON r.id = ur.rol_id
      LEFT JOIN usuarios u ON ur.usuario_id = u.id
      GROUP BY r.nombre;
    `;
    const resultadoUsuarios = await pool.query(queryUsuarios);

    // 3. (Opcional) Si en el futuro creas una tabla 'contactos' o 'reservas', aquí harías el COUNT:
    // const queryReservas = 'SELECT COUNT(*) as total FROM reservas';
    // const totalReservas = await pool.query(queryReservas);

    res.status(200).json({
      usuarios: resultadoUsuarios.rows.map(row => ({
        rol: row.rol,
        cantidad: parseInt(row.cantidad) // PostgreSQL devuelve los COUNT como strings, hay que parsearlos
      }))
    });

  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// ==========================
// RUTA TEST
// ==========================
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// ==========================
// MANEJO GLOBAL DE ERRORES
// ==========================
app.use((err, req, res, next) => {
  console.error(' Error global:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Algo salió mal en el servidor'
  });
});

// ==========================
// INICIAR SERVIDOR
// ==========================
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});

// ==========================
// EVITAR CIERRES
// ==========================
server.on('error', (err) => {
  console.error('Error del servidor:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Promesa rechazada:', reason);
});
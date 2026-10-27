import { Router } from 'express';
import pool from './config/db.js'; // Conexión a PostgreSQL

const router = Router();

// ==========================================
// 1. MÓDULO DEL CLIENTE (WEB / APP)
// ==========================================<

// Obtener categorías activas
router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.categorias WHERE activo = true');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Obtener catálogo de platillos disponibles
router.get('/platillos', async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM public.platillos p
      LEFT JOIN public.categorias c ON p.categoria_id = c.id
      ORDER BY p.id ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener platillos' });
  }
});

// Crear un nuevo pedido (Cliente)
router.post('/pedidos', async (req, res) => {
  const { usuario_id, zona_domicilio, numero_comensales, notas_especiales, prioridad, items } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const pedidoQuery = `
      INSERT INTO public.pedidos (usuario_id, zona_domicilio, numero_comensales, notas_especiales, prioridad)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const pedidoResult = await client.query(pedidoQuery, [
      usuario_id,
      zona_domicilio,
      numero_comensales,
      notas_especiales,
      prioridad || 'Normal'
    ]);
    const nuevoPedido = pedidoResult.rows[0];

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          'INSERT INTO public.detalle_pedido (pedido_id, platillo_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
          [nuevoPedido.id, item.platillo_id, item.cantidad, item.precio_unitario]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Pedido programado exitosamente', pedido: nuevoPedido });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  } finally {
    client.release();
  }
});

// ==========================================
// 2. MÓDULO DEL CHEF (SDK / PANTALLA INTELIGENTE KDS)
// ==========================================

// Obtener comandas activas para la pantalla de cocina
router.get('/kds/pedidos', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id as pedido_id,
        p.estado,
        p.prioridad,
        p.zona_domicilio,
        p.numero_comensales,
        p.notas_especiales,
        p.hora_recepcion,
        u.nombre as cliente_nombre,
        json_agg(
          json_build_object(
            'detalle_id', dp.id,
            'platillo_id', pl.id,
            'platillo_nombre', pl.nombre,
            'cantidad', dp.cantidad,
            'precio_unitario', dp.precio_unitario
          )
        ) AS platillos
      FROM public.pedidos p
      JOIN public.usuarios u ON p.usuario_id = u.id
      LEFT JOIN public.detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN public.platillos pl ON dp.platillo_id = pl.id
      WHERE p.estado != 'Completado'
      GROUP BY p.id, u.nombre
      ORDER BY 
        CASE 
          WHEN p.prioridad = 'Urgente' THEN 1
          WHEN p.prioridad = 'Alta' THEN 2
          ELSE 3
        END,
        p.hora_recepcion ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener comandas para KDS' });
  }
});

// Consultar la receta / ficha técnica desde la pantalla del chef
router.get('/kds/receta/:platillo_id', async (req, res) => {
  const { platillo_id } = req.params;
  try {
    const query = `
      SELECT r.*, p.nombre as platillo_nombre, p.imagen_url
      FROM public.recetas r
      JOIN public.platillos p ON r.platillo_id = p.id
      WHERE r.platillo_id = $1;
    `;
    const result = await pool.query(query, [platillo_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada para este platillo' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ficha técnica' });
  }
});

// Cambiar disponibilidad de un platillo desde el panel táctil de la cocina
router.patch('/kds/platillos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;
  try {
    const result = await pool.query(
      'UPDATE public.platillos SET disponible = $1 WHERE id = $2 RETURNING *',
      [disponible, id]
    );
    res.json({ message: 'Estado del platillo actualizado', platillo: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
});

// Cambiar estado del pedido y registrar en historial si se completa
router.patch('/kds/pedidos/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado, chef_id } = req.body; // 'En preparación', 'Listo', 'Completado'
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updateQuery = `
      UPDATE public.pedidos 
      SET estado = $1, hora_finalizacion = CASE WHEN $1 = 'Completado' THEN CURRENT_TIMESTAMP ELSE hora_finalizacion END
      WHERE id = $2 RETURNING *;
    `;
    const result = await client.query(updateQuery, [estado, id]);
    const pedidoActualizado = result.rows[0];

    // Si el estado pasa a 'Completado', guardar registro en el historial de servicios
    if (estado === 'Completado') {
      await client.query(
        'INSERT INTO public.historial_servicios (pedido_id, chef_id, resumen_platillos) VALUES ($1, $2, $3)',
        [id, chef_id || null, `Pedido #${id} completado con éxito`]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Estado del pedido actualizado', pedido: pedidoActualizado });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar estado del pedido' });
  } finally {
    client.release();
  }
});

// Obtener o guardar configuración de la estación de cocina KDS
router.get('/kds/configuracion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.configuracion_estacion LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
});

// Obtener el historial de servicios
router.get('/kds/historial', async (req, res) => {
  try {
    const query = `
      SELECT
        hs.id AS historial_id,
        hs.pedido_id,
        hs.chef_id,
        u_chef.nombre AS chef_nombre,
        u_cliente.nombre AS cliente_nombre,
        p.estado,
        p.prioridad,
        p.zona_domicilio,
        p.numero_comensales,
        p.hora_recepcion,
        p.hora_finalizacion,
        hs.resumen_platillos,
        hs.completado_en
      FROM public.historial_servicios hs
      JOIN public.pedidos p
        ON hs.pedido_id = p.id
      JOIN public.usuarios u_cliente
        ON p.usuario_id = u_cliente.id
      LEFT JOIN public.usuarios u_chef
        ON hs.chef_id = u_chef.id
      ORDER BY hs.completado_en DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al obtener el historial de servicios'
    });
  }
});

// Obtener menú para los clientes, sin mostrar la preparación
router.get('/cliente/menu', async (req, res) => {
  try {
    const query = `
      SELECT
        p.id AS platillo_id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen_url,
        c.nombre AS categoria_nombre,
        r.tiempo_estimado_min
      FROM public.platillos p
      JOIN public.recetas r
        ON r.platillo_id = p.id
      LEFT JOIN public.categorias c
        ON c.id = p.categoria_id
      WHERE p.disponible = true
        AND c.activo = true
      ORDER BY c.nombre, p.nombre;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al obtener el menú'
    });
  }
});


 // Registrar un nuevo pedido del cliente autenticado
router.post('/cliente/pedidos', verificarToken, async (req, res) => {
  const {
    zona_domicilio,
    numero_comensales,
    notas_especiales,
    prioridad,
    items
  } = req.body;

  // Validar los datos del formulario
  if (
    !zona_domicilio?.trim() ||
    !Number.isInteger(Number(numero_comensales)) ||
    Number(numero_comensales) < 1 ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      error: 'Completa los datos del pedido y selecciona al menos un platillo'
    });
  }

  const prioridadPedido = prioridad || 'Normal';

  if (!['Normal', 'Alta', 'Urgente'].includes(prioridadPedido)) {
    return res.status(400).json({
      error: 'La prioridad seleccionada no es válida'
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Obtener el usuario a partir del token de inicio de sesión
    const usuarioResult = await client.query(
      `SELECT id, nombre, deshabilitado_en
       FROM public.usuarios
       WHERE id = $1`,
      [req.usuario.id]
    );

    if (usuarioResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(401).json({
        error: 'El usuario de la sesión no existe'
      });
    }

    const usuario = usuarioResult.rows[0];

    if (usuario.deshabilitado_en !== null) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        error: 'Tu cuenta está suspendida'
      });
    }

    // Registrar el pedido asociado al usuario autenticado
    const pedidoResult = await client.query(
      `INSERT INTO public.pedidos
        (usuario_id, zona_domicilio, numero_comensales,
         notas_especiales, prioridad)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        usuario.id,
        zona_domicilio.trim(),
        Number(numero_comensales),
        notas_especiales?.trim() || null,
        prioridadPedido
      ]
    );

    const nuevoPedido = pedidoResult.rows[0];

    // Guardar los platillos seleccionados y obtener sus precios reales
    for (const item of items) {
      const platilloId = Number(item.platillo_id);
      const cantidad = Number(item.cantidad);

      if (
        !Number.isInteger(platilloId) ||
        !Number.isInteger(cantidad) ||
        cantidad < 1
      ) {
        throw new Error('Uno de los platillos o sus cantidades no es válido');
      }

      const platilloResult = await client.query(
        `SELECT p.id, p.precio
         FROM public.platillos p
         WHERE p.id = $1
           AND p.disponible = true
           AND EXISTS (
             SELECT 1
             FROM public.recetas r
             WHERE r.platillo_id = p.id
           )`,
        [platilloId]
      );

      if (platilloResult.rows.length === 0) {
        throw new Error(
          `El platillo ${platilloId} no existe, no está disponible o no tiene receta`
        );
      }

      const platillo = platilloResult.rows[0];

      await client.query(
        `INSERT INTO public.detalle_pedido
          (pedido_id, platillo_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [
          nuevoPedido.id,
          platillo.id,
          cantidad,
          platillo.precio
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Pedido registrado correctamente',
      cliente: {
        id: usuario.id,
        nombre: usuario.nombre
      },
      pedido: nuevoPedido
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar pedido:', error);

    res.status(400).json({
      error: error.message || 'Error al registrar el pedido'
    });
  } finally {
    client.release();
  }
});


export default router;
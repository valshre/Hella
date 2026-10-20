import { Router } from 'express';
import pool from './config/db.js'; // Conexión a PostgreSQL

const router = Router();

// ==========================================
// 1. MÓDULO DEL CLIENTE (WEB / APP)
// ==========================================

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

export default router;
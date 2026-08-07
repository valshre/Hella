import express from 'express';
import jwt from 'jsonwebtoken';
import pool from './config/db.js'; 

const router = express.Router();
const SECRET_KEY = 'clave_secreta_hella_2026'; // La misma que usas en el login

router.post('/api/contacto', async (req, res) => {
    // 1. Extraemos los datos generales de la solicitud
    const { asunto, fecha, invitados, mensaje } = req.body;
    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let usuario_id = null;

    try {
        // 2. Verificamos si la petición trae un Token de autorización
        const authHeader = req.headers['authorization'];
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            
            try {
                // 3. Desencriptamos el token para obtener el ID real del usuario
                const decoded = jwt.verify(token, SECRET_KEY);
                usuario_id = decoded.id; // Asegúrate de que al hacer login guardas el 'id' en el token
                
                // 4. Consultamos la BD para obtener el nombre y correo VERDADEROS
                const result = await pool.query('SELECT nombre, email FROM usuarios WHERE id = $1', [usuario_id]);
                
                if (result.rows.length > 0) {
                    // Sobrescribimos lo que haya mandado el frontend con la verdad de la BD
                    nombre = result.rows[0].nombre;
                    correo = result.rows[0].email;
                }
            } catch (tokenError) {
                // Si el token es inválido o expiró, rechazamos la petición por seguridad
                return res.status(401).json({ error: "Sesión inválida o expirada. Vuelve a iniciar sesión." });
            }
        }

        // 5. Validamos que tengamos la información mínima necesaria
        if (!nombre || !correo || !asunto || !mensaje) {
            return res.status(400).json({ error: "Faltan datos obligatorios." });
        }

        // 6. Aquí procesas la solicitud (ej. guardarla en la BD o enviar un email real)
        // Opcional: Si quieres guardar la relación en BD, puedes insertar 'usuario_id' si no es null
        
        /* Ejemplo de inserción:
        await pool.query(
            'INSERT INTO contactos (usuario_id, nombre, correo, asunto, fecha, invitados, mensaje) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [usuario_id, nombre, correo, asunto, fecha, invitados, mensaje]
        );
        */

        res.status(200).json({ mensaje: "Solicitud enviada correctamente." });

    } catch (error) {
        console.error("Error en el endpoint de contacto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

export default router;
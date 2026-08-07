import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './config/db.js'; // Conexión a PostgreSQL

const router = express.Router();

// Llave secreta para firmar el token (en producción debe ir en el archivo .env)
const SECRET_KEY = 'clave_secreta_hella_2026';
router.post('/register', async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        // 1. Verificar si el correo ya existe
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({ error: "Este correo ya está registrado." });
        }

        // 2. Encriptar la contraseña (Bcrypt)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insertar el nuevo usuario y obtener su ID generado
        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id',
            [nombre, email, hashedPassword]
        );
        const usuarioId = nuevoUsuario.rows[0].id;

        // 4. Buscar el ID del rol seleccionado
        const rolQuery = await pool.query('SELECT id FROM roles WHERE nombre = $1', [rol]);
        const rolId = rolQuery.rows[0].id;

        // 5. Vincular al usuario con su rol en la tabla intermedia
        await pool.query(
            'INSERT INTO usuario_rol (usuario_id, rol_id) VALUES ($1, $2)',
            [usuarioId, rolId]
        );

        res.status(201).json({ mensaje: "Usuario registrado con éxito." });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error en el servidor al registrar usuario." });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Modificamos la consulta para traer también 'deshabilitado_en'
        const query = `
            SELECT u.id, u.password, u.nombre, u.email, r.nombre AS rol, u.deshabilitado_en 
            FROM usuarios u 
            JOIN usuario_rol ur ON u.id = ur.usuario_id 
            JOIN roles r ON ur.rol_id = r.id 
            WHERE u.email = $1
        `;
        const { rows } = await pool.query(query, [email]);
        const usuario = rows[0];

        // 2. Validar si el correo existe
        if (!usuario) {
            return res.status(401).json({ error: "El correo o la contraseña son incorrectos." });
        }

        // 3. ¡NUEVO! Bloqueo estricto si el usuario está inhabilitado
        if (usuario.deshabilitado_en !== null) {
            return res.status(403).json({ 
                error: "Tu cuenta ha sido suspendida. Contacta a un administrador." 
            });
        }

        // 4. Validar la contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: "El correo o la contraseña son incorrectos." });
        }

        // 5. Generar el Token (Solo llega aquí si está activo y la contraseña es correcta)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        // 6. Enviar respuesta exitosa
        res.status(200).json({ 
            mensaje: "Inicio de sesión exitoso", 
            token: token, 
            rol: usuario.rol,
            nombre: usuario.nombre,
            email: usuario.email
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Hubo un problema en el servidor." });
    }
});

export default router;
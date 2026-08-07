import pg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const { Pool } = pg;

// Configurar el conjunto de conexiones (Pool) a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Comprobar la conexión al iniciar el servidor
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a la base de datos PostgreSQL:', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos PostgreSQL: hella_auth');
    }
    if (client) release(); // Liberar el cliente tras la prueba
});

export default pool;
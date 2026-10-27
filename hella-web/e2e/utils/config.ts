import 'dotenv/config';

export const API_URL = process.env.API_URL ?? 'https://hella-i3o7.onrender.com';

// Las pruebas que escriben en la BD solo corren con ALLOW_WRITES=true
export const ESCRIBE = process.env.ALLOW_WRITES === 'true';

const cuenta = (prefijo: string, rol: string, ruta: string) => ({
  email: process.env[prefijo + '_EMAIL'] ?? '',
  password: process.env[prefijo + '_PASSWORD'] ?? '',
  rol,
  ruta,
});

export const USERS = {
  admin: cuenta('ADMIN', 'Administrador', '/dashboard-admin'),
  chef: cuenta('CHEF', 'Chef', '/gestionar-menu'),
  usuario: cuenta('USER', 'Usuario', '/menu'),
};

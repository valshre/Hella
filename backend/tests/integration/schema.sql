-- Esquema INFERIDO de las consultas de authRoutes.js / server.js.
-- Compáralo con tu BD real y ajusta tipos o restricciones si difieren.
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  deshabilitado_en TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS usuario_rol (
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_id INT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (usuario_id, rol_id)
);

INSERT INTO roles (nombre) VALUES ('Administrador'), ('Chef'), ('Usuario')
ON CONFLICT (nombre) DO NOTHING;
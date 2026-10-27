import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import pg from 'pg';

// ── BD de PRUEBAS real (PostgreSQL). Nunca la de producción. ──
const TEST_DB_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://hella:hella@localhost:5433/hella_test';
if (!/test/i.test(TEST_DB_URL)) {
  throw new Error('TEST_DATABASE_URL debe apuntar a una BD de pruebas (el nombre debe contener "test").');
}
const pool = new pg.Pool({ connectionString: TEST_DB_URL });

// authRoutes.js recibe un pool REAL apuntando a la BD de pruebas (no hay mocks de datos).
jest.unstable_mockModule('../../config/db.js', () => ({ default: pool }));
const { default: authRoutes } = await import('../../authRoutes.js');

const SECRET_KEY = 'clave_secreta_hella_2026';
const PASSWORD = 'Test1234!';

const app = express();
app.use(express.json());
app.use('/api', authRoutes);

const correoUnico = () =>
  'int.' + Date.now() + '.' + Math.floor(Math.random() * 1e4) + '@hella-test.com';
const registrar = (email, rol = 'Usuario') =>
  request(app).post('/api/register').send({ nombre: 'QA Integración', email, password: PASSWORD, rol });
const login = (email, password = PASSWORD) =>
  request(app).post('/api/login').send({ email, password });
const filasDe = async (email) =>
  (await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])).rows;

let errSpy;
beforeAll(async () => { await pool.query('SELECT 1'); });
beforeEach(() => { errSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(async () => {
  errSpy.mockRestore();
  await pool.query("DELETE FROM usuario_rol WHERE usuario_id IN (SELECT id FROM usuarios WHERE email LIKE '%@hella-test.com')");
  await pool.query("DELETE FROM usuarios WHERE email LIKE '%@hella-test.com'");
});
afterAll(async () => { await pool.end(); });

describe('Autenticación: authRoutes + bcrypt + JWT + PostgreSQL reales', () => {
  test('I-01 [flujo correcto] registro persiste hash y rol, y el login devuelve JWT con ese rol', async () => {
    const email = correoUnico();

    const reg = await registrar(email);
    expect(reg.status).toBe(201);

    const [u] = await filasDe(email);
    expect(u.password).not.toBe(PASSWORD);
    expect(u.password).toMatch(/^\$2[aby]\$/);                 // hash bcrypt real
    const vinculo = await pool.query(
      'SELECT r.nombre FROM usuario_rol ur JOIN roles r ON r.id = ur.rol_id WHERE ur.usuario_id = $1',
      [u.id]
    );
    expect(vinculo.rows.map((r) => r.nombre)).toEqual(['Usuario']);

    const ok = await login(email);
    expect(ok.status).toBe(200);
    expect(jwt.verify(ok.body.token, SECRET_KEY)).toMatchObject({ id: u.id, rol: 'Usuario' });
  });

  test('I-02 [error relevante] correo duplicado se rechaza y la BD conserva un solo registro', async () => {
    const email = correoUnico();
    expect((await registrar(email)).status).toBe(201);

    const segundo = await registrar(email);

    expect(segundo.status).toBe(400);
    expect(segundo.body.error).toBe('Este correo ya está registrado.');
    expect(await filasDe(email)).toHaveLength(1);
  });

  test('I-03 [estado en BD] deshabilitar la cuenta bloquea el login y rehabilitarla lo restablece', async () => {
    const email = correoUnico();
    await registrar(email);

    await pool.query('UPDATE usuarios SET deshabilitado_en = CURRENT_TIMESTAMP WHERE email = $1', [email]);
    const bloqueado = await login(email);
    expect(bloqueado.status).toBe(403);

    await pool.query('UPDATE usuarios SET deshabilitado_en = NULL WHERE email = $1', [email]);
    expect((await login(email)).status).toBe(200);
  });

  // ── Las dos pruebas siguientes documentan DEFECTOS del backend actual: se espera que FALLEN ──
  test('I-04 [DEFECTO D-01] un rol inexistente no debe dejar un usuario huérfano en la BD', async () => {
    const email = correoUnico();

    const res = await registrar(email, 'RolQueNoExiste');

    expect(res.status).toBe(400);                 // hoy responde 500
    expect(await filasDe(email)).toHaveLength(0); // hoy queda el usuario sin rol
  });

  test('I-05 [DEFECTO D-02] el registro público no debe permitir crear cuentas Administrador', async () => {
    const email = correoUnico();

    const res = await registrar(email, 'Administrador');

    expect([400, 403]).toContain(res.status);     // hoy responde 201
  });
});
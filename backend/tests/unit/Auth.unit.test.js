import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Doble de prueba: se sustituye la conexión real a PostgreSQL por un mock.
const queryMock = jest.fn();
jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));
const { default: authRoutes } = await import('../../authRoutes.js');

const SECRET_KEY = 'clave_secreta_hella_2026'; // la misma de authRoutes.js
const PASSWORD = 'Test1234!';
const MSG_CREDENCIALES = 'El correo o la contraseña son incorrectos.';

const app = express();
app.use(express.json());
app.use('/api', authRoutes);

let HASH;
let errSpy;
beforeAll(async () => { HASH = await bcrypt.hash(PASSWORD, 4); });
beforeEach(() => {
  queryMock.mockReset();
  errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => errSpy.mockRestore());

const fila = (extra = {}) => ({
  id: 7, password: HASH, nombre: 'QA Unitario', email: 'qa@hella-test.com',
  rol: 'Usuario', deshabilitado_en: null, ...extra,
});
const login = (email, password) => request(app).post('/api/login').send({ email, password });

describe('Login (lógica de negocio con BD simulada)', () => {
  test('U-01 [válido] credenciales correctas devuelven 200 y un JWT con id y rol', async () => {
    queryMock.mockResolvedValueOnce({ rows: [fila()] });

    const res = await login('qa@hella-test.com', PASSWORD);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      mensaje: 'Inicio de sesión exitoso', rol: 'Usuario',
      nombre: 'QA Unitario', email: 'qa@hella-test.com',
    });
    expect(jwt.verify(res.body.token, SECRET_KEY)).toMatchObject({ id: 7, rol: 'Usuario' });
    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(queryMock.mock.calls[0][1]).toEqual(['qa@hella-test.com']);
  });

  test('U-02 [límite] el token vence exactamente a las 2 horas', async () => {
    queryMock.mockResolvedValueOnce({ rows: [fila()] });

    const res = await login('qa@hella-test.com', PASSWORD);
    const { iat, exp } = jwt.verify(res.body.token, SECRET_KEY);

    expect(exp - iat).toBe(2 * 60 * 60);
  });

  test('U-03 [límite] cuenta deshabilitada con contraseña correcta recibe 403 y no token', async () => {
    queryMock.mockResolvedValueOnce({ rows: [fila({ deshabilitado_en: new Date() })] });

    const res = await login('qa@hella-test.com', PASSWORD);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Tu cuenta ha sido suspendida. Contacta a un administrador.');
    expect(res.body.token).toBeUndefined();
  });

  test('U-04 [inválido] contraseña incorrecta devuelve 401 con mensaje genérico', async () => {
    queryMock.mockResolvedValueOnce({ rows: [fila()] });

    const res = await login('qa@hella-test.com', 'OtraClave999!');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe(MSG_CREDENCIALES);
    expect(res.body.token).toBeUndefined();
  });

  test('U-05 [inválido] correo inexistente da el mismo mensaje (no revela cuentas)', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });

    const res = await login('no-existe@hella-test.com', PASSWORD);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe(MSG_CREDENCIALES);
  });

  test('U-06 [error] si la BD falla responde 500 sin filtrar el detalle interno', async () => {
    queryMock.mockRejectedValueOnce(new Error('connection refused 10.0.0.5:5432'));

    const res = await login('qa@hella-test.com', PASSWORD);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Hubo un problema en el servidor.');
    expect(JSON.stringify(res.body)).not.toContain('10.0.0.5');
  });
});

describe('Registro (lógica de negocio con BD simulada)', () => {
  const registrar = (email, rol = 'Usuario') =>
    request(app).post('/api/register').send({ nombre: 'QA', email, password: PASSWORD, rol });

  test('U-07 [inválido] correo ya registrado devuelve 400 y no inserta nada', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const res = await registrar('qa@hella-test.com');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Este correo ya está registrado.');
    expect(queryMock).toHaveBeenCalledTimes(1); // solo el SELECT, ningún INSERT
  });

  test('U-08 [válido] el registro guarda un hash bcrypt, nunca la contraseña en claro', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [] })               // SELECT correo existente
      .mockResolvedValueOnce({ rows: [{ id: 10 }] })     // INSERT usuarios RETURNING id
      .mockResolvedValueOnce({ rows: [{ id: 2 }] })      // SELECT id del rol
      .mockResolvedValueOnce({ rows: [] });              // INSERT usuario_rol

    const res = await registrar('nuevo@hella-test.com');

    expect(res.status).toBe(201);
    const hashGuardado = queryMock.mock.calls[1][1][2];
    expect(hashGuardado).not.toBe(PASSWORD);
    expect(await bcrypt.compare(PASSWORD, hashGuardado)).toBe(true);
    expect(queryMock.mock.calls[3][1]).toEqual([10, 2]); // vínculo usuario-rol
  });
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { USERS, API_URL, ESCRIBE } from '../utils/config';
import { bearer, correoUnico, registrarApi, tokenDe } from '../utils/api';

test('RF-08 La sesión de Administrador persiste tras recargar', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(USERS.admin.email, USERS.admin.password);
  await expect(page).toHaveURL(/dashboard-admin/);

  const tokenAntes = await page.evaluate(() => localStorage.getItem('token'));
  await page.reload();

  await expect(page).toHaveURL(/dashboard-admin/);
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBe(tokenAntes);
  expect(await page.evaluate(() => localStorage.getItem('userRole'))).toBe('Administrador');
});

test('RF-09 Estadísticas reflejan registros y no duplican correos', async ({ request }) => {
  test.skip(!ESCRIBE, 'Escribe en la BD de producción (ALLOW_WRITES=true)');

  const admin = bearer(await tokenDe(request, USERS.admin));
  const contar = async () => {
    const r = await request.get(API_URL + '/api/admin/stats', { headers: admin });
    const { usuarios } = await r.json();
    return usuarios.find((u: any) => u.rol === USERS.usuario.rol).cantidad as number;
  };

  const antes = await contar();
  const email = correoUnico();
  expect((await registrarApi(request, email)).status()).toBe(201);
  expect(await contar()).toBe(antes + 1);

  const duplicado = await registrarApi(request, email);
  expect(duplicado.status()).toBe(400);
  expect((await duplicado.json()).error).toBe('Este correo ya está registrado.');
  expect(await contar()).toBe(antes + 1);
});
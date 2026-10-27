import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { USERS, API_URL } from '../utils/config';
import { bearer } from '../utils/api';

test('P8-E2E-01 Admin inicia sesión, llega al área privada y el backend acepta su sesión', async ({ page, request }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(USERS.admin.email, USERS.admin.password);

  // 1. Resultado en el front
  await expect(page).toHaveURL(/dashboard-admin/);
  const sesion = await page.evaluate(() => ({
    token: localStorage.getItem('token'),
    rol: localStorage.getItem('userRole'),
  }));
  expect(sesion.rol).toBe('Administrador');
  expect(sesion.token).toBeTruthy();
  await page.screenshot({ path: 'e2e/evidencias/p8-e2e-01-dashboard-admin.png', fullPage: true });

  // 2. El token emitido por el backend funciona y devuelve datos reales de la BD
  const stats = await request.get(API_URL + '/api/admin/stats', { headers: bearer(sesion.token!) });
  expect(stats.status()).toBe(200);
  const { usuarios } = await stats.json();
  expect(usuarios.map((u: any) => u.rol)).toEqual(
    expect.arrayContaining(['Administrador', 'Chef', 'Usuario'])
  );

  // 3. Persistencia de la sesión
  await page.reload();
  await expect(page).toHaveURL(/dashboard-admin/);
});

test('P8-E2E-02 Un Usuario estándar no permanece en el área de administración', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(USERS.usuario.email, USERS.usuario.password);
  await expect(page).toHaveURL(/menu/);

  await page.goto('/dashboard-admin');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'e2e/evidencias/p8-e2e-02-acceso-denegado.png', fullPage: true });

  // Si el front no tiene guardia de ruta por rol, esta prueba falla y evidencia el defecto
  await expect(page).not.toHaveURL(/dashboard-admin/);
});
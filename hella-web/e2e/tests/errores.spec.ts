import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { USERS } from '../utils/config';

test('RF-12a Servidor no disponible muestra mensaje de conexión', async ({ page }) => {
  await page.route('**/api/login', (route) => route.abort('connectionrefused'));
  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(USERS.usuario.email, USERS.usuario.password);

  await expect(login.error).toHaveText('No se pudo conectar con el servidor.');
  await expect(page).toHaveURL(/login/);
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
});

test('RF-12b Credenciales incorrectas muestran el error del servidor', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(USERS.usuario.email, 'Incorrecta123!');

  await expect(login.error).toHaveText('El correo o la contraseña son incorrectos.');
  await expect(page).toHaveURL(/login/);
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBeNull();
});
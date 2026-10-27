import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { API_URL } from '../utils/config';

test('RF-05 Login con campos vacíos no envía la petición', async ({ page }) => {
  let llamadas = 0;
  page.on('request', (r) => { if (r.url().includes('/api/login')) llamadas++; });

  const login = new LoginPage(page);
  await login.goto();
  await login.entrar.click();

  const msg = await login.email.evaluate((el: HTMLInputElement) => el.validationMessage);
  expect(msg).not.toBe('');
  expect(llamadas).toBe(0);
  await expect(page).toHaveURL(/login/);
});

test('RF-06 Login con correo de formato inválido es rechazado', async ({ page }) => {
  let llamadas = 0;
  page.on('request', (r) => { if (r.url().includes('/api/login')) llamadas++; });

  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion('correo-sin-arroba', 'Test1234!');

  const tipoInvalido = await login.email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
  expect(tipoInvalido).toBe(true);
  expect(llamadas).toBe(0);
});

test('RF-07 Contacto sin datos obligatorios responde 400', async ({ request }) => {
  const res = await request.post(API_URL + '/api/contacto', {
    data: { nombre: 'QA', asunto: 'Reservacion' },
  });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toBe('Faltan datos obligatorios.');
});
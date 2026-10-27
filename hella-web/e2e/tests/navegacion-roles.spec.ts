import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { USERS, API_URL } from '../utils/config';
import { bearer, tokenDe } from '../utils/api';

for (const [nombre, u] of Object.entries(USERS)) {
  test('RF-10 (' + nombre + ') es redirigido a ' + u.ruta, async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.iniciarSesion(u.email, u.password);

    await expect(page).toHaveURL(new RegExp(u.ruta + '$'));
    expect(await page.evaluate(() => localStorage.getItem('userRole'))).toBe(u.rol);
  });
}

const RUTAS_ADMIN = ['/api/admin/usuarios', '/api/admin/stats'];

test('RF-11a Sin token las rutas admin responden 401', async ({ request }) => {
  for (const ruta of RUTAS_ADMIN) {
    expect((await request.get(API_URL + ruta)).status(), ruta).toBe(401);
  }
});

// Fallará con el backend actual: las rutas solo comprueban que exista el header
test('RF-11b Un Usuario estándar no accede a rutas admin (403)', async ({ request }) => {
  const headers = bearer(await tokenDe(request, USERS.usuario));
  for (const ruta of RUTAS_ADMIN) {
    expect((await request.get(API_URL + ruta, { headers })).status(), ruta).toBe(403);
  }
});
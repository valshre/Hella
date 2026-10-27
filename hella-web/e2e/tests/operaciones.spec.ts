import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { ContactPage } from '../page-objects/ContactPage';
import { USERS, API_URL, ESCRIBE } from '../utils/config';
import { bearer, correoUnico, loginApi, registrarApi, tokenDe } from '../utils/api';

test('RF-01 Login exitoso como Usuario redirige a /menu y guarda la sesión', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(USERS.usuario.email, USERS.usuario.password);

  await expect(page).toHaveURL(/menu/);
  const ls = await page.evaluate(() => ({
    token: localStorage.getItem('token'),
    rol: localStorage.getItem('userRole'),
    email: localStorage.getItem('userEmail'),
  }));
  expect(ls.token).toBeTruthy();
  expect(ls.rol).toBe(USERS.usuario.rol);
  expect(ls.email).toBe(USERS.usuario.email);
});

test('RF-02 Registro de usuario nuevo y login posterior', async ({ page, request }) => {
  test.skip(!ESCRIBE, 'Escribe en la BD de producción (ALLOW_WRITES=true)');

  const email = correoUnico();
  const res = await registrarApi(request, email);
  expect(res.status()).toBe(201);
  expect((await res.json()).mensaje).toBe('Usuario registrado con éxito.');

  const login = new LoginPage(page);
  await login.goto();
  await login.iniciarSesion(email, 'Test1234!');
  await expect(page).toHaveURL(/menu/);
});

test('RF-03 Enviar solicitud de reservación muestra confirmación', async ({ page }) => {
  // Se intercepta la petición: no se envía ningún correo real por Resend
  let payload: any = null;
  await page.route('**/api/contacto', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });

  const contacto = new ContactPage(page);
  await contacto.goto();
  await contacto.llenar({
    nombre: 'Cliente QA',
    telefono: '4421234567',
    correo: 'cliente.qa@correo.com',
    asunto: 'Reservacion',
    fecha: '2026-12-24',
    invitados: '8',
    mensaje: 'Cena de Nochebuena, sin gluten.',
  });
  await contacto.enviar.click();

  await expect(contacto.confirmacion).toBeVisible();
  await expect(contacto.formulario).toBeHidden();
  expect(payload).toMatchObject({
    nombre: 'Cliente QA',
    correo: 'cliente.qa@correo.com',
    asunto: 'Reservacion',
    fecha: '2026-12-24',
    invitados: '8',
    mensaje: 'Cena de Nochebuena, sin gluten.',
  });
});

test('RF-04 Admin inhabilita y rehabilita un usuario', async ({ request }) => {
  test.skip(!ESCRIBE, 'Escribe en la BD de producción (ALLOW_WRITES=true)');

  const admin = bearer(await tokenDe(request, USERS.admin));
  const email = correoUnico();
  expect((await registrarApi(request, email)).status()).toBe(201);

  const buscar = async () => {
    const r = await request.get(API_URL + '/api/admin/usuarios', { headers: admin });
    return (await r.json()).find((u: any) => u.email === email);
  };
  const toggle = (id: number) =>
    request.put(API_URL + '/api/admin/usuarios/' + id + '/toggle', { headers: admin });

  const creado = await buscar();
  expect(creado.deshabilitado_en).toBeNull();

  expect((await toggle(creado.id)).status()).toBe(200);
  expect((await buscar()).deshabilitado_en).not.toBeNull();
  expect((await loginApi(request, email, 'Test1234!')).status()).toBe(403);

  expect((await toggle(creado.id)).status()).toBe(200);
  expect((await buscar()).deshabilitado_en).toBeNull();
  expect((await loginApi(request, email, 'Test1234!')).status()).toBe(200);
});
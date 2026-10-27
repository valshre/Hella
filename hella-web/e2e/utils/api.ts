import { APIRequestContext, expect } from '@playwright/test';
import { API_URL } from './config';

export const correoUnico = () =>
  'qa.' + Date.now() + '.' + Math.floor(Math.random() * 1e4) + '@hella-test.com';

export const loginApi = (request: APIRequestContext, email: string, password: string) =>
  request.post(API_URL + '/api/login', { data: { email, password } });

export async function tokenDe(request: APIRequestContext, u: { email: string; password: string }) {
  const res = await loginApi(request, u.email, u.password);
  expect(res.status(), 'login API de ' + u.email).toBe(200);
  return (await res.json()).token as string;
}

export const registrarApi = (request: APIRequestContext, email: string, rol = 'Usuario') =>
  request.post(API_URL + '/api/register', {
    data: { nombre: 'QA Playwright', email, password: 'Test1234!', rol },
  });

export const bearer = (token: string) => ({ Authorization: 'Bearer ' + token });

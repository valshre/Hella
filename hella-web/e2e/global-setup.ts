import 'dotenv/config';

export default async function globalSetup() {
  const api = process.env.API_URL ?? 'https://hella-i3o7.onrender.com';
  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(api + '/');
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 10_000));
  }
  console.warn('El backend no respondió; las pruebas pueden fallar por timeout.');
}

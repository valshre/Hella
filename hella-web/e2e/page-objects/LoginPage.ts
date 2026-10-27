import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly entrar: Locator;
  readonly error: Locator;

  constructor(private page: Page) {
    this.email = page.getByPlaceholder('tu@correo.com');
    this.password = page.getByPlaceholder('••••••••');
    this.entrar = page.getByRole('button', { name: 'Entrar al portal' });
    this.error = page.locator('div.bg-red-50'); // recomendado: data-testid='login-error'
  }

  goto() { return this.page.goto('/login'); }

  async iniciarSesion(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.entrar.click();
  }
}

import { Page, Locator } from '@playwright/test';

export type DatosContacto = {
  nombre: string;
  telefono?: string;
  correo: string;
  asunto: 'Reservacion' | 'Sugerencias';
  fecha?: string;      // formato YYYY-MM-DD (solo Reservación)
  invitados?: string;  // solo Reservación
  mensaje: string;
};

export class ContactPage {
  readonly formulario: Locator;
  readonly nombre: Locator;
  readonly telefono: Locator;
  readonly correo: Locator;
  readonly asunto: Locator;
  readonly fecha: Locator;
  readonly invitados: Locator;
  readonly mensaje: Locator;
  readonly enviar: Locator;
  readonly confirmacion: Locator;

  constructor(private page: Page) {
    this.formulario = page.locator('form');
    this.nombre = page.locator('#name');
    this.telefono = page.locator('#phone');
    this.correo = page.locator('#email');
    this.asunto = page.locator('#subject');
    this.fecha = page.locator('#date');
    this.invitados = page.locator('#guests');
    this.mensaje = page.locator('#message');
    this.enviar = page.getByRole('button', { name: 'Enviar solicitud' });
    this.confirmacion = page.getByRole('heading', { name: '¡Gracias por escribirnos!' });
  }

  goto() { return this.page.goto('/contacto'); }

  async llenar(d: DatosContacto) {
    await this.nombre.fill(d.nombre);
    if (d.telefono) await this.telefono.fill(d.telefono);
    await this.correo.fill(d.correo);
    await this.asunto.selectOption(d.asunto);
    if (d.asunto === 'Reservacion') {
      await this.fecha.fill(d.fecha ?? '');
      await this.invitados.fill(d.invitados ?? '');
    }
    await this.mensaje.fill(d.mensaje);
  }
}
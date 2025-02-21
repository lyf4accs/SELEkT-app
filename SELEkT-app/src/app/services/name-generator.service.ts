// services/name-generator.service.ts
import { Injectable } from '@angular/core';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

@Injectable({
  providedIn: 'root',
})
export class NameGeneratorService {
  generateName(seed: string): { displayName: string; deviceName: string } {
    // Genera un displayName usando una semilla para obtener siempre el mismo resultado para un mismo usuario.
    const displayName = uniqueNamesGenerator({
      length: 2,
      separator: ' ',
      dictionaries: [colors, animals],
      style: 'capital',
      seed: this.hashCode(seed),
    });
    // Genera un deviceName básico a partir del user agent.
    const deviceName = this.getDeviceName();
    return { displayName, deviceName };
  }

  // Función similar a la extensión hashCode de JS (para generar una semilla numérica)
  private hashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convertir a entero de 32 bits
    }
    return hash;
  }

  private getDeviceName(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1) return 'Android Device';
    if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1)
      return 'iOS Device';
    if (ua.indexOf('Windows') > -1) return 'Windows PC';
    if (ua.indexOf('Mac') > -1) return 'Mac';
    return 'Unknown Device';
  }
}

// Importamos el decorador Injectable de Angular para permitir la inyección de este servicio.
import { Injectable } from '@angular/core';
// Importamos las funciones y datos necesarios para generar nombres únicos.
import { uniqueNamesGenerator } from 'unique-names-generator';

// Diccionario de colores en español.
const colores = [
  'Rojo',
  'Verde',
  'Azul',
  'Amarillo',
  'Naranja',
  'Rosa',
  'Morado',
  'Feliz',
  'Marrón',
  'Gris',
];

// Diccionario de animales en español.
const animales = [
  'Perro',
  'Gato',
  'Pájaro',
  'Elefante',
  'Tigre',
  'León',
  'Zorro',
  'Rana',
  'Serpiente',
  'Caballo',
];

// Usamos el decorador Injectable para hacer que este servicio esté disponible en toda la aplicación.
@Injectable({
  providedIn: 'root', // Esto hace que el servicio se proporcione en el nivel raíz de la aplicación.
})
export class NameGeneratorService {
  // Método para generar un nombre basado en una semilla proporcionada.
  generateName(seed: string): { displayName: string; deviceName: string } {
    if (!seed) {
      seed = 'defaultSeed'; // Si no se pasa una semilla válida, usa un valor predeterminado
    }

    // Generar un displayName consistente basado en el peer.id
    const displayName = uniqueNamesGenerator({
      length: 2,
      separator: ' ',
      dictionaries: [animales, colores],
      style: 'capital',
      seed: this.hashCode(seed), // Usa peer.id o un valor relacionado
    });

    const deviceName = this.getDeviceName(); // Nombre del dispositivo basado en User Agent
    return { displayName, deviceName };
  }

  // Función para generar un hash numérico a partir de una cadena (similar a la función hashCode de JavaScript).
  private hashCode(str: string): number {
    let hash = 0; // Inicializa el hash en 0.
    if (str.length === 0) return hash; // Si la cadena está vacía, retorna 0.
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i); // Obtiene el código de carácter de cada letra de la cadena.
      // Actualiza el hash usando una fórmula para generar un número único.
      hash = (hash << 5) - hash + chr; // Desplaza el hash a la izquierda 5 bits y le suma el código del carácter.
      hash |= 0; // Convierte el hash a un entero de 32 bits.
    }
    return hash; // Retorna el hash generado.
  }

  // Método para obtener el nombre del dispositivo basado en el User Agent.
  private getDeviceName(): string {
    const ua = navigator.userAgent; // Obtiene el User Agent del navegador.
    // Compara el User Agent para determinar el tipo de dispositivo.
    if (ua.indexOf('Android') > -1) return 'Dispositivo Android'; // Dispositivo Android.
    if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1)
      return 'Dispositivo iOS'; // Dispositivos iOS.
    if (ua.indexOf('Windows') > -1) return 'PC con Windows'; // PC con Windows.
    if (ua.indexOf('Mac') > -1) return 'Mac'; // Mac.
    return 'Dispositivo Desconocido'; // Si no se reconoce, retorna "Dispositivo Desconocido".
  }
}

// Importamos el decorador Injectable de Angular, que nos permite definir este servicio como inyectable.
//Este servicio solo se usa si el dispositivo no reconoce bien la aplicación por así decirlo.
import { Injectable } from '@angular/core';

// Usamos el decorador Injectable para hacer que este servicio sea disponible en toda la aplicación.
@Injectable({
  providedIn: 'root', // Esto hace que el servicio se proporcione en el nivel raíz de la aplicación.
})
export class ClipboardService {
  // Método para escribir texto en el portapapeles.
  writeText(text: string): Promise<void> {
    // Verificamos si la API del portapapeles está disponible en el navegador.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Si está disponible, utilizamos la función writeText para copiar el texto.
      return navigator.clipboard.writeText(text);
    } else {
      // Si la API no está disponible, creamos una nueva Promise para manejar la copia manualmente.
      return new Promise<void>((resolve, reject) => {
        // Creamos un elemento <span> para contener el texto que queremos copiar.
        const span = document.createElement('span');
        span.textContent = text; // Establecemos el contenido del span al texto que queremos copiar.
        span.style.whiteSpace = 'pre'; // Aseguramos que los espacios se mantengan.
        span.style.position = 'absolute'; // Posicionamos el span de manera que no sea visible.
        span.style.left = '-9999px'; // Movemos el span fuera de la vista horizontal.
        span.style.top = '-9999px'; // Movemos el span fuera de la vista vertical.

        // Agregamos el span al cuerpo del documento para que pueda ser seleccionado.
        document.body.appendChild(span);

        // Creamos un rango para seleccionar el texto del span.
        const range = document.createRange();
        range.selectNode(span); // Seleccionamos el nodo del span.

        // Obtenemos la selección actual del documento.
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges(); // Limpiamos cualquier selección existente.
          selection.addRange(range); // Añadimos el rango del span a la selección.
        }

        let success = false; // Variable para rastrear si la operación de copia fue exitosa.
        try {
          // Intentamos ejecutar el comando de copia del documento.
          success = document.execCommand('copy');
        } catch (err) {
          // Si ocurre un error, rechazamos la promesa.
          reject(err);
        }

        // Limpiamos la selección actual y removemos el span del DOM.
        selection?.removeAllRanges(); // Limpiamos la selección.
        span.remove(); // Eliminamos el span del documento.

        // Resolvemos o rechazamos la promesa según el éxito de la operación de copia.
        success ? resolve() : reject('Copy command failed');
      });
    }
  }
}

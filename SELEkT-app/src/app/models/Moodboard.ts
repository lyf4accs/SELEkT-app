export interface Moodboard {
  name: string; // Ej: "Moodboard 1"
  colorKey: string; // Ej: "2-3-1" (clave de color agrupado)
  photos: string[]; // Array de URLs de imágenes
  coverPhoto: string; // Imagen principal del álbum (usada como portada)
  dominantColor?: string; // rgb(x, y, z), útil si quieres pintar un fondo o mostrar un color
}

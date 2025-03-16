import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { Card } from '../models/Card';
import { MediatorService } from '../services/mediator.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-swiper-selekt',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './swiper-selekt.component.html',
  styleUrls: ['./swiper-selekt.component.css'],
})
export class SwiperSelektComponent implements OnInit {
  cards: Card[] = [];
  savedCards: Card[] = [];
  favoriteCards: Card[] = [];
  draggingIndex: number | null = null;
  startX = 0;
  startY = 0;
  currentTransform = 'none';
  w: string | undefined = undefined;
  alertShown:boolean=false;

  router = inject(Router);
  mediatorService = inject(MediatorService);
  alertCtrl = inject(AlertController);

  ngOnInit(): void {
    this.w = this.mediatorService.getWhichAlbum()?.toString();
    console.log('swiper: ' + this.w);
    if (this.w==='similar') {
      this.mediatorService.similarPhotos$.subscribe((photos) => {
        if (photos) {
          console.log('Fotos similares recibidas: ', photos);
          this.cards = [];
          // Definir el tipo de 'photo' como string y 'index' como number
          this.cards = photos.map((photo: string, index: number) => ({
            id: index + 1,
            title: `Foto ${index + 1}`,
            description: `Imagen del álbum similar`,
            transform: '',
            opacity: '1',
            zIndex: photos.length - index,
            imageUrl: photo,
          }));
        } else {
          console.log('No se recibieron fotos similares');
        }
      });
    } else if (this.w==='duplicate'){
      this.mediatorService.duplicatePhotos$.subscribe((photos) => {
        if (photos) {
          console.log('Fotos duplicadas recibidas: ', photos);
          this.cards = photos.map((photo: string, index: number) => ({
            id: index + 1,
            title: `Foto ${index + 1}`,
            description: `Imagen del álbum duplicado`,
            transform: '',
            opacity: '1',
            zIndex: photos.length - index,
            imageUrl: photo,
          }));
        } else {
          console.log('No se recibieron fotos duplicadas');
        }
      });
    }
  }
  onDragStart(index: number, event: MouseEvent | TouchEvent) {
    this.draggingIndex = index;
    event.preventDefault();

    if (event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }

    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('touchmove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragEnd);
    window.addEventListener('touchend', this.onDragEnd);
  }

  onDragMove = (event: MouseEvent | TouchEvent) => {
    if (this.draggingIndex === null) return;

    let currentX = 0;
    let currentY = 0;

    if (event instanceof MouseEvent) {
      currentX = event.clientX;
      currentY = event.clientY;
    } else {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    }

    const deltaX = currentX - this.startX;
    const deltaY = currentY - this.startY;

    this.currentTransform = `translate(${deltaX}px, ${deltaY}px) rotate(${
      deltaX / 10
    }deg)`;
    this.cards[this.draggingIndex].transform = this.currentTransform;
  };

  onDragEnd = () => {
    if (this.draggingIndex === null) return;

    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('touchmove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragEnd);
    window.removeEventListener('touchend', this.onDragEnd);

    const deltaX = this.getTransformDistanceX(this.draggingIndex);
    const deltaY = this.getTransformDistanceY(this.draggingIndex);

    if (deltaX < -100) {
      this.removeCard('left');
    } else if (deltaX > 100) {
      this.removeCard('right');
    } else if (deltaY < -100) {
      this.removeCard('top');
    } else if (deltaY > 100) {
      this.moveToEnd();
    } else {
      this.cards[this.draggingIndex].transform = ''; // Resetear posición
    }

    this.draggingIndex = null;
    this.currentTransform = 'none';
  };

  getTransformDistanceX(index: number) {
    const card = this.cards[index];
    const match = card.transform.match(/translate\((.*?)px/);
    return match ? parseFloat(match[1]) : 0;
  }

  getTransformDistanceY(index: number) {
    const card = this.cards[index];
    const match = card.transform.match(/translate\((.*?)px,\s*(.*?)px\)/);
    return match ? parseFloat(match[2]) : 0;
  }

  async removeCard(direction: 'left' | 'right' | 'top') {
    if (this.draggingIndex === null) return;
    const card = this.cards[this.draggingIndex];

    card.transform =
      direction === 'left'
        ? 'translate(-200vw, 0) rotate(-30deg)'
        : direction === 'right'
        ? 'translate(200vw, 0) rotate(30deg)'
        : 'translate(0, -200vh) rotate(0)';

    setTimeout(async () => {
      if (direction === 'top') {
        await this.addToFavorites(card.imageUrl);
      } else if (direction === 'left') {
        await this.confirmDelete(card.imageUrl);
      }

      this.cards.splice(this.draggingIndex!, 1);
      this.draggingIndex = null;
    }, 300);
  }

  async addToFavorites(imageUrl: string) {
    const fileName = imageUrl.split('/').pop(); // Extrae el nombre del archivo

    try {
      // Verificar si el archivo existe antes de leerlo
      await Filesystem.stat({
        path: imageUrl,
        directory: Directory.External,
      });

      // Si el archivo existe, lo leemos
      const fileData = await Filesystem.readFile({
        path: imageUrl,
        directory: Directory.External,
      });

      // Si lo leemos correctamente, lo escribimos en la carpeta de Favoritos
      await Filesystem.writeFile({
        path: `DCIM/Favoritos/${fileName}`,
        data: fileData.data,
        directory: Directory.External,
      });

      console.log('Imagen guardada en favoritos');
    } catch (error) {
      console.error('Error al guardar en favoritos:', error);
    }
  }

  async confirmDelete(imageUrl: string) {
      try {
        console.log('Intentando mostrar la alerta');
        const alert = await this.alertCtrl.create({
          header: 'Eliminar Imagen',
          message: '¿Estás seguro de que quieres eliminar esta imagen?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              handler: () => {
                this.deleteImage(imageUrl);
              },
            },
          ],
        });
        await alert.present();
      } catch (error) {
        console.error('Error al mostrar la alerta: ', error);
      }
  }

  async deleteImage(imageUrl: string) {
    try {
      await Filesystem.deleteFile({
        path: imageUrl,
        directory: Directory.External,
      });
      console.log('Imagen eliminada');
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  }

  moveToEnd() {
    if (this.draggingIndex === null) return; // Si no hay tarjeta seleccionada, salir

    const index = this.draggingIndex;
    const card = this.cards[index];

    // Remover la tarjeta de la posición actual y agregarla al final
    this.cards = [
      ...this.cards.slice(0, index),
      ...this.cards.slice(index + 1),
      card,
    ];

    // Asegurar que todas las tarjetas se rendericen en el nuevo orden
    this.cards.forEach((c, i) => {
      c.transform = ''; // Resetear transformación
      c.opacity = '1'; // Restaurar opacidad
      c.zIndex = this.cards.length - i; // Ajustar zIndex para mantener orden
    });

    this.draggingIndex = null; // Resetear el índice de la tarjeta movida
  }
}

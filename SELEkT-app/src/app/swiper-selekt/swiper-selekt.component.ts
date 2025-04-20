import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../models/Card';
import { PhotoFacadeService } from '../services/photoFacade.service';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-swiper-selekt',
  standalone: true,
  imports: [CommonModule],
  providers: [AlertController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
  alertShown: boolean = false;
  isLoading: boolean = true;

  router = inject(Router);
  photoFacade = inject(PhotoFacadeService);
  alertCtrl = inject(AlertController);

  async ngOnInit(): Promise<void> {
    this.w = this.photoFacade.getWhichAlbum()?.toString();
    console.log('swiper: ' + this.w);

    if (this.w === 'similar') {
      this.photoFacade.similarPhotos$.subscribe(async (photos) => {
        if (photos && photos.length > 0) {
          await this.processPhotos(photos, 'similar');
        }
      });
    } else if (this.w === 'duplicate') {
      this.photoFacade.duplicatePhotos$.subscribe(async (photos) => {
        if (photos && photos.length > 0) {
          await this.processPhotos(photos, 'duplicate');
        }
      });
    }
  }

  async showAlert(header: string, message: string) {
    await Dialog.alert({
      title: header,
      message: message,
    });
  }

  async processPhotos(photos: string[], albumType: 'similar' | 'duplicate') {
    this.isLoading = true;
    const validatedPhotos: string[] = [];

    for (const photo of photos) {
      const imageUrl = photo.startsWith('http')
        ? photo
        : `${environment.apiUrl}${photo}`;
      const isValid = await this.waitForImageToLoad(imageUrl);
      if (isValid) validatedPhotos.push(imageUrl);
      else console.warn('Imagen aún no disponible:', imageUrl);
    }

    this.cards = validatedPhotos.map((url, index) => ({
      id: index + 1,
      title: `Foto ${index + 1}`,
      description: `Imagen del álbum ${albumType}`,
      transform: '',
      opacity: '1',
      zIndex: validatedPhotos.length - index,
      imageUrl: url,
    }));

    this.isLoading = false;
  }

  return() {
    this.router.navigate(['/manage']);
  }

  async waitForImageToLoad(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
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
      this.cards[this.draggingIndex].transform = '';
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
        await this.confirmFavorite();
      } else if (direction === 'left') {
        console.log('esperando confirmación de borrado');
        await this.confirmDelete();
      }

      this.cards.splice(this.draggingIndex!, 1);
      this.draggingIndex = null;

    if (this.cards.length === 0) {
      await this.showAlert('¡Listo!', 'No hay más imágenes que revisar.');

      const index = this.photoFacade.getCurrentAlbumIndex();
      if (index !== null && (this.w === 'similar' || this.w === 'duplicate')) {
        this.photoFacade.removeAlbumByIndex(this.w, index);
      }

      this.return();
    }
    }, 300);
  }

  async confirmDelete() {
    const { value } = await Dialog.confirm({
      title: 'Eliminar Imagen',
      message: 'Esta acción es irreversible. ¿Deseas continuar?',
      okButtonTitle: 'Eliminar',
      cancelButtonTitle: 'Cancelar',
    });

    if (value) {
      await this.showAlert(
        'Eliminada',
        'La imagen fue eliminada correctamente.'
      );
    } else {
      await this.showAlert('Cancelado', 'No se eliminó la imagen.');
    }
  }

  async confirmFavorite() {
    const { value } = await Dialog.confirm({
      title: 'Añadir a Favoritos',
      message: '¿Quieres agregar esta foto a tu álbum destacado?',
      okButtonTitle: 'Aceptar',
      cancelButtonTitle: 'Cancelar',
    });

    if (value) {
      await this.showAlert('¡Guardado!', 'La imagen fue añadida a favoritos.');
    } else {
      await this.showAlert('Cancelado', 'No se añadió la imagen a favoritos.');
    }
  }


  async moveToEnd() {
    if (this.draggingIndex === null) return;
    const index = this.draggingIndex;
    const card = this.cards[index];

    this.cards = [
      ...this.cards.slice(0, index),
      ...this.cards.slice(index + 1),
      card,
    ];
    this.cards.forEach((c, i) => {
      c.transform = '';
      c.opacity = '1';
      c.zIndex = this.cards.length - i;
    });
    this.draggingIndex = null;
  }

  //helper
  getFileNameFromUrl(url: string): string | undefined {
    const match = this.photoFacade.getHashes().find((item) => item.url === url);
    return match?.fileName;
  }


}

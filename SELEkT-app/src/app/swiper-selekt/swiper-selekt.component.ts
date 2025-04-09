import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { Card } from '../models/Card';
import { MediatorService } from '../services/mediator.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-swiper-selekt',
  standalone: true,
  imports: [CommonModule, FooterComponent, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './swiper-selekt.component.html',
  styleUrls: ['./swiper-selekt.component.css'],
})
export class SwiperSelektComponent implements OnInit {
  cards: Card[] = [];
  draggingIndex: number | null = null;
  startX = 0;
  startY = 0;
  currentTransform = 'none';
  w: string | undefined = undefined;
  isLoading: boolean = true;

  router = inject(Router);
  mediatorService = inject(MediatorService);
  alertCtrl = inject(AlertController);

  async ngOnInit(): Promise<void> {
    this.w = this.mediatorService.getWhichAlbum();
    console.log('Swiper album type:', this.w);

    const photos =
      this.w === 'similar'
        ? this.mediatorService.getSimilarPhotos()
        : this.mediatorService.getDuplicatePhotos();

    if (photos.length > 0) {
      await this.processPhotos(photos);
    } else {
      console.warn('No hay fotos cargadas, redirigiendo...');
      this.router.navigate(['/manage']);
    }
  }

  async processPhotos(photos: string[]) {
    this.isLoading = true;
    const validatedPhotos: string[] = [];

    for (const url of photos) {
      const imageUrl = url.startsWith('http')
        ? url
        : `${environment.apiUrl}${url}`;
      const loaded = await this.waitForImageToLoad(imageUrl);
      if (loaded) validatedPhotos.push(imageUrl);
    }

    this.cards = validatedPhotos.map((url, index) => ({
      id: index + 1,
      title: `Foto ${index + 1}`,
      description: `Imagen del álbum ${this.w}`,
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

  waitForImageToLoad(url: string): Promise<boolean> {
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

    const point =
      event instanceof MouseEvent
        ? { x: event.clientX, y: event.clientY }
        : { x: event.touches[0].clientX, y: event.touches[0].clientY };

    this.startX = point.x;
    this.startY = point.y;

    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('touchmove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragEnd);
    window.addEventListener('touchend', this.onDragEnd);
  }

  onDragMove = (event: MouseEvent | TouchEvent) => {
    if (this.draggingIndex === null) return;

    const point =
      event instanceof MouseEvent
        ? { x: event.clientX, y: event.clientY }
        : { x: event.touches[0].clientX, y: event.touches[0].clientY };

    const deltaX = point.x - this.startX;
    const deltaY = point.y - this.startY;

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

    if (deltaX < -100) this.removeCard('left');
    else if (deltaX > 100) this.removeCard('right');
    else if (deltaY < -100) this.removeCard('top');
    else this.cards[this.draggingIndex].transform = '';

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

  removeCard(direction: 'left' | 'right' | 'top') {
    if (this.draggingIndex === null) return;
    const card = this.cards[this.draggingIndex];

    card.transform =
      direction === 'left'
        ? 'translate(-200vw, 0) rotate(-30deg)'
        : direction === 'right'
        ? 'translate(200vw, 0) rotate(30deg)'
        : 'translate(0, -200vh)';

    setTimeout(() => {
      this.cards.splice(this.draggingIndex!, 1);
      this.draggingIndex = null;
    }, 300);
  }

  moveToEnd() {
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
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { Card } from '../models/Card';
import { MediatorService } from '../services/mediator.service';

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

  router = inject(Router);
  mediatorService = inject(MediatorService);
  ngOnInit(): void {
    // Suscríbete a los datos de fotos duplicadas o similares a través del MediatorService
    this.mediatorService.similarPhotos$.subscribe((photos) => {
      if (photos) {
        console.log('Fotos similares recibidas: ', photos);
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

    // Verificar también si las fotos duplicadas llegaron (por si es necesario manejar ambos tipos de álbumes)
    this.mediatorService.duplicatePhotos$.subscribe((photos) => {
      if (photos) {
        console.log('Fotos duplicadas recibidas: ', photos);
        // Puedes usar las fotos duplicadas si es necesario
      }
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

  removeCard(direction: 'left' | 'right' | 'top') {
    if (this.draggingIndex === null) return;
    const card = this.cards[this.draggingIndex];

    card.transform =
      direction === 'left'
        ? 'translate(-200vw, 0) rotate(-30deg)'
        : direction === 'right'
        ? 'translate(200vw, 0) rotate(30deg)'
        : 'translate(0, -200vh) rotate(0)';

    setTimeout(() => {
      if (direction === 'right') this.savedCards.push(card);
      if (direction === 'top') this.favoriteCards.push(card);
      this.cards.splice(this.draggingIndex!, 1);
    }, 300); // Tiempo de animación
  }

  moveToEnd() {
    if (this.draggingIndex === null) return;
    const card = this.cards[this.draggingIndex];

    this.cards.forEach((c, index) => {
      if (index < this.draggingIndex!) {
        c.transform = 'translateY(-30px)';
      }
    });

    card.transform = 'translateY(20px)';
    card.opacity = '0.5';
    card.zIndex = 0;

    setTimeout(() => {
      this.cards.forEach((c) => {
        c.transform = '';
      });

      this.cards.splice(this.draggingIndex!, 1);
      this.cards.push({
        ...card,
        transform: 'translateY(0)',
        opacity: '1',
        zIndex: 1,
      });

      setTimeout(() => {
        card.transform = '';
      }, 150);
    }, 250);
  }
}

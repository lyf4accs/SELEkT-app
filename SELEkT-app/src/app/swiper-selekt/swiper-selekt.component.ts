import { Component, OnInit, signal } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/css';

@Component({
  selector: 'app-swiper-selekt',
  standalone: true,
  templateUrl: './swiper-selekt.component.html',
  styleUrls: ['./swiper-selekt.component.css'],
})
export class SwiperSelektComponent implements OnInit {
  mySwiper = signal<Swiper | null>(null);

  ngOnInit() {
    const swiperInstance = new Swiper('.mySwiper', {
      effect: 'cards', // Aplica el efecto "cards"
      grabCursor: true,
      cardsEffect: {
        slideShadows: false,
      },
    });

    (this.mySwiper as any).value = swiperInstance;
  }
}

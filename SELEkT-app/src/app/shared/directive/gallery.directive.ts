import { Directive, HostListener, inject, Input } from '@angular/core';
import { PhotoFacadeService } from '../../services/photoFacade.service';
@Directive({
  selector: '[appGalleryProtected]',
  standalone: true,
})
export class GalleryProtectedDirective {
  @Input() appGalleryProtected: boolean = true;

  photoFacade= inject(PhotoFacadeService);

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    if (!this.appGalleryProtected) return;

    const granted = this.photoFacade.getGalleryAccess();

    if (!granted) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.photoFacade.checkGalleryAccess(); // Esto lanza el confirm()
    }
  }
}

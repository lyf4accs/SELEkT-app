import { Routes } from '@angular/router';
import { DropsendComponent } from './dropsend/dropsend.component';
import { AlbumComponent } from './album/album.component';

export const routes: Routes = [
  { path: 'dropsend', component: DropsendComponent },
  { path: 'album/:code', component: AlbumComponent }
]

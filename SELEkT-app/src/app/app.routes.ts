import { Routes } from '@angular/router';
import { DropsendComponent } from './dropsend/dropsend.component';
import { AlbumComponent } from './album/album.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { LinksComponent } from './links/links.component';
// import { SwiperSelektComponent } from './swiper-selekt/swiper-selekt.component';

export const routes: Routes = [
  { path: '', redirectTo:'/dropsend', pathMatch:'full'},
  { path: 'dropsend', component: DropsendComponent },
  { path: 'album/:code', component: AlbumComponent },
  { path:'upload', component: UploadFilesComponent },
   { path:'links', component:LinksComponent },
]

import { Routes } from '@angular/router';
//import { DropsendComponent } from './dropsend/dropsend.component';
import { AlbumComponent } from './album/album.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { LinksComponent } from './links/links.component';
import { SwiperSelektComponent } from './swiper-selekt/swiper-selekt.component';
import { ManagePhotoComponent } from './manage-photo/manage-photo.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';
import { DropsendComponent } from './dropsend/dropsend.component';
import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfigComponent } from './config/config.component';
import { MoodboardDisplayComponent } from './moodboard-display/moodboard-display.component';
import { MoodboardsComponent } from './moodboards/moodboards.component';
import { PremiumComponent } from './premium/premium.component';
import { PasarelaComponent } from './pasarela/pasarela.component';

export const routes: Routes = [
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'dropsend', component: DropsendComponent },
  { path: 'album/:code', component: AlbumComponent },
  { path: 'upload', component: UploadFilesComponent },
  { path: 'links', component: LinksComponent },
  { path: 'manage/swiper', component: SwiperSelektComponent },
  { path: 'manage', component: ManagePhotoComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  { path: 'moodboards', component: MoodboardsComponent },
  { path: 'display', component: MoodboardDisplayComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'premium', component: PremiumComponent },
  { path: 'pasarela', component: PasarelaComponent },
  {
    path: 'moodboard/:id',
    loadComponent: () =>
      import('./moodboard-display/moodboard-display.component').then(
        (m) => m.MoodboardDisplayComponent
      ),
  },
];

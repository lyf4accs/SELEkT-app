import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'SELEkT-app';
  public isManageRoute: boolean = false;
  router= inject(Router);

    constructor() {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isManageRoute = event.urlAfterRedirects.includes('/manage');
        }
      });
    }
}

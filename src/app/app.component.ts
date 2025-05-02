import { Component } from '@angular/core';
import { LoaderService } from './providers/services/loader.service';
import { NavigationEnd, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mcqtest';

  constructor(
    public loaderService: LoaderService,
  ) {

    if (event instanceof NavigationStart) {
      //if (this.matchesAnyUrl(this.router.url, this.urlsToCheck)) {
      this.loaderService.showLoader();
      //}
    } else if (event instanceof NavigationEnd) {
      this.loaderService.hideLoader();
    }

  }
}

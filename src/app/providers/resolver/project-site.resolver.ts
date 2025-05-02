import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectSiteService } from '../services/project-site.service';
import { ProjectSiteNewComponent } from 'src/app/pages/masters/project-site/project-site-new/project-site-new.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectSiteResolver implements Resolve<ProjectSiteNewComponent> {
  constructor(private service: ProjectSiteService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.Get({ id: route.params.id });
  }
}

import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GroupNewComponent } from 'src/app/pages/masters/group/group-new/group-new.component';
import { GroupServiceService } from '../services/group-service.service';

@Injectable({
  providedIn: 'root'
})
export class GroupDetailsResolver implements Resolve<GroupNewComponent> {
  
  constructor(private groupServiceService: GroupServiceService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.Get({ id: route.params.id });
  }
}

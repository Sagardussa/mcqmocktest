import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserRoleNewComponent } from 'src/app/pages/masters/user-role/user-role-new/user-role-new.component';
import { UserRoleService } from '../services/user-role.service';

@Injectable({
  providedIn: 'root'
})
export class RoleDetailsResolver implements Resolve<UserRoleNewComponent> {
  
  constructor(private userRoleService: UserRoleService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.userRoleService.Get({ id: route.params.id });
  }
}

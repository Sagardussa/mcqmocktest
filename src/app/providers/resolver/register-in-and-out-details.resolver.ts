import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GroupServiceService } from '../services/group-service.service';
import { RegisterInAndOutCreateComponent } from 'src/app/pages/masters/register-in-and-out/register-in-and-out-create/register-in-and-out-create.component';
import { RegisterInAndOutService } from '../services/register-in-and-out.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterInAndOutDetailsResolver implements Resolve<RegisterInAndOutCreateComponent> {

  constructor(private RegisterInAndOutService: RegisterInAndOutService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.RegisterInAndOutService.Get({ id: parseInt(route.params.id) });
  }
}

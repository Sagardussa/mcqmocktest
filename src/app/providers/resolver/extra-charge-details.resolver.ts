import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ExtrachargeNewComponent } from 'src/app/pages/masters/extracharge/extracharge-new/extracharge-new.component';
import { ExtraChargeService } from '../services/extra-charge.service';
import { GroupServiceService } from '../services/group-service.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraChargeDetailsResolver implements Resolve<ExtrachargeNewComponent> {

  constructor(private extraChargeService: ExtraChargeService,) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.extraChargeService.Get({ id: route.params.id });
  }
}

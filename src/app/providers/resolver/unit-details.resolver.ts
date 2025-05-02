import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { UnitNewComponent } from 'src/app/pages/masters/unit/unit-new/unit-new.component';
import { UnitMasterService } from '../services/unit-master.service';

@Injectable({
  providedIn: 'root'
})
export class UnitDetailsResolver implements Resolve<UnitNewComponent> {

  constructor(private unitMasterService: UnitMasterService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.unitMasterService.Get({ id: route.params.id });
  }
}

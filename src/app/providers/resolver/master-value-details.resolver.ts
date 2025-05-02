import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { MasterValueNewComponent } from 'src/app/pages/masters/master-value/master-value-new/master-value-new.component';
import { MasterValueService } from '../services/master-value.service';

@Injectable({
  providedIn: 'root'
})
export class MasterValueDetailsResolver implements Resolve<MasterValueNewComponent> {
  
  constructor(private service: MasterValueService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.Get({ id: route.params.id });
  }
}

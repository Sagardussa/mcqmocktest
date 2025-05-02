import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SalesPersonNewComponent } from 'src/app/pages/masters/sales-person/sales-person-new/sales-person-new.component';
import { SalesPersonService } from '../services/sales-person.service';

@Injectable({
  providedIn: 'root'
})
export class SalesPersonResolver implements Resolve<SalesPersonNewComponent> {
  constructor(private salesPersonService: SalesPersonService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.salesPersonService.Get({ id: route.params.id });
  }
}

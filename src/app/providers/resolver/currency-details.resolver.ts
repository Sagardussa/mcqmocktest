import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CurrencyNewComponent } from 'src/app/pages/masters/currency/currency-new/currency-new.component';
import { CurrencyService } from '../services/currency.service';
import { GroupServiceService } from '../services/group-service.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyDetailsResolver implements Resolve<CurrencyNewComponent> {

  constructor(private currencyService: CurrencyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.currencyService.Get({ id: route.params.id });
  }
}

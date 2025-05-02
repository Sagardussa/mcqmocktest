import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { StockplaceNewComponent } from 'src/app/pages/masters/stockplace/stockplace-new/stockplace-new.component';
import { GroupServiceService } from '../services/group-service.service';
import { StockPlaceService } from '../services/stock-place.service';

@Injectable({
  providedIn: 'root'
})
export class StockPlaceDetailsResolver implements Resolve<StockplaceNewComponent> {

  constructor(private stockPlaceService: StockPlaceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.stockPlaceService.Get({ id: parseInt(route.params.id) });
  }
}

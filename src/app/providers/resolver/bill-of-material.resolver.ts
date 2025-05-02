import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { BillOfMaterialAddComponent } from 'src/app/pages/masters/bill-of-material/bill-of-material-add/bill-of-material-add.component';
import { ItemServiceService } from '../services/item-service.service';

@Injectable({
  providedIn: 'root'
})
export class BillOfMaterialResolver implements Resolve<BillOfMaterialAddComponent> {

  constructor(private service: ItemServiceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.GetBOM({ bomMasterId: route.params.bomid ? route.params.bomid : null, itemId: route.params.id });
  }
}

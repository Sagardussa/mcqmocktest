import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ItemNewComponent } from 'src/app/pages/masters/item/item-new/item-new.component';
import { ItemServiceService } from '../services/item-service.service';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsResolver implements Resolve<ItemNewComponent> {

  constructor(private itemServiceService: ItemServiceService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.itemServiceService.Get({ id: route.params.id });
  }
}

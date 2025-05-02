import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LedgerCreateComponent } from 'src/app/pages/masters/ledger/ledger-create/ledger-create.component';
import { LedgerServiceService } from '../services/ledger-service.service';

@Injectable({
  providedIn: 'root'
})

export class LedgerDetailsResolver implements Resolve<LedgerCreateComponent> {

  constructor( private ledgerServiceService: LedgerServiceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.ledgerServiceService.Get({ id: route.params.id });
  }
}

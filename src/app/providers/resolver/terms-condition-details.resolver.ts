import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TermsConditionNewComponent } from 'src/app/pages/masters/terms-condition/terms-condition-new/terms-condition-new.component';
import { TermsConditionService } from '../services/terms-condition.service';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionDetailsResolver implements Resolve<TermsConditionNewComponent> {
  constructor(private termsConditionService: TermsConditionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.termsConditionService.Get({ id: route.params.id });
  }
}

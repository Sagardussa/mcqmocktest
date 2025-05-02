import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { CompanySettingComponent } from 'src/app/pages/masters/company-setting/company-setting/company-setting.component';
import { AuthServiceService } from '../services/auth-service.service';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetailsResolver implements Resolve<CompanySettingComponent> {

  company: any = {};

  constructor(private settingsService: SettingsService, private authServiceService: AuthServiceService) {
    var tokenInfo = this.authServiceService.getTokenInfo();
    this.company = tokenInfo.company;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.settingsService.Get({ id: this.company.id });
  }
}

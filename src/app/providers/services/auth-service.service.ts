import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { environment } from 'src/environments/environment';
import { LocalStorageServiceService } from './local-storage-service.service';
import { ToastrMessageService } from './toastr-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageServiceService,
  ) { }

  UserLogin(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Auth/Login', fdata)
  }

  logout() {
    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.TokenInfo);
    this.router.navigate(['account/login']);
    this.toastrMessageService.showSuccess("You have been logout.", "Success");
  }

  public getTokenInfo() {
    return this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo);
  }

  public getCompanyName() {
    return this.localStorageService.getItem(appCommon.LocalStorageKeyType.CompanyData);
  }

  public getPrintSettings() {
    return this.localStorageService.getItem(appCommon.LocalStorageKeyType.PrintSettings);
  }

  checkSession(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Auth/CheckSession', fdata)
  }

  public getCompany() {
    return this.localStorageService.getItem(appCommon.LocalStorageKeyType.Company);
  }
}

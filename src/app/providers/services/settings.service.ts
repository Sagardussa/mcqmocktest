import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient, private authServiceService: AuthServiceService
  ) { }

  CompanySetting(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Company/Update',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Company/GetById',fdata)
  }

  ExtraChargeSetting(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/ECSettings',fdata)
  }

  ListExtraChargeSetting(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/ListECSettings',fdata)
  }

  
}

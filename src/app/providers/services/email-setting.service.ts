import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class EmailSettingService {
  constructor(private http: HttpClient) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/EmailSetting/Search', fdata)
  }

  Delete(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/EmailSetting/Delete', fdata)
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/EmailSetting/Create', fdata)
  }

  Get(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/EmailSetting/GetById', fdata)
  }

  Update(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/EmailSetting/Update', fdata)
  }

  Sync(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/EmailSetting/Sync', fdata)
  }
}

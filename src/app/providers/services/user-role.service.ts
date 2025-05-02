import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(
    private http: HttpClient, private authServiceService: AuthServiceService
  ) { }

  Search(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Role/Search',fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Role/Export', fdata, header);
  }
  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Role/Delete',fdata)
  }

  Create(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Role/Create',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Role/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Role/Update',fdata)
  }

  Sync(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Role/Sync',fdata)
  }
}
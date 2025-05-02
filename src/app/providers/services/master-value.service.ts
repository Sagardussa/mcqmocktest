import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterValueService {

  constructor(
    private http: HttpClient, private authServiceService: AuthServiceService
  ) { }

  Search(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Search',fdata)
  }
  
  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Export', fdata, header);
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Delete',fdata)
  }

  Create(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Create',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Update',fdata)
  }

  Sync(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Sync',fdata)
  }

  RestoreMasterValue(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/MasterValue/Update',fdata)
  } 
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterInAndOutService {
  constructor(private http: HttpClient, private authServiceService: AuthServiceService) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/RegisterInOut/Search', fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/RegisterInOut/Export', fdata, header);
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/RegisterInOut/Create', fdata)
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/RegisterInOut/Delete',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/RegisterInOut/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/RegisterInOut/Update',fdata)
  }
}

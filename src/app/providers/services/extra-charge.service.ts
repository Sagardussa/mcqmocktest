import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExtraChargeService {

  constructor(
    private http: HttpClient) { }

  Search(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ExtraCharge/Search',fdata)
  }

  Export(fdata: any): Observable<any> {    
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/ExtraCharge/Export', fdata, header);
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ExtraCharge/Delete',fdata)
  }

  Create(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ExtraCharge/Create',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ExtraCharge/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ExtraCharge/Update',fdata)
  }
}
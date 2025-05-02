import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Currency/Search', fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Currency/Export', fdata, header);
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Currency/Create', fdata)
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Currency/Delete',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Currency/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Currency/Update',fdata)
  }

  Sync(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Currency/Sync',fdata)
  }
}

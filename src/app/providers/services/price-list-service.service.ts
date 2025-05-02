import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  constructor(
    private http: HttpClient, private authServiceService: AuthServiceService
  ) { }

  Search(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/PriceList/Search',fdata)
  }
  
  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/PriceList/Export', fdata, header);
  }

  Create(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/PriceList/Create',fdata)
  }
}

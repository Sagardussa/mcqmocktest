import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class LedgerServiceService {

  constructor(private http: HttpClient, private authServiceService: AuthServiceService) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Search', fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Export', fdata, header);
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Create', fdata)
  }

  Delete(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Delete', fdata)
  }

  Get(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/GetById', fdata)
  }

  Update(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Update', fdata)
  }

  LedgerLock(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/LockLedger', fdata)
  }

  Sync(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Sync',fdata)
  }

  LedgerBalance(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/LedgerBalance',fdata)
  }
  
  MultiLedgerInfo(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/MultiLedgerInfo',fdata)
  }

  AddressCreate(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Address/Create', fdata)
  }

  Upload(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Upload', fdata)
  }

  UploadSearch(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Ledger/Upload/Search', fdata)
  }
}

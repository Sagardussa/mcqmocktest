import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesTargetLedgerService {

  constructor(private http: HttpClient) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/SalesTargetLedger/Search', fdata)
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/SalesTargetLedger/Create', fdata)
  }

  AssignedLedgerTargets(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/SalesTargetLedger/AssignedLedgerTargets', fdata)
  }
}

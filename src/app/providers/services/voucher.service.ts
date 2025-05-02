import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(
    private http: HttpClient
  ) { }

  Search(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/Search',fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/Export', fdata, header);
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/Delete',fdata)
  }

  Create(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/Create',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/Update',fdata)
  }

  SetupInfo(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/SetupInfo',fdata)
  }

  PendingVoucher(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/PendingVoucher',fdata)
  }

  PrintVoucher(fdata: any) {
    return this.http.post(environment.crUrl + '/api/Print/Voucher', fdata, { responseType: 'blob' });
  }

  UploadDocument(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/UploadDocument', fdata)
  }

  DeleteDocument(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/DeleteDocument', fdata)
  }

  UpdateDocumentStatus(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/UpdateDocumentStatus', fdata)
  }

  DownloadDocument(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Voucher/DownloadDocument', fdata, header);
  }
}

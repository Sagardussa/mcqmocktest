import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceTypeService {

  constructor(private http: HttpClient) { }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/Update',fdata)
  }

  UploadPrintReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/UploadPrintReport', fdata)
  }

  DeletePrintReport(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/DeletePrintReport',fdata)
  }

  UpdatePrintReport(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/InvoiceType/UpdatePrintReport',fdata)
  }
}

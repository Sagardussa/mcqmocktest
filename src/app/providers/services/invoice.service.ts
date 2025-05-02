import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRateDiscountData } from 'src/app/core/interfaces/rate-discount-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private http: HttpClient
  ) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Search', fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Export', fdata, header);
  }

  Delete(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Delete', fdata)
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Create', fdata)
  }

  Get(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetById', fdata)
  }

  Update(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Update', fdata)
  }
  UpdatePrint(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdatePrint', fdata)
  }

  UpdateEwayDetails(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdateEwayDetails', fdata)
  }

  SetupInfo(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/SetupInfo', fdata)
  }

  GetPendInvs(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetPendInvs', fdata)
  }

  GetPendInvDetails(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetPendInvDetails', fdata)
  }

  PrintInvoice(fdata: any) {
    return this.http.post(environment.crUrl + '/api/Print/PrintInvoice', fdata, { responseType: 'blob', observe: 'response' });
  }

  GenerateInvoicePDF(fdata: any) {
    return this.http.post<any>(environment.crUrl + '/api/Print/GenerateInvoicePDF', fdata)
  }

  GetInvoicePDF(fdata: any) {
    return this.http.post(environment.crUrl + '/api/Print/GetInvoicePDF', fdata, { responseType: 'blob', observe: 'response' });
  }

  GenerateIRN(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GenerateIRN', fdata)
  }

  ChooseRateDiscount(fdata: any) {
    return this.http.post<IRateDiscountData>(environment.apiUrl + '/api/Invoice/ChooseRateDiscount', fdata)
  }

  SendEmail(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/SendEmail', fdata)
  }

  UploadDocument(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UploadDocument', fdata)
  }

  DeleteDocument(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/DeleteDocument', fdata)
  }

  UpdateDocumentStatus(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdateDocumentStatus', fdata)
  }

  ExportInvoiceItems(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/ExportInvoiceItems', fdata, header);
  }

  GetPendingItemBatches(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetPendingItemBatches', fdata)
  }

  UpdatePIDWithBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdatePIDWithBOM', fdata)
  }

  // shortenUrlString(longUrl: string): Observable<string> {
  //   const params = { url: longUrl };
  //   return this.http.get('https://tinyurl.com/api-create.php', { params, responseType: 'text' });
  // }

  // shortenUrlString(longUrl: string): Observable<string> {
  //   const payload = { url: longUrl, domain: 'tinyurl.com', alias: '', description: '', team: null, tags: [] };
  //   return this.http.post<any>('http://tinyurl.com/app/api/url/create', payload).pipe(
  //     map(response => response.data[0].aliases[0].tiny_url)
  //   );
  // }  

  PendingReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/PendingReport', fdata)
  }

  GetInvMRS(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetInvMRS', fdata)
  }

  DownloadDocument(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/DownloadDocument', fdata, header);
  }

  Authorize(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Authorize', fdata)
  }

  UpdateInvoiceItemDetailsBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdateInvoiceItemDetailsBOM', fdata)
  }

  UpdateInvoiceItemPIDNoBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdateInvoiceItemPIDNoBOM', fdata)
  }

  ConsumeAgainstMaterialIn(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/ConsumeAgainstMaterialIn', fdata)
  }

  PrintCode(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/PrintCode', fdata)
  }

  LastBillNoCreated(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/LastBillNoCreated', fdata)
  }

  ValidateInvoiceCreate(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/ValidateInvoiceCreate', fdata)
  }

  UpdateInvoiceCompleted(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdateInvoiceCompleted', fdata)
  }

  GetInvDetailsByParam(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetInvDetailsByParam', fdata)
  }

  UpdatePartialInvoice(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdatePartial', fdata)
  }

  GetRefForConsume(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetRefForConsume', fdata)
  }

  SearchItemwise(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Search/Itemwise', fdata)
  }

  GetPidForOverwrite(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetPidForOverwrite', fdata)
  }

  GetPidForTransfer(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetPidForTransfer', fdata)
  }

  ShiftPID(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/ShiftPID', fdata)
  }

  GetPidForPartialTransfer(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GetPidForPartialTransfer', fdata)
  }

  SearchItemList(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/Search/ItemList', fdata)
  }

  UpdateScrap(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/UpdateScrap', fdata)
  }

  GenerateEway(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Invoice/GenerateEway', fdata)
  }
}
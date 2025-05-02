import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  constructor(private http: HttpClient) { }

  LedgerOutstanding(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/LedgerOutstanding', fdata)
  }

  LedgerOutstandingExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/LedgerOutstandingExport', fdata, header);
  }

  LedgerOutstandingPrint(fdata: any) {
    return this.http.post(environment.crUrl + '/api/Print/LedgerOut', fdata, { responseType: 'blob' });
  }

  LedgerOutstandingSummay(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/LedgerOutstandingSummay', fdata)
  }

  LedgerOutstandingSummayExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/LedgerOutstandingSummayExport', fdata, header);
  }

  LedgerRegister(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/LedgerRegister', fdata)
  }

  LedgerRegisterPrint(fdata: any) {
    return this.http.post(environment.crUrl + '/api/Print/LedgerReg', fdata, { responseType: 'blob' });
  }

  LedgerRegisterExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/LedgerRegisterExport', fdata, header);
  }

  CurrentStock(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/CurrentStock', fdata)
  }

  CurrentStockExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/CurrentStockExport', fdata, header);
  }

  CurrentStockPrint(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/CurrentStockPrint', fdata)
  }

  ItemRegister(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/ItemRegister', fdata)
  }

  ItemRegisterExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/ItemRegisterExport', fdata, header);
  }

  ItemRegisterPrint(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/ItemRegisterPrint', fdata)
  }

  InventoryReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/InventoryReport', fdata)
  }

  InventoryReportExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/InventoryReportExport', fdata, header);
  }

  PendingItems(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/PendingItems', fdata)
  }

  PendingItemsExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/PendingItemsExport', fdata, header);
  }

  GstrReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/GstrReport', fdata)
  }

  GstrReportExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/GstrReportExport', fdata, header);
  }

  BankReconcile(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/BankReconcile', fdata)
  }

  BankReconcilePrint(fdata: any) {
    return this.http.post(environment.crUrl + '/api/Print/BankReconcile', fdata, { responseType: 'blob' });
  }

  BankReconcileExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/BankReconcileExport', fdata, header);
  }

  BankReconcileUpdate(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/BankReconcileUpdate', fdata)
  }

  Gstr3BDetailsReportExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/Gstr3BDetailsReportExport', fdata, header);
  }

  Gstr3BDetailsReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/Gstr3BDetailsReport', fdata)
  }

  ReportProcessDiscount(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/ReportProcessDiscount', fdata)
  }

  TrialBalanceReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/TrialBalanceReport', fdata)
  }

  TrialBalanceReportExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/TrialBalanceReportExport', fdata, header);
  }

  BalanceSheetReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/BalanceSheetReport', fdata)
  }

  BalanceSheetReportExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/BalanceSheetReportExport', fdata, header);
  }

  ProfitLossReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/ProfitLossReport', fdata)
  }

  LastRate(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/LastRate', fdata)
  }

  CurrentStockSummary(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/CurrentStockSummary', fdata)
  }

  CurrentStockSummaryExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/CurrentStockSummaryExport', fdata, header);
  }

  CurrentStockSummaryPrint(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/CurrentStockSummaryPrint', fdata)
  }

  StockValue(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/StockValue', fdata)
  }

  StockValueExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/StockValueExport', fdata, header);
  }

  Dashboard(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/Dashboard', fdata)
  }

  GSTReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/GSTReport', fdata)
  }

  SalesPurchaseRegister(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/SalesPurchaseRegister', fdata)
  }

  DocumentsReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/DocumentsReport', fdata)
  }

  LotBatchWiseStockSummary(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/LotBatchWiseStockSummary', fdata)
  }

  ItemRegisterBranchWise(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/ItemRegisterBranchWise', fdata)
  }

  DocumentItemQtySummary(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/DocumentItemQtySummary', fdata)
  }

  DocumentItemQtySummaryPrint(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/DocumentItemQtySummaryPrint', fdata)
  }

  DocumentItemQtySummaryExport(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Report/DocumentItemQtySummaryExport', fdata, header);
  }

  BatchHistory(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/BatchHistory', fdata)
  }

  ReportWIPDetail(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/ReportWIPDetail', fdata)
  }

  EventReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/EventReport', fdata)
  }

  RefHistoryReport(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/RefHistoryReport', fdata)
  }

  InvoiceReceiptDetails(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Report/InvoiceReceiptDetails', fdata)
  }
}

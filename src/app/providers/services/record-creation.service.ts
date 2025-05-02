import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordCreationService {

  // Observable any sources
  private insertSource = new Subject<any>();
  private updateSource = new Subject<any>();
  private invoiceRowSource = new Subject<any>();
  private invoiceStateChangeSource = new Subject<any>();
  private pendingInvoiceDetailsChangeSource = new Subject<any>();
  private salesOrderInvoiceDetailsChangeSource = new Subject<any>();
  private pendingInvoiceBOMDetailsChangeSource = new Subject<any>();
  private ledgerChangeSource = new Subject<any>();
  private itemChangeSource = new Subject<any>();
  private loginSuccessEventChangeSource = new Subject<any>();
  private groupSyncSource = new Subject<any>();
  private currencySyncSource = new Subject<any>();
  private ledgerSyncSource = new Subject<any>();
  private pendingVoucherSelectedSouce = new Subject<any>();
  private itemSyncSource = new Subject<any>();
  private itemOutForProcessSource = new Subject<any>();
  private dismantalItemSource = new Subject<any>();
  private itemOutForProcessDeleteSource = new Subject<any>();
  private invoiceTransactionTypeChangeSource = new Subject<any>();
  private consumeItemSource = new Subject<any>();
  private itemOutForProcessItemSource = new Subject<any>();
  private invoiceStockPlaceSource = new Subject<any>();
  private JobItemClearSource = new Subject<any>();
  // Observable any streams
  recordInserted$ = this.insertSource.asObservable();
  recordUpdated$ = this.updateSource.asObservable();
  recordInvoiceRow$ = this.invoiceRowSource.asObservable();
  invoiceStateChanged$ = this.invoiceStateChangeSource.asObservable();
  pendingInvoiceDetailsChanged$ = this.pendingInvoiceDetailsChangeSource.asObservable();
  salesOrderInvoiceDetailsChanged$ = this.salesOrderInvoiceDetailsChangeSource.asObservable();
  pendingInvoiceBOMDetailsChanged$ = this.pendingInvoiceBOMDetailsChangeSource.asObservable();
  ledgerChanged$ = this.ledgerChangeSource.asObservable();
  itemChanged$ = this.itemChangeSource.asObservable();
  loginSuccessEventChanged$ = this.loginSuccessEventChangeSource.asObservable();
  groupSyncEventCompleted$ = this.groupSyncSource.asObservable();
  currencySyncEventCompleted$ = this.currencySyncSource.asObservable();
  ledgerSyncEventCompleted$ = this.ledgerSyncSource.asObservable();
  pendingVoucherSelected$ = this.pendingVoucherSelectedSouce.asObservable();
  itemSyncEventCompleted$ = this.itemSyncSource.asObservable();
  itemOutForProcess$ = this.itemOutForProcessSource.asObservable();
  dismantalItem$ = this.dismantalItemSource.asObservable();
  itemOutForProcessDelete$ = this.itemOutForProcessDeleteSource.asObservable();
  invoiceTransactionTypeChanged$ = this.invoiceTransactionTypeChangeSource.asObservable();
  consumeItem$ = this.consumeItemSource.asObservable();
  itemOutForProcessItem$ = this.itemOutForProcessItemSource.asObservable();
  invoiceStockPlace$ = this.invoiceStockPlaceSource.asObservable();
  jobItemCleared$ = this.JobItemClearSource.asObservable();
  // Service message commands
  announceInsert(record: any) {
    this.insertSource.next(record);
  }

  announceUpdate(record: any) {
    this.updateSource.next(record);
  }

  announceInvoiceRow(record: any) {
    this.invoiceRowSource.next(record);
  }

  announceInvoiceStateChange(record: any) {
    this.invoiceStateChangeSource.next(record);
  }

  pendingInvoiceDetailsChange(record: any) {
    this.pendingInvoiceDetailsChangeSource.next(record);
  }

  salesOrderInvoiceDetailsChange(record: any) {
    this.salesOrderInvoiceDetailsChangeSource.next(record);
  }

  pendingInvoiceBOMDetailsChange(record: any) {
    this.pendingInvoiceBOMDetailsChangeSource.next(record);
  }

  announceLedgerChange(record: any) {
    this.ledgerChangeSource.next(record);
  }

  announItemChange(record: any) {
    this.itemChangeSource.next(record);
  }

  announceLoginSuccessEventChange(record: any) {
    this.loginSuccessEventChangeSource.next(record);
  }

  announceGroupSyncEventChange(record: any) {
    this.groupSyncSource.next(record);
  }

  announceCurrencySyncEventChange(record: any) {
    this.currencySyncSource.next(record);
  }

  announceLedgerSyncEventChange(record: any) {
    this.ledgerSyncSource.next(record);
  }

  announcePendingVoucherSelected(record: any) {
    this.pendingVoucherSelectedSouce.next(record);
  }

  announceItemSyncEventChange(record: any) {
    this.itemSyncSource.next(record);
  }

  announceItemOutForProcessEventChange(record: any) {
    this.itemOutForProcessSource.next(record);
  }

  announceDismantalItemEventChange(record: any) {
    this.dismantalItemSource.next(record);
  }

  announceItemOutForProcessDeleteEventChange(record: any) {
    this.itemOutForProcessDeleteSource.next(record);
  }

  announceInvoiceTransactionTypeChange(record: any) {
    this.invoiceTransactionTypeChangeSource.next(record);
  }

  announceConsumeItemChange(record: any) {
    this.consumeItemSource.next(record);
  }

  announceItemOutForProcessItemEventChange(record: any) {
    this.itemOutForProcessItemSource.next(record);
  }

  announceInvoiceStockPlaceEventChange(record: any) {
    this.invoiceStockPlaceSource.next(record);
  }

  announJobItemClear(record: any) {
    this.JobItemClearSource.next(record);
  }
}

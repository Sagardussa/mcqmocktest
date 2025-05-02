import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { VoucherService } from 'src/app/providers/services/voucher.service';

@Component({
  selector: 'app-pending-voucher-selection',
  templateUrl: './pending-voucher-selection.component.html',
  styleUrls: ['./pending-voucher-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PendingVoucherSelectionComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() formFieldName: string;
  @Input() label: string;
  @Input() ledgerForm: any;
  @Input() invType: any;

  public appCommon = appCommon;
  fdata: any = {};
  recordList: any = [];
  ledger: any = {};
  invTypeId: number;

  filteredList: Observable<any[]> | undefined;
  constructor(
    private localStorageService: LocalStorageServiceService,
    private recordCreationService: RecordCreationService,
    private authServiceService: AuthServiceService,
    private voucherService: VoucherService) {
  }

  ngOnInit(): void {
    this.invTypeId = this.invType;
    this.ledger = this.ledgerForm.ledger_ID_Object;

    if (this.invTypeId && this.checkPartyGroup(this.ledger)) {
      var fdata = { ledgerId: this.ledger.id, vtType: this.invTypeId };
      this.getPendingDetails(fdata);
    }
    this.onChanges();
  }

  ngOnDestroy(): void {
  }

  displayFn(item: any): string {
    return item && item.bilL_NO ? item.bilL_NO : '';
  }

  private _filter(value: any): any[] {

    if (this.recordList && this.recordList.length > 0) {
      const filterValue = value.toLowerCase();
      return this.recordList.filter((v: any) => v.bilL_NO.toLowerCase().includes(filterValue)).slice(0, 100);
    }
    return [];
  }

  billSelectionFilter: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.recordList
            .filter(
              (v: any) =>
                !v.lock_Freeze &&
                v.bilL_NO.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );

  billSelectionFormatter = (x: { bilL_NO: string }) => x.bilL_NO;

  onChanges() {
    this.filteredList = this.form.get(this.formFieldName)?.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.name || '')),
      map((value) => (value?.length >= 1 ? this._filter(value) : []))
    );
  }

  reset() {
    this.form?.get(this.formFieldName)?.reset();
  }

  onSelected(item: any) {
    this.form.get(this.formFieldName)?.patchValue(item.item);
    this.recordCreationService.announcePendingVoucherSelected({
      data: item.item,
    });
  }

  selectValue(item: any) {
    var id = item.id ? item.id : item;
    var rec = this.recordList.filter((x: any) => x.id == id, true)[0];
    this.form.get(this.formFieldName)?.patchValue(rec);
  }

  panelClosed() {
    if (typeof this.form?.get(this.formFieldName)?.value === 'string') {
      this.form?.get(this.formFieldName)?.patchValue(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChanges();
  }

  getPendingDetails(fdata: any) {
    this.voucherService
      .PendingVoucher(fdata)
      .subscribe(
        data => {
          this.recordList = [];

          if (data.length) {

            data.forEach((v: any) => {

              var crdr = !(v.grandtotal < 0);
              v.grandtotalCrdr = crdr;
              v.grandtotalAbs = appCommon.FormatValueBasedOnPrecision(Math.abs(v.grandtotal), this.authServiceService) + (crdr ? ' Cr' : ' Dr');
              v.invTypeText = appCommon.InvoiceVoucherTypesObjByte[v.inV_TYPE];
            });

            this.recordList = data;
          }
        },
        error => {
        });
  }

  checkPartyGroup(ledger: any) {
    var grpList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.GroupList);
    if (grpList) {

      var childGroups: any = [];
      var groups = [16, 17];

      groups.forEach((v: Number) => {
        childGroups.push(v);
        this.appCommon.GetChildGroupIds(v, grpList, childGroups);
      });

      return childGroups.indexOf(ledger.group_ID) != -1

    }
    return false;
  }
}

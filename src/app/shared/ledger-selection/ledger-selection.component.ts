import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { merge, Observable, OperatorFunction, Subject, Subscription } from 'rxjs';
//import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LedgerServiceService } from 'src/app/providers/services/ledger-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { CounterSalesModalComponent } from 'src/app/pages/invoice/counter-sales-modal/counter-sales-modal.component';
import { MasterSyncService } from 'src/app/providers/services/master-sync.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { appCommon } from 'src/app/common/_appCommon';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ledger-selection',
  templateUrl: './ledger-selection.component.html',
  styleUrls: ['./ledger-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LedgerSelectionComponent implements OnInit {

  ledgerFocus$ = new Subject<string>();
  ledgerClick$ = new Subject<string>();
  @ViewChild('typehead', { static: true }) ledgerInstance: NgbTypeahead;
  @Input() form: FormGroup;
  @Input() isGroupRequired: boolean;
  @Input() isLedgerRequired: boolean;
  @Input() isLedgerDisabled: boolean;
  @Input() isAddressRequired: boolean;
  @Input() isPOSLedgerSelected: boolean;
  @Input() label: string;
  @Input() ledger: string;
  @Input() id: string;
  @Output() tabpressed: EventEmitter<any> = new EventEmitter();
  @Output() ledgerChange: EventEmitter<any> = new EventEmitter();
  @Output() ledgerReset: EventEmitter<any> = new EventEmitter();
  @Input() ledgerlistFilter: any;
  comapnyInfo: any;
  @ViewChild('typehead', { read: ElementRef }) myInput: ElementRef<HTMLInputElement>;
  @Input() setupInfoData: any = {};
  ledgersFiltered: Observable<any[]> | undefined;
  ledgers: any[];
  loginSuccessSubscription: Subscription;
  ledgerSyncEventCompletedSubscription: Subscription;
  isOnItEvent: boolean = false;
  isCounterSaleLegder: boolean = false;
  public appCommon = appCommon;
  @Input() isFocused: boolean;
  constructor(private ledgerServiceService: LedgerServiceService,
    private toastrMessageService: ToastrMessageService,
    private recordCreationService: RecordCreationService,
    private authServiceService: AuthServiceService,
    //private dialog: MatDialog,
    private masterSyncService: MasterSyncService,
    private localStorageService: LocalStorageServiceService,
    private modalService: NgbModal) {



    this.loginSuccessSubscription = recordCreationService.loginSuccessEventChanged$.subscribe(record => {
      if (this.isOnItEvent) {
        this.masterSyncService.SyncLedgers();
      }
    });

    this.ledgerSyncEventCompletedSubscription = recordCreationService.ledgerSyncEventCompleted$.subscribe(record => {
      var ldrList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.LedgerList);
      if (ldrList.length) {

        //filter
        var grpList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.GroupList);
        if (grpList.length) {

          var childGroups: any = [];

          this.ledgerlistFilter.groups.forEach((v: Number) => {
            childGroups.push(v);
            this.appCommon.GetChildGroupIds(v, grpList, childGroups);
          });
        }
        if (this.ledgerlistFilter.groups.length > 0)
          ldrList = ldrList.filter((x: any) => !x.lock_Freeze && childGroups.indexOf(x.group_ID) != -1)

        for (var i = 0; i < ldrList.length; i++) {

          var ele = ldrList[i];
          var particular: any[] = [];
          particular.push(ele.name);

          if (ele.address) {
            particular.push(ele.address);
          }

          if (ele.area) {
            particular.push(ele.area);
          }

          if (ele.city) {
            particular.push(ele.city);
          }

          if (ele.phone_1) {
            particular.push(ele.phone_1);
          }

          if (ele.phone_2) {
            particular.push(ele.phone_2);
          }

          if (ele.mobile) {
            particular.push(ele.mobile);
          }

          ele.particular = particular.join(" ");
          ele.group = grpList.filter((x: any) => x.id == ele.group_ID)[0].name;
        }
      }

      if (ldrList.length) {
        this.ledgers = JSON.parse(JSON.stringify(ldrList.sort((a, b) => a.particular.localeCompare(b.particular))));
      }
      setTimeout(() => {
        if (this.form.get(this.ledger)?.value) {
          this.selectLedger(this.form.get(this.ledger)?.value);
        } else if (this.isPOSLedgerSelected) {
          var records = this.ledgers.filter(x => x.partyType == 32);
          if (records.length) {
            this.selectLedger(records[0]);
            this.ledgerChange?.emit();
            this.recordCreationService.announceLedgerChange({ data: records[0], formField: this.ledger });
          }
        }
      });
      this.isOnItEvent = false;

    });

    this.comapnyInfo = this.authServiceService.getTokenInfo().company;
  }

  ngOnInit(): void {

    this.isOnItEvent = true;
    this.masterSyncService.SyncLedgers();
    this.isLedgerRequired;

    if (this.form.value.ledger_ID && this.form.value.ledger_ID == 691) {
      this.isCounterSaleLegder = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLedgerRequired'] && changes['isLedgerRequired']?.previousValue != changes['isLedgerRequired']?.currentValue) {

      if (this.isLedgerRequired) {
        this.form.controls[this.ledger].setValidators(Validators.required);
        this.form.controls[this.ledger].updateValueAndValidity();
      }

    }
  }


  ngAfterViewInit() {
    // this.autoTrigger.panelClosingActions.subscribe(x => {
    //   if (this.form?.get(this.ledger)?.value) {
    //     if (this.autoTrigger.activeOption) {
    //       if (this.autoTrigger.activeOption.value.id == 691) { this.isCounterSaleLegder = true; }
    //       else { this.isCounterSaleLegder = false; }

    //       this.form.get(this.ledger)?.patchValue(this.autoTrigger.activeOption.value);
    //       this.ledgerChange?.emit();
    //       this.recordCreationService.announceLedgerChange(this.autoTrigger.activeOption.value);
    //     }
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.loginSuccessSubscription.unsubscribe();
    this.ledgerSyncEventCompletedSubscription.unsubscribe();
  }

  panelClosed() {
    if (typeof this.form?.get(this.ledger)?.value === 'string') {
      this.form?.get(this.ledger)?.patchValue(null);
    }
  }

  async selectLedger(item: any) {
    var id = item.id ? item.id : item;
    var ledger = await this.getLedgerData(id);
    //todo ledger
    //var ledger = this.ledgers.filter(x => x.id == id, true)[0];
    this.form.get(this.ledger)?.patchValue(ledger);
  }

  async onLedgerSelected(event) {

    if (event.item.id == 691) { this.isCounterSaleLegder = true; }
    else { this.isCounterSaleLegder = false; }
    this.tabpressed?.emit();
    var ledger = await this.getLedgerData(event.item.id);
    this.form.get(this.ledger)?.patchValue(ledger);
    //this.form.get(this.ledger)?.patchValue(event.item);
    this.form.get(this.id)?.patchValue(event.item.id);
    this.ledgerChange?.emit();
    //this.recordCreationService.announceLedgerChange({ data: event.item, formField: this.ledger });
    this.recordCreationService.announceLedgerChange({ data: ledger, formField: this.ledger });
  }

  resetLedger() {
    setTimeout(() => {
      this.form?.get(this.ledger)?.reset();
      if (this.form.controls["state"]) { this.form.controls["state"].patchValue(parseInt(this.comapnyInfo.state)); }
      if (this.form.controls["salesByUserID"]) { this.form.controls["salesByUserID"].patchValue(null); }
      this.ledgerReset?.emit();
      this.isCounterSaleLegder = false;
    }, 50);
    this.form.controls[this.ledger].setValue(null);
  }

  // ledgerSelectionFilter: OperatorFunction<string, readonly string[]> = (
  //   text$: Observable<string>
  // ) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map((term) =>
  //       term.length < 2
  //         ? []
  //         : this.ledgers
  //           .filter(
  //             (v: any) =>
  //               !v.lock_Freeze &&
  //               v.particular.toLowerCase().indexOf(term.toLowerCase()) > -1
  //           )
  //           .slice(0, 10)
  //     )
  //   );

  ledgerSelectionFilter: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());

    const clicksWithClosedPopup$ = this.ledgerClick$.pipe(
      filter(() => this.ledgerInstance != undefined ? !this.ledgerInstance.isPopupOpen() : null)
    );

    // const inputFocus$ = this.ledgerFocus$;

    const inputFocus$ = this.ledgerFocus$.pipe(filter(() => this.isFocused));

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        term === '' ? this.ledgers :
          this.ledgers
            .filter(
              (v: any) =>
                !v.lock_Freeze &&
                v.particular.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );
  };

  ledgerSelectionFormatter = (x: { name: string }) => x.name;

  //openInvPrintReportPopup(): void {
  // if (this.form.value.ledger_Id_Object.id === 691) {
  //   const dialogRef = this.dialog.open(CounterSalesModalComponent, {
  //     width: "940px",
  //     disableClose: true,
  //     data: this.form,
  //   });

  //   dialogRef.afterClosed().subscribe(res => {
  //     //this.openingDetails = res.data.openings;
  //   })
  // }
  //}
  openInvPrintReportPopup(): void {
    if (this.form.value.ledger_Id_Object?.id === 691) {
      const modalRef = this.modalService.open(CounterSalesModalComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.data = { formData: this.form };

      modalRef.componentInstance.passdata.subscribe((v) => {
      })
    }

  }

  async getLedgerData(ledgerID: string): Promise<any> {
    return await this.ledgerServiceService.Get({ id: ledgerID }).toPromise();
  }
}

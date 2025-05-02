import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, Subscription, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { CommonService } from 'src/app/providers/services/common.service';
import { ItemServiceService } from 'src/app/providers/services/item-service.service';
import { MasterSyncService } from 'src/app/providers/services/master-sync.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-item-add-modal',
  templateUrl: './item-add-modal.component.html',
  styleUrls: ['./item-add-modal.component.scss']
})
export class ItemAddModalComponent implements OnInit {

  @Input() public data;
  @Output() passdata: EventEmitter<any> = new EventEmitter();
  isBtnLoading: boolean = false;
  form: FormGroup;
  submitted: boolean = false;
  public appCommon = appCommon;
  isOnItEvent: boolean = false;
  loginSuccessSubscription: Subscription;

  brandList: any = [];
  categoryList: any = [];
  sizeList: any = [];
  typeList: any = [];
  groupList: any = [];
  unitList: any = [];

  @ViewChild('brandinstance', { static: true }) brandinstance: NgbTypeahead;
  brandfocus$ = new Subject<string>();
  brandclick$ = new Subject<string>();
  @ViewChild('categoryinstance', { static: true }) categoryinstance: NgbTypeahead;
  categoryfocus$ = new Subject<string>();
  categoryclick$ = new Subject<string>();
  @ViewChild('sizeinstance', { static: true }) sizeinstance: NgbTypeahead;
  sizefocus$ = new Subject<string>();
  sizeclick$ = new Subject<string>();
  @ViewChild('typeinstance', { static: true }) typeinstance: NgbTypeahead;
  typefocus$ = new Subject<string>();
  typeclick$ = new Subject<string>();
  @ViewChild('groupinstance', { static: true }) groupinstance: NgbTypeahead;
  groupfocus$ = new Subject<string>();
  groupclick$ = new Subject<string>();

  @ViewChild('itemCode') myinp: ElementRef;
  currentCompany: ICompanyViewModel;

  constructor(
    private fb: FormBuilder,
    recordCreationService: RecordCreationService,
    private toastrMessageService: ToastrMessageService,
    private masterSyncService: MasterSyncService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private itemServiceService: ItemServiceService,
    private commonService: CommonService,
    companyResolver: CompanyResolver,
  ) {
    this.currentCompany = companyResolver.getCurrentCompany();
    this.loginSuccessSubscription = recordCreationService.loginSuccessEventChanged$.subscribe(record => {
      if (this.isOnItEvent)
        this.getDataFromApi();
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.getDataFromApi();
    setTimeout(() => {
      this.myinp.nativeElement.focus();
    }, 100);
  }

  ngOnDestroy(): void {
    this.loginSuccessSubscription.unsubscribe();
  }

  getDataFromApi() {
    this.getUnitList();
    this.itemBrandList();
    this.itemCategoryList();
    this.itemSizeList();
    this.itemTypeList();
    this.itemGroupdList();
  }

  getUnitList(): void {
    var fdata = { table: 16 };
    this.commonService.dropdown(fdata)
      .subscribe(
        data => {
          this.unitList = data;
          this.isOnItEvent = false;
        }
      )
  }

  itemBrandList(): void {
    var fdata = {
      table: 0,
      column: "Brand"
    }
    this.commonService.itemCategoryList(fdata)
      .subscribe(
        data => {
          this.brandList = data;
          this.isOnItEvent = false;
        }
      )
  }

  brandSelectionFormatter = (x: { name: string }) => x.name;

  brandSelectionFilter: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.brandclick$.pipe(filter(() => this.brandinstance != undefined ? !this.brandinstance.isPopupOpen() : null));
    const inputFocus$ = this.brandfocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.brandList : this.brandList.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)),
      ),
    );
  };

  itemCategoryList(): void {
    var fdata = {
      table: 0,
      column: "Category"
    }
    this.commonService.itemCategoryList(fdata)
      .subscribe(
        data => {
          this.categoryList = data;
          this.isOnItEvent = false;
        }
      )
  }

  categorySelectionFormatter = (x: { name: string }) => x.name;

  categorySelectionFilter: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.categoryclick$.pipe(filter(() => this.categoryinstance != undefined ? !this.categoryinstance.isPopupOpen() : null));
    const inputFocus$ = this.categoryfocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.categoryList : this.categoryList.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)),
      ),
    );
  };

  itemSizeList(): void {
    var fdata = {
      table: 0,
      column: "Sizes"
    }
    this.commonService.itemCategoryList(fdata)
      .subscribe(
        data => {
          this.sizeList = data;
          this.isOnItEvent = false;
        }
      )
  }

  sizeSelectionFormatter = (x: { name: string }) => x.name;

  sizeSelectionFilter: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.sizeclick$.pipe(filter(() => this.sizeinstance != undefined ? !this.sizeinstance.isPopupOpen() : null));
    const inputFocus$ = this.sizefocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.sizeList : this.sizeList.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)),
      ),
    );
  };

  itemTypeList(): void {
    var fdata = {
      table: 0,
      column: "Type"
    }
    this.commonService.itemCategoryList(fdata)
      .subscribe(
        data => {
          this.typeList = data;
          this.isOnItEvent = false;
        }
      )
  }

  typeSelectionFormatter = (x: { name: string }) => x.name;

  typeSelectionFilter: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.typeclick$.pipe(filter(() => this.typeinstance != undefined ? !this.typeinstance.isPopupOpen() : null));
    const inputFocus$ = this.typefocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.typeList : this.typeList.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)),
      ),
    );
  };

  itemGroupdList(): void {
    var fdata = {
      table: 0,
      column: "ItemGroup"
    }
    this.commonService.itemCategoryList(fdata)
      .subscribe(
        data => {
          this.groupList = data;
          this.isOnItEvent = false;
        }
      )
  }

  groupSelectionFormatter = (x: { name: string }) => x.name;

  groupSelectionFilter: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.groupclick$.pipe(filter(() => this.groupinstance != undefined ? !this.groupinstance.isPopupOpen() : null));
    const inputFocus$ = this.groupfocus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.groupList : this.groupList.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)),
      ),
    );
  };


  clear(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Confirm Clear';
    modalRef.componentInstance.message = 'Are you sure you want to clear the form?';
    modalRef.result.then(result => {
      if (result === true) {
        this.form.reset();
      }
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [],
      item_ID: [],
      item_CodeTxt: [null],
      name: [null],
      brand: [null],
      category: [null],
      sizes: [null],
      type: [null],
      itemGroup: [null],
      hsnNo: [""],
      mrp: [null],
      vatPer: [0],
      std_Sell_Rate: [0],
      std_Unit: [null],
      costing_On: [1],
      last_Purchaserate: [0],
      productType: [appCommon.EnProductTypeObj.Goods],
      barcode: [null],
      isActive: [true],
      stockMaintain: [true],
      salesAccountLedgerID: [6],
      purchaseAccountLedgerID: [7],
      usedFor:[1],
      mfrCodeReq:[false],
      expDate:[false],
      rateDealer: [0],
      rateRetailer: [0],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    else {
      this.isBtnLoading = true;
      var fdata = this.form.value;

      if (fdata.brand) {
        fdata.brand = fdata.brand.name ? fdata.brand.name : (typeof fdata.brand === 'string' ? fdata.brand : "");
      }
      if (fdata.category) {
        fdata.category = fdata.category.name ? fdata.category.name : (typeof fdata.category === 'string' ? fdata.category : "");
      }
      if (fdata.type) {
        fdata.type = fdata.type.name ? fdata.type.name : (typeof fdata.type === 'string' ? fdata.type : "");
      }
      if (fdata.sizes) {
        fdata.sizes = fdata.sizes.name ? fdata.sizes.name : (typeof fdata.sizes === 'string' ? fdata.sizes : "");
      }
      if (fdata.itemGroup) {
        fdata.itemGroup = fdata.itemGroup.name ? fdata.itemGroup.name : (typeof fdata.itemGroup === 'string' ? fdata.itemGroup : "");
      }

      this.itemServiceService.Create(fdata)
        .subscribe(
          data => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess("Record created successfully.", "Success");
            if (this.currentCompany.businessType != 23)  this.masterSyncService.SyncItems();
            this.closeDialog(data);
          },
          error => {
            this.isBtnLoading = false;
            this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");
          }
        )
    }
  }

  cancelDialog() {
    this.closeDialog(null);
  }

  closeDialog(data: any): void {
    this.passdata.emit({ data: data });
    this.activeModal.close();
  }
}

import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef } from "ag-grid-community";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { appCommon, EnumTaxType } from "src/app/common/_appCommon";
import { xlsxCommon } from "src/app/common/xlsx_common";
import { AuthServiceService } from "src/app/providers/services/auth-service.service";
import { CommonService } from "src/app/providers/services/common.service";
import { InventoryService } from "src/app/providers/services/inventory.service";
import { InvoiceService } from "src/app/providers/services/invoice.service";
import { LocalStorageServiceService } from "src/app/providers/services/local-storage-service.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { UserService } from "src/app/providers/services/user.service";
import { PrintViewModalComponent } from "../print-view-modal/print-view-modal.component";
import { IItem } from "src/app/core/interfaces/item";
import { Router } from "@angular/router";
import { PidListComponent } from "src/app/pages/invoice/pid-list/pid-list.component";
import { BomItemDetailsViewComponent } from "../bom-item-details-view/bom-item-details-view.component";
import { ItemDetailsModalComponent } from "src/app/pages/masters/item/item-details-modal/item-details-modal.component";
import { InvoiceFieldVisibilityService } from "src/app/providers/services/invoice-field-visibility.service";
import { ICompanyViewModel } from "src/app/core/interfaces/company";
import { TermsConditionService } from "src/app/providers/services/terms-condition.service";
import { ItemFetchService } from "src/app/providers/services/item-fetch.service";
import { ItemServiceService } from "src/app/providers/services/item-service.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ItemSubDetailsComponent } from "src/app/pages/invoice/item-sub-details/item-sub-details.component";
import { ItemBatchSelectionComponent } from "src/app/pages/invoice/item-batch-selection/item-batch-selection.component";
import { ItemBatchDetailsComponent } from "src/app/pages/invoice/item-batch-details/item-batch-details.component";
import { AgViewButtonRendererComponent } from "../custom-ag-controls/ag-view-button-renderer/ag-view-button-renderer.component";
import { AgCommonRendererComponent } from "../custom-ag-controls/ag-common-renderer/ag-common-renderer.component";
import { PermissionManagerService } from "../permission/permission-manager.service";

@Component({
  selector: "app-invoice-details-modal",
  templateUrl: "./invoice-details-modal.component.html",
  styleUrls: ["./invoice-details-modal.component.scss"],
})
export class InvoiceDetailsModalComponent implements OnInit {
  recordData: any;
  isOnItEvent: boolean = false;
  loginSuccessSubscription: Subscription;
  invType: any;
  public domLayout: "normal" | "autoHeight" | "print" = "autoHeight";
  public appCommon = appCommon;
  columnDefs: ColDef[];
  columnDefsPayment: ColDef[];
  gridApi: any;
  gridApipayment: any;
  invoiceItemList: any[] = [];
  setupInfoData: any;
  precision: number;
  ledgers: any = [];
  isDataLoading: boolean = false;
  invTypeText: any;
  salesmanList: any = [];
  salesPerson: any;
  generalUserList: any = [];
  departmentList: any = [];
  orderByUserPerson: any;
  quotationByUserPerson: any;
  departmentUserPerson: any;
  departmentPerson: any;
  fromPOS: boolean;
  form: FormGroup;
  isPrintBtnLoading: boolean = false;
  @Input() public data;
  currentStockList: any[] = [];
  isBtnLoading: boolean = false;
  totalRateAmount: number = 0;
  totalQty: number = 0;
  totalGSTAmount: number = 0;
  totalAmount: number = 0;
  totalProfit: number = 0;
  userList: any = [];
  isExportBtnLoading: boolean = false;
  isFromInv: boolean;
  isPendingBtnLoading: boolean = false;
  isPendingDetailsBtnLoading: boolean = false;
  labelBillNo: string;
  spCodeData: any;
  transactionTypedata: any;
  inventoryStockPlacesData: any;
  comapnyInfo: ICompanyViewModel;
  isAuthBtnLoading: boolean = false;
  isUnAuthBtnLoading: boolean = false;
  isAdvanceOptionCollapsed: boolean = false;
  isExtraChargesCollapsed: boolean = false;
  isPaymentCollapsed: boolean = false;
  isPaymentDivVisible: boolean = false;
  isFileUploadCollapsed: boolean = false;
  termsConditionList: any = [];
  isTermContnAllowed: boolean = false;
  paymentmodeTypeobj: any;
  paymentModeList: any[] = [];
  matchingTermContnList: any[] = [];
  selectedItemTab: number = 1;
  selectedTab: number = 1;
  existingItemIds: any = [];
  existingItem: any = [];
  filteredInvoiceItemList: any[] = [];
  gridHeightWidth: any = {};
  tab1: String = "";
  tab2: String = "";
  isDetailsInTab: boolean = false;
  dismantalItemSubscription: Subscription;
  itemOutForProcessItemEventSubscription: Subscription;
  invoiceProcessInItemDetail: any = [];
  invoiceProcessOutItemDetail: any = [];
  previewImage: any;
  fileList: any = [];
  isDownloading: boolean = false;
  selectedFile: File;
  submitted: boolean = false;
  ImageUrl: any
  convertrefDate: any;
  selectedCurrencyData: any = {}
  compCurrencyData: any;
  hasAuthorizeDocumentPermission: boolean = false;

  constructor(
    private permissionManagerService: PermissionManagerService,
    public fieldVisibilityService: InvoiceFieldVisibilityService,
    private invoiceService: InvoiceService,
    private recordCreationService: RecordCreationService,
    private toastrMessageService: ToastrMessageService,
    private authServiceService: AuthServiceService,
    private localStorageService: LocalStorageServiceService,
    private commonService: CommonService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public invoiceFieldVisibilityService: InvoiceFieldVisibilityService,
    private termsConditionService: TermsConditionService,
    private itemFetchService: ItemFetchService,
    private itemServiceService: ItemServiceService,
    private inventoryService: InventoryService,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient
  ) {
    this.comapnyInfo = this.authServiceService.getTokenInfo().company;
    this.getuserList();
    this.listSalesman();
    this.generalUsers();
    this.getDepartmentList();
    this.loginSuccessSubscription =
      recordCreationService.loginSuccessEventChanged$.subscribe((record) => {
        if (this.isOnItEvent) {
          this.getInvoiceData(this.recordData.invCode);
        }
      });

    this.dismantalItemSubscription =
      recordCreationService.dismantalItem$.subscribe((record) => {
        setTimeout(() => {
          if (record) this.setDismantalItems(record);
        });
      });

    this.itemOutForProcessItemEventSubscription =
      recordCreationService.itemOutForProcessItem$.subscribe((record) => {
        if (this.invType == 45) {
          if (record.isDismantle) {
            var index = this.invoiceProcessOutItemDetail.findIndex(
              (x) => x.item_ID == record.item_ID
            );
            this.invoiceProcessOutItemDetail[index] = record;
          } else {
            var index = this.invoiceProcessInItemDetail.findIndex(
              (x) => x.item_ID == record.item_ID
            );
            this.invoiceProcessInItemDetail[index] = record;
          }
        }
      });
    this.createForm();
    // this.form = this.fb.group({
    //   files: ['', Validators.required]
    // });
  }

  ngOnInit(): void {
    this.hasAuthorizeDocumentPermission = this.permissionManagerService.isGranted(441);
    this.loadLedgers();

    this.setupInfoData = this.data.setupInfoData;
    //todo
    this.invType = this.data.invType;
    this.checkForJobWork();
    this.invTypeText = appCommon.InvoiceVoucherTypesObjByte[this.invType];
    this.recordData = this.data.recordData;
    this.precision = this.data.precision;
    this.labelBillNo = this.data.labelBillNo;
    this.isFromInv = this.data.isFromInv;
    this.fromPOS = this.data.fromPOS;
    this.getInvoiceData(this.recordData.invCode);
    this.spCodeData = this.setupInfoData.billingPlaces.find(
      (x) => x.spId == this.recordData.spCode
    );
    this.transactionTypedata = appCommon.InvoiceTransactionType?.find(
      (x) => x.id === this.recordData?.transactionType
    );
    this.inventoryStockPlacesData = this.setupInfoData.stockPlaces.find(
      (x) => x.spId == this.recordData.inventorySPCode
    );
    if (
      this.recordData.invoiceTncMap &&
      this.recordData.invoiceTncMap.length &&
      this.termsConditionList.length
    )
      this.setTermsConditon();
    this.setPaymenyAndTermAndConditionVisibilty();
    if (this.checkForItemExctraChargeDiv()) this.searchItems();

    if (this.recordData.refDate) {
      this.convertrefDate = this.convertToISO(this.recordData?.refDate);
    }
    this.onTabClick(1);
  }

  setDismantalItems(rec) {
    if (!rec.isDismantle) {
      var item = this.invoiceProcessInItemDetail.find(
        (x) => x.item_ID == rec.item_ID
      );
      if (item) {
        if (rec.invoiceItemBatchNo?.length) {
          item.invoiceItemSubDetail[0].qty =
            item.invoiceItemSubDetail[0].qty + 1;
          item.std_Qty = item.std_Qty + 1;
          item.invoiceItemBatchNo.push(rec.invoiceItemBatchNo[0]);
        }
        this.setTotalInEdit();
        this.onTabClick(1);
      } else {
        this.invoiceProcessInItemDetail.push(rec);
        this.setTotalInEdit();
        this.onTabClick(1);
      }
    } else {
      var item = this.invoiceProcessOutItemDetail.find(
        (x) => x.item_ID == rec.item_ID
      );
      if (item) {
        if (rec.invoiceItemBatchNo?.length) {
          item.invoiceItemSubDetail[0].qty =
            item.invoiceItemSubDetail[0].qty + 1;
          item.std_Qty = item.std_Qty + 1;
          item.invoiceItemBatchNo.push(rec.invoiceItemBatchNo[0]);
        }
      } else {
        this.invoiceProcessOutItemDetail.push(rec);
      }
    }
  }

  searchItems() {
    var fdata = { usedFor: 25 };
    this.isDataLoading = true;
    this.itemServiceService.Search(fdata).subscribe(
      async (data) => {
        this.isDataLoading = false;
        if (data.list.length) {
          this.existingItem = data.list;
          await this.setExtraChargeItem();
        }
      },
      (error) => {
        this.isDataLoading = false;
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.loginSuccessSubscription.unsubscribe();
    this.dismantalItemSubscription.unsubscribe();
    this.itemOutForProcessItemEventSubscription.unsubscribe();
    this.gridApi = null;
    this.columnDefs = null;
  }

  toggleFileUploadCollapse() {
    this.isFileUploadCollapsed = !this.isFileUploadCollapsed;
  }

  setTermsConditon() {
    this.recordData.invoiceTncMap.forEach((v) => {
      const tempMatchList = this.termsConditionList.filter(
        (item) => item.id === v.tncID
      );
      this.matchingTermContnList.push(...tempMatchList);
    });
  }

  checkForBarcodeGenerate() {
    return this.invType === 32;
  }

  checkForJobWork() {
    if (this.invType === 40) {
      this.tab1 = "Material Outward";
      this.tab2 = "Material Inward/Operation";
      this.isDetailsInTab = true;
    } else if (this.invType === 37) {
      this.tab1 = "Material Inward";
      this.tab2 = "Material Outward/Operation";
      this.isDetailsInTab = true;
    } else if (this.invType === 38) {
      this.tab1 = "Material Out";
      this.tab2 = "Service Items";
      this.isDetailsInTab = true;
    } else if (this.invType === 39) {
      this.tab1 = "Material In";
      this.tab2 = "Service Items";
      this.isDetailsInTab = true;
    } else if (this.invType === 45) {
      this.tab1 = "Product Details";
      this.tab2 = "Product  Item Details";
      this.isDetailsInTab = true;
    } else if (this.checkForExtraChargeDiv()) {
      this.tab1 = "Item Details";
      this.tab2 = "Item Extra Charges";
      this.isDetailsInTab = true;
    } else {
      this.tab1 = "";
      this.tab2 = "";
      this.isDetailsInTab = false;
    }
  }

  checkForItemExctraChargeDiv() {
    return (
      this.invType == 1 ||
      this.invType == 8 ||
      this.invType == 9 ||
      this.invType == 16 ||
      this.invType == 10 ||
      this.invType == 5 ||
      this.invType == 4 ||
      this.invType == 6 ||
      this.invType == 3
    );
  }

  checkForExtraChargeDiv() {
    return (
      this.invType === 4 ||
      this.invType === 5 ||
      this.invType === 6 ||
      this.invType === 1 ||
      this.invType === 3 ||
      this.invType === 8 ||
      this.invType === 9 ||
      this.invType === 10 ||
      this.invType === 16
    );
  }

  onTabClick(tabNumber: number) {
    setTimeout(() => {
      this.selectedItemTab = tabNumber;

      if (
        this.invType == 40 ||
        this.invType == 39 ||
        this.invType == 38 ||
        this.invType == 37
      ) {
        if (tabNumber == 1) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(
            (item) => !item.outForProcessing
          );
        } else if (tabNumber == 2) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(
            (item) => item.outForProcessing
          );
        }
      }

      if (this.invType == 45) {
        if (tabNumber == 1) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(
            (item) => !item.isDismantle
          );
        } else if (tabNumber == 2) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(
            (item) => item.isDismantle
          );
          this.filteredInvoiceItemList.sort((a, b) => a.item_ID - b.item_ID);
        }
      }
      else {
        if (tabNumber == 1) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(x => !x.outForProcessing);
        } else if (tabNumber == 2) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(x => x.outForProcessing);
        }
      }

      if (this.checkForExtraChargeDiv()) {
        if (tabNumber === 1) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(
            (item) => !item.isExtraChargeItem
          );
        } else if (tabNumber === 2) {
          this.filteredInvoiceItemList = this.invoiceItemList.filter(
            (item) => item.isExtraChargeItem
          );
          this.filteredInvoiceItemList.sort((a, b) => a.item_ID - b.item_ID);
        }
      }
      this.updateGridColumns();
    }, 500);
  }

  updateGridColumns() {
    if (this.gridApi) {
      const allColumns = this.gridApi?.getColumnDefs();
      let colDefs: any[] = [];
      if (this.selectedItemTab === 2) {
        colDefs = [
          {
            headerName: "#",
            width: 35,
            sortable: true,
            filter: true,
            resizable: true,
            valueGetter: "node.rowIndex + 1",
            pinned: true,
          },
          {
            field: "itemRow.item_CodeTxt",
            headerName: "Item Code",
            tooltipField: "particular",
            width: 200,
            sortable: true,
            filter: true,
            resizable: true,
            pinned: true,
            cellStyle: () => ({
              "font-weight": "600",
              color: "#4aa3ff",
              cursor: "pointer",
              "text-decoration": "underline",
            }),
            onCellClicked: this.openPopup.bind(this),
          },
          {
            field: "itemRow.name",
            headerName: "Name And Description",
            tooltipField: "particular",
            width: 200,
            sortable: true,
            filter: true,
            resizable: true,
            pinned: true,
          },
          { field: "hsn", headerName: "HSN", width: 80, pinned: true, sortable: true, filter: true, resizable: true, },
          {
            field: "std_Qty",
            headerName: "Qty",
            width: 80, sortable: true,
            filter: true,
            resizable: true,
            cellEditor: "customNumberComponent",
            cellStyle: function (params) {
              if (params.data.availableQty != undefined) {
                if (
                  params.data.availableQty < Number(params.value) &&
                  params.data.availableQty < 1
                ) {
                  return { color: "red" };
                } else if (
                  params.data.availableQty < Number(params.value) &&
                  params.data.availableQty > 0
                ) {
                  return { color: "#ffbf00" };
                } else if (params.data.availableQty < 1) {
                  return { color: "red" };
                } else {
                  return { color: "green" };
                }
              } else {
                return { color: "#181d1f" };
              }
            },
          },
          {
            field: "std_Rate",
            headerName: "Rate",
            width: 100, sortable: true, filter: true, resizable: true,
            headerClass: "ag-right-aligned-header",
            cellEditor: "customNumberComponent",
            cellStyle: () => ({
              display: "flex",
              justifyContent: "right",
            }),
            valueFormatter: this.FormatNumberVal.bind(this),
          },
          {
            field: "vatPer",
            headerName: "Tax %",
            width: 60, sortable: true, filter: true, resizable: true,
            headerClass: "ag-right-aligned-header",
            cellEditor: "customNumberComponent",
            cellStyle: () => ({
              display: "flex",
              justifyContent: "right",
            }),
            valueFormatter: this.FormatPerVal.bind(this),
          },
        ];
        if (
          this.invoiceFieldVisibilityService.isColumnVisible(
            this.invType,
            "GST"
          ) &&
          this.comapnyInfo.taxType == EnumTaxType.GST
        ) {
          colDefs.push({
            field: "sgstAmt&cgstAmt&igstAmt",
            headerName: "GST",
            width: 75, sortable: true, filter: true, resizable: true,
            headerClass: "ag-right-aligned-header",
            cellEditor: "customNumberComponent",
            valueGetter: (params) => {
              return (
                params.data.sgstAmt + params.data.cgstAmt + params.data.igstAmt
              );
            },
            cellStyle: () => ({
              display: "flex",
              justifyContent: "right",
            }),
            valueFormatter: this.FormatNumberVal.bind(this),
          });
        } else if (
          this.invoiceFieldVisibilityService.isColumnVisible(
            this.invType,
            "VAT"
          ) &&
          this.comapnyInfo.taxType == EnumTaxType.VAT
        ) {
          colDefs.push({
            field: "rateAfterVat",
            headerName: "VAT",
            width: 75, sortable: true, filter: true, resizable: true,
            headerClass: "ag-right-aligned-header",
            cellEditor: "customNumberComponent",
            cellStyle: () => ({
              display: "flex",
              justifyContent: "right",
            }),
            valueFormatter: this.FormatNumberVal.bind(this),
          });
        }
        colDefs.push({
          field: "amount",
          headerName: "Amount",
          width: 100, sortable: true, filter: true, resizable: true,
          cellEditor: "customNumberComponent",
          headerClass: "ag-right-aligned-header",
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right",
          }),
          valueFormatter: this.FormatNumberVal.bind(this),
        });
      } else {
        // If selectedItem is not 2, use the original columns
        colDefs = this.columnDefs;
      }
      if (this.gridApi && this.gridApi.getDisplayedRowCount() !== null) { // Check if grid is not destroyed
        setTimeout(() => {
          this.gridApi.setColumnDefs(colDefs);
        });
      }
    }
  }

  FormatPerVal(params: any) {
    return appCommon.FormatValueBasedOnPrecision(
      Number(params.value),
      this.authServiceService,
      false
    );
  }

  setGridHeight() {
    this.gridHeightWidth = {
      width: "100%",
      height:
        (window.innerHeight * (appCommon.GridHeightPer - 0.14)).toString() +
        "px",
    };
  }

  async getManyItem(itemId: any) {
    try {
      this.form.patchValue({ isUploadBtnLoading: true });
      this.isDataLoading = true;
      var itemData = await this.itemFetchService.GetMany({ items: itemId });
      this.isDataLoading = false;
      this.form.patchValue({ isUploadBtnLoading: false });
      return itemData;
    } catch (error) {
      this.toastrMessageService.showError("", error);
      // this.isUploadBtnLoading = false;
      this.isDataLoading = false;
      this.form.patchValue({ isUploadBtnLoading: false });
      throw error;
    }
  }

  setExtraChargeItem() {
    setTimeout(async () => {
      // Create a set of existing item_IDs in invoiceItemList
      this.existingItemIds = new Set(this.invoiceItemList.map((item) => item.item_ID));

      // Filter out items that already exist in invoiceItemList
      var itemIds = this.existingItem.map((x) => x.item_ID).filter((item_ID) => !this.existingItemIds.has(item_ID));

      const itemsData = itemIds.length ? await this.getManyItem(itemIds) : [];

      if (itemsData.length) {
        this.onTabClick(1);
      }

      this.setTotalInEdit();
    }, 500);
  }

  setTotalInEdit() {
    setTimeout(() => {
      this.onTabClick(1);
      if (this.gridApi && this.gridApi.getDisplayedRowCount() !== null) { // Ensure the grid is not destroyed
        this.gridApi.setRowData(this.filteredInvoiceItemList);
      }
      this.getTotals();
    }, 100);
  }

  toggleCollapseAdvanceOption(): void {
    this.isAdvanceOptionCollapsed = !this.isAdvanceOptionCollapsed;
  }

  setPaymenyAndTermAndConditionVisibilty() {
    if (
      (this.invType == 8 ||
        this.invType == 4 ||
        this.invType == 6 ||
        this.invType == 1) &&
      !this.checkForBarcodeGenerate()
    ) {
      this.isTermContnAllowed = true;
      this.getTermsList();
    } else if (this.invType == 5 && this.comapnyInfo.businessType != 23) {
      this.isTermContnAllowed = true;
      this.getTermsList();
    } else if (this.invType == 11 && this.comapnyInfo.businessType != 23) {
      this.isTermContnAllowed = true;
      this.getTermsList();
    } else {
      this.isTermContnAllowed = false;
    }

    if (
      (this.invType == 1 ||
        this.invType == 5 ||
        this.invType == 3 ||
        this.invType == 8 ||
        this.invType == 9 ||
        this.invType == 10) &&
      this.comapnyInfo.businessType != 23
    ) {
      this.isPaymentDivVisible = true;
    } else {
      this.isPaymentDivVisible = false;
    }
  }

  toggleCollapseExtraCharges() {
    this.isExtraChargesCollapsed = !this.isExtraChargesCollapsed;
  }

  getTermsList() {
    var fdata = {};
    this.termsConditionService.Search(fdata).subscribe(
      (data) => {
        this.isBtnLoading = false;
        this.termsConditionList = data.list;
        if (
          this.termsConditionList.length &&
          this.recordData &&
          this.recordData.invoiceTncMap &&
          this.recordData.invoiceTncMap.length
        )
          this.setTermsConditon();
      },
      (error) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showInfo(error.error.message, "Info");
      }
    );
  }

  getInvoiceData(id: number): void {
    this.isDataLoading = true;

    var fdata = { id: id, invType: this.invType };

    this.invoiceService.Get(fdata).subscribe(
      (data) => {
        this.recordData = data;

        this.setGridValue();

        if (this.recordData.ledger_ID && this.ledgers.length > 0) {
          this.recordData.ledgerData = this.ledgers.filter(
            (x: any) => x.id == this.recordData.ledger_ID,
            true
          )[0];
        }
        if (this.recordData.salesByUserID && this.salesmanList.length > 0) {
          this.recordData.salesByUserID = this.salesmanList.filter(
            (x: any) => x.id == this.recordData.salesByUserID,
            true
          )[0];
          if (this.recordData.salesByUserID)
            this.salesPerson = this.recordData.salesByUserID.name;
        }

        if (this.recordData.orderByUserID && this.generalUserList.length > 0) {
          this.recordData.orderByUserID = this.generalUserList.filter(
            (x: any) => x.id == this.recordData.orderByUserID,
            true
          )[0];
          if (this.recordData.orderByUserID)
            this.orderByUserPerson = this.recordData.orderByUserID.name;
        }

        if (
          this.recordData.quotationByUserID &&
          this.generalUserList.length > 0
        ) {
          this.recordData.quotationByUserID = this.generalUserList.filter(
            (x: any) => x.id == this.recordData.quotationByUserID,
            true
          )[0];
          if (this.recordData.quotationByUserID)
            this.quotationByUserPerson = this.recordData.quotationByUserID.name;
        }

        if (
          this.recordData.departmentUserId &&
          this.generalUserList.length > 0
        ) {
          this.recordData.departmentUserId = this.generalUserList.filter(
            (x: any) => x.id == this.recordData.departmentUserId,
            true
          )[0];
          if (this.recordData.departmentUserId)
            this.departmentUserPerson = this.recordData.departmentUserId.name;
        }

        if (this.recordData?.departmentId && this.departmentList.length > 0) {
          this.recordData.departmentId = this.departmentList?.filter(
            (x: any) => x.id == this.recordData?.departmentId,
            true
          )[0];
          if (this.recordData.departmentId)
            this.departmentPerson = this.recordData?.departmentId.name;
        }

        if (this.recordData.footerXML && this.recordData.footerXML.length > 0) {
          this.recordData.footerXML.forEach((v: any) => {
            this.addNotesForm(v);
          });
        }

        if (this.recordData.loginByUserID && this.userList.length) {
          this.setPrepareBy();
        }

        if (
          this.recordData?.paymentInfo &&
          this.recordData?.paymentInfo.length
        ) {
          this.paymentModeList = this.recordData?.paymentInfo;
          this.paymentmodeTypeobj = appCommon.EnPaymentMode?.find(
            (x) => x.id === this.recordData?.paymentInfo[0].paymentMode
          );
        }

        if (
          this.recordData.invoiceTncMap &&
          this.recordData.invoiceTncMap.length &&
          this.termsConditionList.length
        ) {
          this.setTermsConditon();
        }

        if (this.isDetailsInTab) {
          this.onTabClick(1);
          if (this.invType == 45) {
            this.invoiceProcessInItemDetail =
              this.recordData.invoiceItemDetail.filter((x) => !x.isDismantle);
            this.invoiceProcessOutItemDetail =
              this.recordData.invoiceItemDetail.filter((x) => x.isDismantle);
          } else {
            this.invoiceProcessInItemDetail =
              this.recordData.invoiceItemDetail.filter(
                (x) => !x.outForProcessing
              );
            this.invoiceProcessOutItemDetail =
              this.recordData.invoiceItemDetail.filter(
                (x) => x.outForProcessing
              );
          }
        }

        if (
          this.recordData?.documents &&
          this.recordData?.documents.length > 0
        ) {
          this.fileList = this.recordData?.documents;
        }

        this.isOnItEvent = false;
        this.isDataLoading = false;

        this.onTabClick(1);
      },
      (error) => {
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );

    if (this.recordData.invoiceBaseCurr) {
      this.getCurrecyData(this.recordData.invoiceBaseCurr);
    }
    if (this.recordData.compBaseCurr) {
      this.getCompBaseCurr(this.recordData.compBaseCurr);
    }
  }

  // onGridReady(params: any) {
  //   this.gridApi = params.api;

  //   var colDefs: any = [
  //     {
  //       field: "sno",
  //       headerName: "#",
  //       width: 25,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //     },
  //     {
  //       field: "itemRow.item_CodeTxt",
  //       headerName: "Item Code",
  //       tooltipField: "particular",
  //       width: 150,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //       cellStyle: () => ({
  //         "font-weight": "600",
  //         color: "#4aa3ff",
  //         cursor: "pointer",
  //         "text-decoration": "underline",
  //       }),
  //       onCellClicked: this.openPopup.bind(this),
  //     },
  //     {
  //       field: "itemRow.name",
  //       headerName: "Name And Description",
  //       tooltipField: "particular",
  //       width: 200,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //     },
  //     {
  //       field: "hsn",
  //       headerName: "HSN",
  //       width: 85,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //     },
  //     // {
  //     //   field: 'sp_text', headerName: 'SP', width: 100, wrapText: true,
  //     //   cellEditor: 'agSelectCellEditor',
  //     //   cellEditorParams: function (params: any) {
  //     //     return {
  //     //       values: params.data.stockplaces
  //     //     };
  //     //   }
  //     // },
  //     {
  //       field: "std_Qty",
  //       headerName: "Qty",
  //       width: 55,
  //       cellStyle: function (params) {
  //         if (params.data.availableQty != undefined) {
  //           if (
  //             params.data.availableQty < Number(params.value) &&
  //             params.data.availableQty < 1
  //           ) {
  //             return { color: "red" };
  //           } else if (
  //             params.data.availableQty < Number(params.value) &&
  //             params.data.availableQty > 0
  //           ) {
  //             return { color: "#ffbf00" };
  //           } else if (params.data.availableQty < 1) {
  //             return { color: "red" };
  //           } else {
  //             return { color: "green" };
  //           }
  //         } else {
  //           return { color: "#181d1f" };
  //         }
  //       },
  //     },

  //       // if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Item Sub Details Icon')) colDefs.push(
  //       // {
  //       //   field: 'item_ID', headerName: '', width: 25, cellRenderer: "viewButtonRendererComponent",
  //       //   cellRendererParams: {
  //       //     onClick: this.openItemSubDetails.bind(this)
  //       //   }
  //       // }),



  //     // if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Batch Icon')) colDefs.push({
  //     //   field: 'item_ID', headerName: '', width: 25, cellRenderer: "commonRendererComponent",
  //     //   cellRendererParams: {
  //     //     onClick: this.openBatchPopup.bind(this)
  //     //   },
  //     //   cellStyle: (params) => {
  //     //     var rec = typeof params.data.itemRow === 'string' ? JSON.parse(params.data.itemRow)[0] : params.data.itemRow;
  //     //     return (rec
  //     //       && rec.mfrCodeReq
  //     //       //&& !(this.invType == 9 && this.form.value.refInv_Type && this.form.value.refInv_Type == 35)
  //     //       && ((this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. Selection') || (this.invType == 40 && this.selectedTab == 1)) //|| (this.form.value.refInv_Type == 40 && this.invType == 39 && this.form.value.workType == 1))
  //     //         || (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. List') || this.makeFormHiddenInAgst() || (this.invType == 37 && this.selectedTab == 1) || (this.form.value.refInv_Type && (this.invType == 43 || this.invType == 44 || this.invType == 10 || this.invType == 53 || this.invType == 35 || this.invType == 36 || this.invType == 45)) || (this.form.value.refInv_Type == 40 && this.invType == 39 && (this.form.value.workType == 0 || this.form.value.workType == 1)))//|| (this.invType == 39)
  //     //       )) ? null : { display: 'none' };
  //     //   }
  //     // })

  //     {
  //       field: "unittext",
  //       headerName: "Unit",
  //       width: 75,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //       cellEditor: "agSelectCellEditor",
  //       cellEditorParams: function (params: any) {
  //         return {
  //           values: params.data.units,
  //         };
  //       },
  //     },
  //     {
  //       field: "std_Rate",
  //       headerName: "Rate",
  //       width: 110,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //       headerClass: "ag-right-aligned-header",
  //       cellStyle: () => ({
  //         display: "flex",
  //         justifyContent: "right",
  //       }),
  //       valueFormatter: this.FormatNumberVal.bind(this),
  //     },
  //     {
  //       field: "discount1",
  //       headerName: "Disc",
  //       width: 70,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //     },
  //     {
  //       field: "vatPer",
  //       headerName: "GST %",
  //       width: 65,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //       headerClass: "ag-right-aligned-header",
  //       cellStyle: () => ({
  //         display: "flex",
  //         justifyContent: "right",
  //       }),
  //       valueFormatter: this.FormatNumberVal.bind(this),
  //     },
  //     {
  //       field: "sgstAmt&cgstAmt&igstAmt",
  //       headerName: "GST",
  //       width: 80,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //       headerClass: "ag-right-aligned-header",
  //       valueGetter: (params) => {
  //         return (
  //           params.data.sgstAmt + params.data.cgstAmt + params.data.igstAmt
  //         );
  //       },
  //       cellStyle: () => ({
  //         display: "flex",
  //         justifyContent: "right",
  //       }),
  //       valueFormatter: this.FormatNumberVal.bind(this),
  //     },
  //     {
  //       field: "amount",
  //       headerName: "Amount",
  //       width: 90,
  //       resizable: true,
  //       sortable: true,
  //       filter: true,
  //       headerClass: "ag-right-aligned-header",
  //       cellStyle: () => ({
  //         display: "flex",
  //         justifyContent: "right",
  //       }),
  //       valueFormatter: this.FormatNumberVal.bind(this),
  //     },
  //   ];

  //   if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Item Sub Details Icon')) colDefs.push(
  //     {
  //       field: 'item_ID', headerName: '', width: 25, cellRenderer: "viewButtonRendererComponent",
  //       cellRendererParams: {
  //         onClick: this.openItemSubDetails.bind(this)
  //       }
  //     },)
  //   if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Batch Icon')) colDefs.push({
  //     field: 'item_ID', headerName: '', width: 25, cellRenderer: "commonRendererComponent",
  //     cellRendererParams: {
  //       onClick: this.openBatchPopup.bind(this)
  //     },
  //     cellStyle: (params) => {
  //       var rec = typeof params.data.itemRow === 'string' ? JSON.parse(params.data.itemRow)[0] : params.data.itemRow;
  //       return (rec
  //         && rec.mfrCodeReq
  //         //&& !(this.invType == 9 && this.form.value.refInv_Type && this.form.value.refInv_Type == 35)
  //         && ((this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. Selection') || (this.invType == 40 && this.selectedTab == 1)) //|| (this.form.value.refInv_Type == 40 && this.invType == 39 && this.form.value.workType == 1))
  //           || (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. List') || this.makeFormHiddenInAgst() || (this.invType == 37 && this.selectedTab == 1) || (this.form.value.refInv_Type && (this.invType == 43 || this.invType == 44 || this.invType == 10 || this.invType == 53 || this.invType == 35 || this.invType == 36 || this.invType == 45)) || (this.form.value.refInv_Type == 40 && this.invType == 39 && (this.form.value.workType == 0 || this.form.value.workType == 1)))//|| (this.invType == 39)
  //         )) ? null : { display: 'none' };
  //     }
  //   })

  //   if (this.setupInfoData.invTypeId == 5) {
  //     colDefs.push(
  //       {
  //         field: "scheduleDate",
  //         headerName: "Schedule",
  //         width: 100,
  //         resizable: true,
  //         sortable: true,
  //         filter: true,
  //         valueFormatter: function (params) {
  //           return moment(params.value).format("DD/MM/YYYY");
  //         },
  //       },
  //       {
  //         field: "deliveryDate",
  //         headerName: "Delivery",
  //         width: 100,
  //         resizable: true,
  //         sortable: true,
  //         filter: true,
  //         valueFormatter: function (params) {
  //           return moment(params.value).format("DD/MM/YYYY");
  //         },
  //       }
  //     );
  //   }

  //   colDefs.push({
  //     field: "itemDescription",
  //     headerName: "Descrption",
  //     width: 80,
  //     resizable: true,
  //     sortable: true,
  //     filter: true,
  //   });

  //   this.columnDefs = colDefs;
  // }

  onGridReady(params: any) {
    this.gridApi = params.api;
    var colDefs: any = []

    if (this.invType == 45 && this.selectedTab == 2) {
      colDefs.push(
        { headerName: '#', width: 35, sortable: true, filter: true, resizable: true, valueGetter: "node.rowIndex + 1", pinned: true, },
        {
          field: 'itemRow.item_CodeTxt', headerName: 'Item Code', tooltipField: 'particular', width: 200, sortable: true, filter: true, resizable: true, pinned: true,
          cellStyle: () => ({
            'font-weight': '600',
            'color': '#4aa3ff',
            cursor: 'pointer',
            'text-decoration': 'underline'
          }),
          onCellClicked: this.openPopup.bind(this)
        },
        { field: 'itemRow.name', headerName: 'Name And Description', tooltipField: 'particular', width: 200, sortable: true, filter: true, resizable: true, pinned: true, },
        {
          field: 'std_Qty', headerName: 'Qty', width: 80, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          cellStyle: function (params) {

            if (params.data.availableQty != undefined) {

              if ((params.data.availableQty < Number(params.value)) && (params.data.availableQty < 1)) {
                return { color: 'red' };
              } else if ((params.data.availableQty < Number(params.value)) && (params.data.availableQty > 0)) {
                return { color: '#ffbf00' };
              } else if (params.data.availableQty < 1) {
                return { color: 'red' };
              }
              else {
                return { color: 'green' };
              }
            } else {
              return { color: '#181d1f' };
            }
          }
        },
        {
          field: 'item_ID', headerName: '', width: 25, sortable: true, filter: true, resizable: true, cellRenderer: "viewButtonRendererComponent",
          cellRendererParams: {
            onClick: this.openItemSubDetails.bind(this)
          }
        },
        {
          field: 'item_ID', headerName: '', width: 25, sortable: true, filter: true, resizable: true, cellRenderer: "commonRendererComponent",
          cellRendererParams: {
            onClick: this.openBatchPopup.bind(this)
          },
          cellStyle: (params) => {
            var rec = typeof params.data.itemRow === 'string' ? JSON.parse(params.data.itemRow)[0] : params.data.itemRow;
            return (rec
              && rec?.mfrCodeReq
              //&& !(this.invType == 9 && this.form.value.refInv_Type && this.form.value.refInv_Type == 35)
              && ((this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. Selection') || (this.invType == 40 && this.selectedTab == 1)) //|| (this.form.value.refInv_Type == 40 && this.invType == 39 && this.form.value.workType == 1))
                || (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. List') || this.makeFormHiddenInAgst() || (this.invType == 37 && this.selectedTab == 1) || (this.form.value.refInv_Type && (this.invType == 43 || this.invType == 44 || this.invType == 10 || this.invType == 53 || this.invType == 35 || this.invType == 36 || this.invType == 45)) || (this.form.value.refInv_Type == 40 && this.invType == 39 && (this.form.value.workType == 0 || this.form.value.workType == 1)))//|| (this.invType == 39)
              )) ? null : { display: 'none' };
          }
        },
        { field: 'qty_DM', headerName: 'DM Qty', width: 70, sortable: true, filter: true, resizable: true, cellEditor: 'customNumberComponent', },
        { field: 'qty_DM_Scrape', headerName: 'DM Scrape Qty', width: 90, sortable: true, filter: true, resizable: true, cellEditor: 'customNumberComponent', },
        {
          field: 'unittext', headerName: 'Unit', width: 70, sortable: true, filter: true, resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: function (params: any) {
            return {
              values: params.data.units.map(x => x.name)
            };
          }
        },
        {
          field: 'std_Rate', headerName: 'Rate', width: 100, sortable: true, filter: true, resizable: true,
          headerClass: "ag-right-aligned-header",
          cellEditor: 'customNumberComponent',
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatNumberVal.bind(this)
        },
        { field: 'itemDescription', headerName: 'Description', width: 120, sortable: true, filter: true, resizable: true, cellEditor: 'textAreaEditorComponent' },
        { field: 'remarks', headerName: 'Remark', width: 120, sortable: true, filter: true, resizable: true, cellEditor: 'textAreaEditorComponent' },
        // { field: 'delete', headerName: '', width: 25, cellRenderer: "deleteButtonRendererComponent", pinned: 'right', cellRendererParams: { onClick: this.onDelete.bind(this) } },
        // { field: 'item_ID', headerName: '', width: 25, pinned: 'right', cellRenderer: "contextMenuButtonRendererComponent", onCellClicked: this.onCellContextMenu.bind(this) }
      )
    } else if (this.comapnyInfo.businessType == 28) {
      colDefs.push(
        { headerName: '#', width: 35, sortable: true, filter: true, resizable: true, valueGetter: "node.rowIndex + 1", pinned: true, },
        {
          field: 'itemRow.item_CodeTxt', headerName: 'Item Code', tooltipField: 'particular', width: 200, sortable: true, filter: true, resizable: true, pinned: true,
          cellStyle: () => ({
            'font-weight': '600',
            'color': '#4aa3ff',
            cursor: 'pointer',
            'text-decoration': 'underline'
          }),
          onCellClicked: this.openPopup.bind(this)
        },
        { field: 'itemRow.name', headerName: 'Name And Description', tooltipField: 'particular', width: 200, sortable: true, filter: true, resizable: true, pinned: true, },
        {
          field: 'std_Qty', headerName: 'Qty', width: 80, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          cellStyle: function (params) {

            if (params.data.availableQty != undefined) {

              if ((params.data.availableQty < Number(params.value)) && (params.data.availableQty < 1)) {
                return { color: 'red' };
              } else if ((params.data.availableQty < Number(params.value)) && (params.data.availableQty > 0)) {
                return { color: '#ffbf00' };
              } else if (params.data.availableQty < 1) {
                return { color: 'red' };
              }
              else {
                return { color: 'green' };
              }
            } else {
              return { color: '#181d1f' };
            }
          }
        },
        { field: 'estWeight', headerName: 'Cal. Wt.', width: 70, sortable: true, filter: true, resizable: true, cellEditor: 'customNumberComponent', },
        { field: 'wastageweight', headerName: 'Wst. Wt.', width: 70, sortable: true, filter: true, resizable: true, cellEditor: 'customNumberComponent', },
        { field: 'weight', headerName: 'Final Wt.', width: 70, sortable: true, filter: true, resizable: true, cellEditor: 'customNumberComponent', },
        {
          field: 'std_Rate', headerName: 'Rate', width: 100, sortable: true, filter: true, resizable: true,
          headerClass: "ag-right-aligned-header",
          cellEditor: 'customNumberComponent',
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatNumberVal.bind(this)
        },
        {
          field: 'discount1', headerName: 'Disc %', width: 60, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          headerClass: "ag-right-aligned-header",
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatPerVal.bind(this)
        },
        {
          field: 'amount', headerName: 'Amount', width: 100, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          headerClass: "ag-right-aligned-header",
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatNumberVal.bind(this)
        },
        { field: 'itemDescription', headerName: 'Description', width: 50, sortable: true, filter: true, resizable: true, cellEditor: 'textAreaEditorComponent' },
        // { field: 'delete', headerName: '', width: 25, cellRenderer: "deleteButtonRendererComponent", pinned: 'right', cellRendererParams: { onClick: this.onDelete.bind(this) } },
        // { field: 'item_ID', headerName: '', width: 25, pinned: 'right', cellRenderer: "contextMenuButtonRendererComponent", onCellClicked: this.onCellContextMenu.bind(this) }
      )
    } else {

      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, '#')) colDefs.push({ headerName: '#', width: 35, sortable: true, filter: true, resizable: true, valueGetter: "node.rowIndex + 1", pinned: true, })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Item Code')) colDefs.push({
        field: 'itemRow.item_CodeTxt', headerName: 'Item Code', sortable: true, filter: true, resizable: true, tooltipField: 'particular', width: 200, pinned: true,
        cellStyle: () => ({
          'font-weight': '600',
          'color': '#4aa3ff',
          cursor: 'pointer',
          'text-decoration': 'underline'
        }),
        onCellClicked: this.openPopup.bind(this)
      })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Name And Description')) colDefs.push({ field: 'itemRow.name', headerName: 'Name And Description', tooltipField: 'particular', width: 200, sortable: true, filter: true, resizable: true, pinned: true, })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Brand') &&
        (this.comapnyInfo.businessType == 23 && this.invType == 34)) colDefs.push(
          { field: 'itemRow.brand', headerName: this.invoiceFieldVisibilityService.getFieldLabel(this.invType, 'Brand'), Width: 150, sortable: true, filter: true, resizable: true, cellEditor: 'textAreaEditorComponent', pinned: true, })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'HSN')) colDefs.push({ field: 'hsn', headerName: 'HSN', sortable: true, filter: true, resizable: true, width: 80, pinned: true },)
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Qty')) colDefs.push(
        {
          field: 'std_Qty', headerName: 'Qty', width: 80, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          cellStyle: function (params) {

            if (params.data.availableQty != undefined) {

              if ((params.data.availableQty < Number(params.value)) && (params.data.availableQty < 1)) {
                return { color: 'red' };
              } else if ((params.data.availableQty < Number(params.value)) && (params.data.availableQty > 0)) {
                return { color: '#ffbf00' };
              } else if (params.data.availableQty < 1) {
                return { color: 'red' };
              }
              else {
                return { color: 'green' };
              }
            } else {
              return { color: '#181d1f' };
            }
          }
        })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Rjct Qty')) colDefs.push({ field: 'rejectQty', headerName: 'Rjct Qty', width: 70, cellEditor: 'customNumberComponent', },)
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Item Sub Details Icon')) colDefs.push(
        {
          field: 'item_ID', headerName: '', width: 25, sortable: true, filter: true, resizable: true, cellRenderer: "viewButtonRendererComponent",
          cellRendererParams: {
            onClick: this.openItemSubDetails.bind(this)
          }
        },)
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Batch Icon')) colDefs.push({
        field: 'item_ID', headerName: '', sortable: true, filter: true, resizable: true, width: 25, cellRenderer: "commonRendererComponent",
        cellRendererParams: {
          onClick: this.openBatchPopup.bind(this)
        },
        cellStyle: (params) => {
          var rec = typeof params.data.itemRow === 'string' ? JSON.parse(params.data.itemRow)[0] : params.data.itemRow;
          return (rec
            && rec?.mfrCodeReq
            //&& !(this.invType == 9 && this.form.value.refInv_Type && this.form.value.refInv_Type == 35)
            && ((this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. Selection') || (this.invType == 40 && this.selectedTab == 1)) //|| (this.form.value.refInv_Type == 40 && this.invType == 39 && this.form.value.workType == 1))
              || (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. List') || this.makeFormHiddenInAgst() || (this.invType == 37 && this.selectedTab == 1) || (this.form.value.refInv_Type && (this.invType == 43 || this.invType == 44 || this.invType == 10 || this.invType == 53 || this.invType == 35 || this.invType == 36 || this.invType == 45)) || (this.form.value.refInv_Type == 40 && this.invType == 39 && (this.form.value.workType == 0 || this.form.value.workType == 1)))//|| (this.invType == 39)
            )) ? null : { display: 'none' };
        }
      })
      // if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Batch Icon')) {
      //   colDefs.push({
      //     field: 'item_ID',
      //     headerName: '',
      //     width: 25,
      //     cellRenderer: "commonRendererComponent",
      //     cellRendererParams: {
      //       onClick: this.openBatchPopup.bind(this)
      //     },
      //     cellStyle: (params) => {
      //       var rec = typeof params.data.itemRow === 'string' ? JSON.parse(params.data.itemRow)[0] : params.data.itemRow;
      //       return this.shouldShowBatchIcon.call(this, rec) ? null : { display: 'none' };
      //     }
      //   });
      // }
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Unit')) colDefs.push({
        field: 'unittext', headerName: 'Unit', width: 70, sortable: true, filter: true, resizable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: function (params: any) {
          return {
            values: params.data.units.map(x => x.name)
          };
        }
      })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Rate')) colDefs.push({
        field: 'std_Rate', headerName: 'Rate', width: 100, sortable: true, filter: true, resizable: true,
        headerClass: "ag-right-aligned-header",
        cellEditor: 'customNumberComponent',
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatNumberVal.bind(this)
      })
      if (this.invType == 39 && this.selectedTab == 1) colDefs.push({
        field: 'rate1', headerName: 'Job Rate', width: 100, sortable: true, filter: true, resizable: true,
        headerClass: "ag-right-aligned-header",
        cellEditor: 'customNumberComponent',
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatNumberVal.bind(this)
      },
        {
          field: 'weight', headerName: 'Weight', width: 100, editable: true, sortable: true, filter: true, resizable: true,
          headerClass: "ag-right-aligned-header",
          cellEditor: 'customNumberComponent',
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatNumberVal.bind(this)
        })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Disc %')) colDefs.push({
        field: 'discount1', headerName: 'Disc %', width: 60, sortable: true, filter: true, resizable: true,
        cellEditor: 'customNumberComponent',
        headerClass: "ag-right-aligned-header",
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatPerVal.bind(this)
      },)
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Tax %')) colDefs.push({
        field: 'vatPer', headerName: 'Tax %', width: 60, sortable: true, filter: true, resizable: true,
        headerClass: "ag-right-aligned-header",
        cellEditor: 'customNumberComponent',
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatPerVal.bind(this)
      })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'GST') && this.comapnyInfo.taxType == EnumTaxType.GST) {
        colDefs.push(
          {
            field: 'sgstAmt&cgstAmt&igstAmt', headerName: 'GST', width: 75, sortable: true, filter: true, resizable: true,
            headerClass: "ag-right-aligned-header",
            cellEditor: 'customNumberComponent',
            valueGetter: (params) => {
              return params.data.sgstAmt + params.data.cgstAmt + params.data.igstAmt;
            },
            cellStyle: () => ({
              display: "flex",
              justifyContent: "right"
            }),
            valueFormatter: this.FormatNumberVal.bind(this)
          });
      }
      else if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'VAT') && this.comapnyInfo.taxType == EnumTaxType.VAT) {
        colDefs.push(
          {
            field: 'rateAfterVat', headerName: 'VAT', width: 75, sortable: true, filter: true, resizable: true,
            headerClass: "ag-right-aligned-header",
            cellEditor: 'customNumberComponent',
            cellStyle: () => ({
              display: "flex",
              justifyContent: "right"
            }),
            valueFormatter: this.FormatNumberVal.bind(this)
          });
      }
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Amount')) colDefs.push(
        {
          field: 'amount', headerName: 'Amount', width: 100, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          headerClass: "ag-right-aligned-header",
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatNumberVal.bind(this)
        });
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Schedule Date')) colDefs.push(
        {
          headerName: 'Schedule Date', sortable: true, filter: true, resizable: true,
          field: 'scheduleDate',
          width: 100,
          cellEditor: 'customDateComponent',
          valueFormatter: this.dateFormatter, // Add the date formatter
        }
      );
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Delivery Date')) colDefs.push(
        {
          headerName: 'Delivery Date',
          field: 'deliveryDate',
          width: 100,
          sortable: true, filter: true, resizable: true,
          cellEditor: 'customDateComponent',
          valueFormatter: this.dateFormatter, // Add the date formatter
        }
      )
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Party Item Code')) colDefs.push(
        { field: 'partyItem_CodeTxt', headerName: 'Party Item Code', width: 50, sortable: true, filter: true, resizable: true, },
      );
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Description')) colDefs.push(
        { field: 'itemDescription', headerName: this.invoiceFieldVisibilityService.getFieldLabel(this.invType, 'Description'), width: 120, resizable: true, cellEditor: 'textAreaEditorComponent' }
      );
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Remarks')) colDefs.push(
        { field: 'remarks', headerName: 'Remark', width: 120, sortable: true, filter: true, resizable: true, cellEditor: 'textAreaEditorComponent' }
      );
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'PID Req') && this.checkForItemPid(this.invType) && (!this.form.value.id || this.form.value.isPID)) {
        colDefs.push({
          headerName: 'PID Req',
          field: 'pidReq', sortable: true, filter: true, resizable: true,
          cellRenderer: "checkboxCellComponent",
          width: 100,
          cellStyle: (params) => {
            return (this.form.value.isPID && params.data.itemRow.is_BOM) ? null : { display: 'none' };
          }
          // cellClassRules: {
          //   'hide-checkbox': (params) => !this.form.value.isPID,
          // },
        });
      }
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'BOM Name')) colDefs.push({ field: 'bomName', headerName: 'BOM Name', width: 120, resizable: true, });
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Cost Rate')) colDefs.push(
        {
          field: 'cost_Rate', headerName: 'Cost Rate', width: 100, sortable: true, filter: true, resizable: true,
          cellEditor: 'customNumberComponent',
          headerClass: "ag-right-aligned-header",
          cellStyle: () => ({
            display: "flex",
            justifyContent: "right"
          }),
          valueFormatter: this.FormatNumberVal.bind(this)
        },)
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Profit')) colDefs.push({
        field: 'profit', headerName: 'Profit', width: 100, sortable: true, filter: true, resizable: true,
        cellEditor: 'customNumberComponent',
        headerClass: "ag-right-aligned-header",
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatNumberVal.bind(this)
      })
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'SP')) colDefs.push(
        {
          field: 'sp_text', headerName: 'SP', width: 80, sortable: true, filter: true, resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: function (params: any) {
            return {
              values: params.data.stockplaces
            };
          }
        },);
      if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Rack No')) colDefs.push({ field: 'rackName', headerName: 'Rack No', width: 100 },)
      // if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Delete')) colDefs.push({ field: 'delete', headerName: '', width: 25, cellRenderer: "deleteButtonRendererComponent", pinned: 'right', cellRendererParams: { onClick: this.onDelete.bind(this) }, },)
      // if (this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Context Menu')) colDefs.push({ field: 'item_ID', headerName: '', width: 25, pinned: 'right', cellRenderer: "contextMenuButtonRendererComponent", onCellClicked: this.onCellContextMenu.bind(this) })
    }

    this.columnDefs = colDefs;

    // if (this.form.value.refInv_Type) this.onRefTypeInvoices(this.form.value.refInv_Type);
  }

  convertToISO(dateString: string): string {
    if (!dateString) return '';
    const [day, month, yearAndTime] = dateString?.split('/');
    const [year, time] = yearAndTime?.split(' ');
    return `${year}-${month}-${day}T${time || '00:00:00'}`;
  }

  dateFormatter(params: any): string {
    if (!params.value) {
      return ''; // Return empty string for null or undefined values
    }
    const [day, month, year] = params.value.split('/').map(Number);
    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return ''; // Return empty string for invalid date
    }
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  checkForItemPid(invType) {
    return (
      invType === 5 ||
      invType === 34
    );
  }

  togglePaymentCollapse() {
    this.isPaymentCollapsed = !this.isPaymentCollapsed;
  }

  openItemSubDetails(item: any): void {
    const modalRef = this.modalService.open(ItemSubDetailsComponent, { centered: true, size: 'lg', keyboard: false });
    modalRef.componentInstance.data = {
      itemDetail: item.rowData,
      qty: item.rowData.std_Qty,
      isEdited: false
    };
  }

  frameworkComponents = {
    viewButtonRendererComponent: AgViewButtonRendererComponent,
    commonRendererComponent: AgCommonRendererComponent,
  }

  openBatchPopup(item) {
    item = item.rowData ? item.rowData : item;
    if (item.std_Qty > 0) {
      if (this.shouldOpenBatchSelectionGridModelPopup.call(this)) {
        this.openBatchSelectionModelPopup(item);
      } else if (this.shouldOpenBatchListGridModelPopup.call(this)) {
        this.openBatchListModelPopup(item);
      }
    }
    else {
      alert('Quantity is less than 1.');
    }
  }

  shouldOpenBatchSelectionGridModelPopup() {
    return ((this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. Selection') ||
      (this.invType == 40 && this.selectedTab == 1)) && !(this.form.value.refInv_Type && (this.invType == 43 || this.invType == 44 || this.invType == 10 || this.invType == 53 || this.invType == 35 || this.invType == 36 || this.invType == 45)));
    //|| (this.form.value.refInv_Type == 40 && this.invType == 39 && this.form.value.workType == 1);
  }

  openBatchSelectionModelPopup(item: any): void {
    if (item.event && item.eventData) {
      const modalRef = item.event.modalService.open(ItemBatchSelectionComponent, { centered: true, size: 'xl', keyboard: false, scrollable: true, backdrop: 'static', backdropClass: "light-blue-backdrop", });
      modalRef.componentInstance.data = { data: item.eventData.data, form: item.event.form, invType: item.event.invType, setupInfoData: item.event.setupInfoData, isEdited: false };
      modalRef.componentInstance.passdata.subscribe((data: any) => {
        if (data.data.length) {
          item.eventData.data.invoiceItemBatchNo = data.data;
          item.eventData.data.isEdited = false;
          this.recordCreationService.announceItemOutForProcessEventChange(item.eventData.data);
        }
      });
      modalRef.componentInstance.qtyEdited.subscribe((editedQtyData: any) => {
        item.event.updateSingleRecord(editedQtyData);
        item.event.updateRowsItemSubDetails(editedQtyData, editedQtyData.invoiceItemSubDetail, editedQtyData.std_Qty);
        var index = item.event.invoiceItemList.findIndex(x => x == editedQtyData);
        item.event.invoiceItemList[index] = editedQtyData;
        item.event.gridApi.applyTransaction({ update: [editedQtyData] });
        item.event.updateRecordToForm();
        item.event.getTotals();
      });
    }
    else {
      const modalRef = this.modalService.open(ItemBatchSelectionComponent, { centered: true, size: 'xl', keyboard: false, scrollable: true, backdrop: 'static', backdropClass: "light-blue-backdrop", });
      modalRef.componentInstance.data = { data: item, form: this.form, invType: this.invType, setupInfoData: this.setupInfoData, isEdited: false };
      modalRef.componentInstance.passdata.subscribe((data: any) => {
        if (data.data.length) {
          item.invoiceItemBatchNo = data.data;
          item.isEdited = true;
          this.recordCreationService.announceItemOutForProcessEventChange(item);
        }
      });
      modalRef.componentInstance.qtyEdited.subscribe((editedQtyData: any) => {
        // this.updateSingleRecord(editedQtyData);
        // this.updateRowsItemSubDetails(editedQtyData, editedQtyData.invoiceItemSubDetail, editedQtyData.std_Qty);
        var index = this.invoiceItemList.findIndex(x => x == editedQtyData);
        this.invoiceItemList[index] = editedQtyData;
        this.gridApi.applyTransaction({ update: [editedQtyData] });
        // this.updateRecordToForm();
        this.getTotals();
      });
    }
  }

  openBatchListModelPopup(item: any): void {
    if (item.event) {
      const modalRef = item.event.modalService.open(ItemBatchDetailsComponent, { centered: true, size: 'xl', scrollable: true, keyboard: false, backdrop: 'static', backdropClass: "light-blue-backdrop", });
      modalRef.componentInstance.data = { data: item.eventData.data, form: item.event.form, invType: item.event.invType, setupInfoData: item.event.setupInfoData, isEdited: false };
      modalRef.componentInstance.passdata.subscribe((v) => {
        if (v.data.length) {
          item.eventData.data.invoiceItemBatchNo = [...v.data];
          // var index = item.event.invoiceItemList.findIndex(x => x.item_ID == item.eventData.data.item_ID);
          // item.event.invoiceItemList[index] = item;
          // var findex = item.event.filteredInvoiceItemList.findIndex(x => x.item_ID == item.eventData.data.item_ID);
          // item.event.filteredInvoiceItemList[findex] = item;
          item.event.recordCreationService.announceItemOutForProcessItemEventChange(item.eventData.data);
        }
      })
    }
    else {
      const modalRef = this.modalService.open(ItemBatchDetailsComponent, { centered: true, size: 'xl', scrollable: true, keyboard: false, backdrop: 'static', backdropClass: "light-blue-backdrop", });
      modalRef.componentInstance.data = { data: item, form: this.form, invType: this.invType, setupInfoData: this.setupInfoData, isEdited: false };
      modalRef.componentInstance.passdata.subscribe((v) => {
        if (v.data.length) {
          item.invoiceItemBatchNo = [...v.data]
          // var index = this.invoiceItemList.findIndex(x => x.item_ID == item.item_ID);         
          // this.invoiceItemList[index] = item;
          // var findex = this.filteredInvoiceItemList.findIndex(x => x.item_ID == item.item_ID);
          // this.filteredInvoiceItemList[findex] = item;
          // this.form.patchValue({ invoiceItemDetail: [...this.invoiceItemList] });
          this.recordCreationService.announceItemOutForProcessItemEventChange(item);
        };
      })
    }
  }

  shouldOpenBatchListGridModelPopup() {
    return this.invoiceFieldVisibilityService.isColumnVisible(this.invType, 'Serial No./Batch No. List') ||
      this.makeFormHiddenInAgst() ||
      (this.invType == 37 && this.selectedTab == 1) ||
      (this.form.value.refInv_Type && (this.invType == 43 || this.invType == 44 || this.invType == 10 || this.invType == 53 || this.invType == 35 || this.invType == 36 || this.invType == 45)) ||
      (this.form.value.refInv_Type == 40 && this.invType == 39 && (this.form.value.workType == 0 || this.form.value.workType == 1));
  }

  makeFormHiddenInAgst() {
    return (
      (this.invType == 35 && this.form.value.refInv_Type == 16) ||
      (this.invType == 9 && this.form.value.refInv_Type == 16) ||
      (this.invType == 9 && this.form.value.refInv_Type == 35) ||
      (this.invType == 28 && this.form.value.refInv_Type == 29) ||
      (this.invType == 30 && this.form.value.refInv_Type == 7) ||
      (this.invType == 1 && this.form.value.refInv_Type == 7) ||
      (this.invType == 3 && this.form.value.refInv_Type == 1) ||
      (this.invType == 10 && this.form.value.refInv_Type == 16) ||
      (this.invType == 10 && this.form.value.refInv_Type == 34) ||
      (this.invType == 10 && this.form.value.refInv_Type == 9) ||
      (this.invType == 1 && this.form.value.refInv_Type == 41) ||
      (this.invType == 31 && this.form.value.refInv_Type == 16)
    );
  }

  onGridReadyPaymnet(params: any) {
    this.gridApipayment = params.api;
    var colDefsPayment: any = [
      {
        headerName: "#",
        width: 30,
        sortable: true,
        filter: true,
        resizable: true,
        valueGetter: "node.rowIndex + 1",
      },
      {
        field: "paymentMode",
        headerName: "Payment Mode",
        width: 120,
        sortable: true,
        filter: true,
        resizable: true,
        valueFormatter: function (params) {
          return appCommon.EnPaymentModeObj[params.value];
        },
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 100,
        sortable: true,
        filter: true,
        resizable: true,
        headerClass: "ag-right-aligned-header",
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right",
        }),
        valueFormatter: params ? this.FormatNumberVal.bind(this) : 0,
      },
    ];

    this.columnDefsPayment = colDefsPayment;
  }

  openPreview(smallDataModal: any, src: string) {
    //https://erpapi.abssoftware.in/Uploads/Invoice/33/images-16092024042258.png
    this.previewImage = environment.apiUrl + "/" + src;
    this.modalService.open(smallDataModal, { size: "lg" });
  }

  downloadImage(url: string): void {
    // Extract the file name from the URL
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      if (blob) {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileName; // Use the extracted file name
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    });
  }

  downloadDocument(fileName, src) {
    console.log("fileName", fileName);
    this.ImageUrl = environment.apiUrl + "/" + src;

    if (this.ImageUrl) {
      this.isDownloading = true;
      this.downloadImage(this.ImageUrl);
    }
    else {
      this.isDownloading = false;
    }

    // this.downloadFile(fileName, this.getMimeTypeByExtension(extensionfile));
    // var fdata = { fileName: fileName };
    // this.invoiceService.DownloadDocument(fdata).subscribe(data => {
    //   if (data.size) {
    //     const a = document.createElement('a');
    //     const objectUrl = URL.createObjectURL(data);
    //     a.href = objectUrl;
    //     a.setAttribute("download", fileName);
    //     a.click();
    //     URL.revokeObjectURL(objectUrl);
    //   }
    //   else { this.toastrMessageService.showInfo('No file found', 'Info'); }
    //   this.isDownloading = false;
    // },
    //   async error => {
    //     this.isDownloading = false;
    //     const temp = await (new Response(error)).json();
    //     this.toastrMessageService.showInfo(temp.message, 'Info');
    //   });
  }

  // getMimeTypeByExtension(fileName) {
  //   const extension = fileName.split(".").pop().toLowerCase(); // Get file extension
  //   const mimeTypes = {
  //     png: "image/png",
  //     jpg: "image/jpeg",
  //     jpeg: "image/jpeg",
  //     gif: "image/gif",
  //     bmp: "image/bmp",
  //     svg: "image/svg+xml",
  //     pdf: "application/pdf",
  //     txt: "text/plain",
  //     html: "text/html",
  //   };
  //   return mimeTypes[extension] || "application/octet-stream"; // Default fallback
  // }

  // downloadFile(fileName, mimeType) {
  //   const blob = new Blob([], { type: mimeType });
  //   const a = document.createElement("a");
  //   const objectUrl = URL.createObjectURL(blob);
  //   a.href = objectUrl;
  //   a.setAttribute("download", fileName);
  //   document.body.appendChild(a);
  //   a.click();
  //   URL.revokeObjectURL(objectUrl);
  //   document.body.removeChild(a);
  // }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSingleUploadClick() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    } else {
      this.isBtnLoading = true;
      const formData = new FormData();
      formData.append("attachedFile", this.selectedFile);
      formData.append("id", this.recordData.id);

      this.invoiceService.UploadDocument(formData).subscribe(
        (data) => {
          this.submitted = false;
          this.isBtnLoading = false;

          var e = data;
          this.fileList.push({
            fileName: e.fileName + (e.isError ? e.errorMessage : ""),
            filePath: e.filePath,
            id: e.id,
            status: e.status,
            tableId: e.tableId,
          });

          this.clear();
          this.toastrMessageService.showSuccess(
            "Document uploaded successfully.",
            "Success"
          );
        },
        (error) => {
          this.toastrMessageService.showInfo(
            error.message ? error.message : error,
            "Info"
          );
        }
      );
    }
  }

  clear() {
    this.submitted = false;
    this.form.reset();
  }

  removeFile(item: any, i: number) {
    if (!confirm("Do you want delete the image - " + item.fileName + "?"))
      return;

    if (item.id) {
      this.invoiceService
        .DeleteDocument({ id: item.id, tableId: this.recordData.id })
        .subscribe(
          () => {
            this.fileList.splice(i, 1);
            this.toastrMessageService.showSuccess("Record Deleted", "Success");
          },
          (error) => {
            this.toastrMessageService.showInfo(
              error.message ? error.message : error,
              "Info"
            );
          }
        );
    } else {
      this.fileList.splice(i, 1);
    }
  }

  FormatNumberVal(params: any) {
    return appCommon.FormatValueBasedOnPrecision(
      Number(params.value),
      this.authServiceService,
      true,
      this.selectedCurrencyData.code
    );
  }

  authorizeInvoice(): void {
    if (
      !confirm(
        `Are you sure you want to authorize ${appCommon.InvoiceVoucherTypesObjByte[this.invType]
        } ?`
      )
    )
      return;
    if (this.isAuthBtnLoading) {
      return;
    }
    var fdata = {
      id: this.recordData.id,
      invType: this.invType,
      fromInvoice: true,
      isAuthorized: true,
    };

    this.isAuthBtnLoading = true;

    this.invoiceService.Authorize(fdata).subscribe(
      (data) => {
        var listRec = {
          table: "InvoiceAuth",
          invCode: this.form.value.id,
          isAuthorized: true,
        };

        this.recordCreationService.announceUpdate(listRec);

        this.toastrMessageService.showSuccess(
          "Invoice Authorized Successfully.",
          "Info"
        );
        this.recordData.isAuthorized = true;
        this.isAuthBtnLoading = false;
      },
      (error) => {
        this.isAuthBtnLoading = false;
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );
  }

  unauthorizeInvoice(): void {
    if (
      !confirm(
        `Are you sure you want to un-authorize ${appCommon.InvoiceVoucherTypesObjByte[this.invType]
        } ?`
      )
    )
      return;
    if (this.isUnAuthBtnLoading) {
      return;
    }
    var fdata = {
      id: this.recordData.id,
      invType: this.invType,
      fromInvoice: true,
      isAuthorized: false,
    };

    this.isUnAuthBtnLoading = true;

    this.invoiceService.Authorize(fdata).subscribe(
      (data) => {
        var listRec = {
          table: "InvoiceAuth",
          invCode: this.form.value.id,
          isAuthorized: false,
        };
        this.recordCreationService.announceUpdate(listRec);

        this.toastrMessageService.showSuccess(
          "Invoice Un-Authorized Successfully.",
          "Info"
        );
        this.recordData.isAuthorized = false;
        this.isUnAuthBtnLoading = false;
      },
      (error) => {
        this.isUnAuthBtnLoading = false;
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );
  }

  setGridValue() {
    if (
      this.recordData.invoiceItemDetail &&
      this.recordData.invoiceItemDetail.length > 0
    ) {
      var lst = this.recordData.invoiceItemDetail;

      //process item details
      for (var i = 0; i < lst.length; i++) {
        var eleItm = lst[i];

        var newRefIndex = -1;
        var totAgainstRef = 0;

        for (let j = 0; j < eleItm.invoiceItemSubDetail.length; j++) {
          const subelement = eleItm.invoiceItemSubDetail[j];

          if (subelement.new0_Against1) {
            totAgainstRef = totAgainstRef + subelement.qty;
          } else {
            newRefIndex = j;
          }
        }

        eleItm.invoiceItemSubDetail[newRefIndex].qty =
          eleItm.invoiceItemSubDetail[newRefIndex].qty - totAgainstRef;

        if (eleItm.ledger) {
          eleItm.ledger = JSON.parse(eleItm.ledger)[0];
        }

        var itemUnits = [];
        var unittext = "";

        if (eleItm.itemRow) {
          const itemRow = JSON.parse(eleItm.itemRow);
          const itemData = itemRow[0];

          itemUnits = this.getItemUnitList(itemData);

          if (eleItm.conv_Unit) {
            unittext = itemData.unit_Conv.filter(
              (x) => x.unit_Conv_ID == eleItm.conv_Unit
            )[0].convUnitName;
          } else {
            //0th element of itemUnits means default unit which is set in item master
            unittext = itemUnits[0].name;
          }

          eleItm.itemRow = itemData;
        }
        eleItm.units = itemUnits;
        eleItm.unittext = unittext;

        var stockplaces = [];
        if (this.setupInfoData) {
          for (let i = 0; i < this.setupInfoData.stockPlaces.length; i++) {
            var eleSp = this.setupInfoData.stockPlaces[i];
            stockplaces.push(eleSp.name);
          }
        }
        eleItm.stockplaces = stockplaces;
      }

      this.invoiceItemList = lst;
      this.createExtraCharge();
      this.setExtraChargesValue();

      this.getTotals();
    }
  }

  getCurrecyData(invoiceBaseCurrId) {
    const currList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.CurrencyList);
    if (currList && currList.length) {
      let recInvoiceBaseCurr = currList.find(x => x.id == invoiceBaseCurrId);
      if (recInvoiceBaseCurr) {
        this.selectedCurrencyData = recInvoiceBaseCurr;
        if (this.gridApi) this.gridApi.setRowData(this.filteredInvoiceItemList);
      }
    }
  }

  getCompBaseCurr(compBaseCurrId) {
    const currList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.CurrencyList);
    let recCompBaseCurr = currList.find(x => x.id == compBaseCurrId);
    if (recCompBaseCurr) {
      this.compCurrencyData = recCompBaseCurr;
    }
  }

  async getTotals() {
    this.totalRateAmount = 0;
    this.totalQty = 0;
    this.totalGSTAmount = 0;
    this.totalAmount = 0;
    this.totalProfit = 0;


    if (this.invoiceItemList.length) {

      for (var i = 0; i < this.invoiceItemList.length; i++) {

        var ele = this.invoiceItemList[i];

        this.totalRateAmount = appCommon.Round(this.totalRateAmount + Number(ele.std_Rate), this.comapnyInfo.precision);
        if (!ele.isExtraChargeItem) {
          this.totalQty = appCommon.Round(this.totalQty + ele.std_Qty, this.comapnyInfo.precision);
          this.totalProfit = appCommon.Round(this.totalProfit + ele.profit, this.comapnyInfo.precision)
        }
        this.totalGSTAmount = appCommon.Round(this.totalGSTAmount + ele.sgstAmt + ele.cgstAmt + ele.igstAmt, this.comapnyInfo.precision);
        this.totalAmount = appCommon.Round(this.totalAmount + ele.amount, this.comapnyInfo.precision);
      }
    }
    this.onCalculateCurrencyTotal();
  }

  onCalculateCurrencyTotal() {
    setTimeout(() => {
      var fdata = this.form.value;
      if (fdata.currRate) {
        var grandTotal = fdata.grandTotal * fdata.currRate;
        this.form.patchValue({ currTotal: grandTotal.toFixed(this.comapnyInfo.precision) })
      }
    }, 500);
  }

  loadLedgers() {
    this.ledgers = this.localStorageService.getItem(
      appCommon.LocalStorageKeyType.LedgerList
    );
  }

  notesForm(item: any) {
    return this.fb.group({
      title: [item.title ? item.title : null],
      note: [item.note ? item.note : null],
    });
  }

  get notes(): FormArray {
    return this.form.get("footerXML") as FormArray;
  }

  addNotesForm(item: any) {
    const notes = this.notes;
    notes.push(this.notesForm(item));
  }

  createForm() {
    this.form = this.fb.group({
      footerXML: this.fb.array([]),
      extraCharges: this.fb.array([]),
      files: ["", Validators.required],
    });
  }

  setExtraChargesValue() {
    const extras = this.extraCharges;
    for (let i = 0; i < extras.length; i++) {
      var element = extras.at(i);
      if (
        this.recordData.invoiceExtraCharges &&
        this.recordData.invoiceExtraCharges.length
      ) {
        let ecObj = this.recordData.invoiceExtraCharges.find(
          (x) => x.extra_Charge_ID == element.value.extra_Charge_ID
        );
        if (ecObj) {
          let amountCntrl = (element as FormGroup).get("amount");
          if (amountCntrl != null) {
            amountCntrl.patchValue(ecObj.amount);
          }

          let vatAssessValueCntrl = (element as FormGroup).get(
            "vatAssessValue"
          );
          if (vatAssessValueCntrl != null) {
            vatAssessValueCntrl.patchValue(ecObj.vatAssessValue);
          }
        }
      }
    }
  }

  createExtraCharge() {
    if (
      this.setupInfoData.extraCharges &&
      this.setupInfoData.extraCharges.length > 0
    ) {
      this.setupInfoData.extraCharges.forEach((v: any) => {
        this.addExtraChargeForm(v);
      });
    }
  }

  addExtraChargeForm(item: any) {
    this.setUiValidation(item);

    const extras = this.extraCharges;
    extras.push(this.extraChargeForm(item));
  }

  setUiValidation(item: any) {
    if (item.tax_Type == 0 || item.tax_Type == 5) {
      item.hidden = false;

      if (item.percentBased) {
        if (item.fixedPercent == 0) {
          item.amountDisabled = true;
          item.taxPercentDisabled = false;
        } else {
          item.amountDisabled = true;
          item.taxPercentDisabled = true;
        }
      } else {
        if (item.fixedAmount == 0) {
          item.amountDisabled = false;
          item.taxPercentDisabled = true;
        } else {
          item.amountDisabled = true;
          item.taxPercentDisabled = true;
        }
      }
    } else {
      item.hidden = true;
      item.amountDisabled = true;
      item.taxPercentDisabled = true;
    }
  }

  get extraCharges(): FormArray {
    return this.form.get("extraCharges") as FormArray;
  }

  extraChargeForm(item: any) {
    return this.fb.group({
      name: [item.name],
      extra_Charge_ID: [item.extraCharges_ID],
      taxType: [item.tax_Type],
      perVal: [item.taxPercent],
      charges: [0],
      cstPer: [0],
      vatPer: [0],
      amount: [0],
      effectOnTotal: [item.isPositiveEffect ? 1 : -1],
      vatAssessValue: [0],
      taxEffect: [item.cstEffect || item.vatEffect],
      hidden: [item.hidden],
      amountDisabled: [item.amountDisabled],
      taxPercentDisabled: [item.taxPercentDisabled],
    });
  }

  getFormGroupAt(i: number) {
    return this.extraCharges.at(i) as FormGroup;
  }

  onStateChnage() {
    this.form.controls["gstType"].patchValue(
      this.recordData.state == this.form.controls["state"].value ? 1 : 2
    );
    this.recordCreationService.announceInvoiceStateChange(
      this.form.controls["gstType"].value
    );
  }

  listSalesman(): void {
    var fdata = { table: 18 };
    this.commonService.dropdown(fdata).subscribe((data) => {
      this.salesmanList = data;

      this.isOnItEvent = false;
    });
  }

  generalUsers(): void {
    this.isDataLoading = true;
    var fdata = { table: 7 };
    this.commonService.dropdown(fdata).subscribe((data) => {
      this.isOnItEvent = false;
      this.generalUserList = data;
      this.isDataLoading = false;
    });
  }

  getDepartmentList() {
    this.isDataLoading = true;
    var fdata = { type: 22, table: 22 };
    this.commonService.dropdown(fdata).subscribe(
      (data) => {
        this.departmentList = data;
        this.isDataLoading = false;
      },
      (error) => {
        this.isDataLoading = false;
        this.toastrMessageService.showInfo(error.error.message, "Info");
      }
    );
  }

  passBack() {
    this.activeModal.close();
  }

  onPrint() {
    if (
      this.setupInfoData &&
      this.setupInfoData.printReports &&
      this.setupInfoData.printReports.length
    ) {
      var rec = this.setupInfoData.printReports.filter(
        (x) => x.isDefault,
        true
      )[0];
      if (rec) {
        this.isPrintBtnLoading = true;
        var fdata = {
          id: this.recordData.id,
          invType: this.setupInfoData.invTypeId,
          reportName: rec.fileName.replace("\\", ""),
        };
        this.invoiceService.PrintInvoice(fdata).subscribe(
          (response) => {
            this.isPrintBtnLoading = false;

            const blob = response.body as Blob;

            const blobUrl = window.URL.createObjectURL(blob);

            const modalRef = this.modalService.open(PrintViewModalComponent, {
              centered: true,
              size: "xl",
            });
            modalRef.componentInstance.data = {
              blobUrl: blobUrl,
              billNo: this.recordData.bill_No,
              ledger: this.recordData.ledgerData.name,
              type: appCommon.InvoiceVoucherTypesObjByte[this.invType],
            };
          },
          async (error) => {
            this.isPrintBtnLoading = false;
            const temp = await new Response(error).json();
            this.toastrMessageService.showInfo(temp.Message, "Info");
          }
        );
      } else {
        alert("No default report found for print.");
      }
    } else {
      alert("No report found for print.");
    }
  }

  onCheckStock() {
    this.isBtnLoading = true;
    var items: any[] = [];

    for (var i = 0; i < this.invoiceItemList.length; i++) {
      var ele = this.invoiceItemList[i];
      var sp = this.setupInfoData.stockPlaces.filter(
        (x) => x.name == ele.sp_text,
        true
      )[0];
      items.push({
        item: ele.item_ID,
        stockPlace:
          this.comapnyInfo.businessType == 23 ? null : sp ? sp.spId : 0,
        enteredQty: ele.std_Qty,
      });
    }

    var fdata = {
      items: items,
    };

    this.inventoryService.CheckItemsStock(fdata).subscribe(
      (data) => {
        this.currentStockList = data;

        for (var i = 0; i < this.invoiceItemList.length; i++) {
          var ele = this.invoiceItemList[i];

          var currentStockItem = this.currentStockList.filter(
            (x) => x.item_ID == ele.item_ID
          );
          if (currentStockItem.length) {
            ele.availableQty = currentStockItem[0].currentStock;
          } else {
            ele.availableQty = 0;
          }

          var old_std_Qty = ele.std_Qty;
          ele.std_Qty = 0;
          this.gridApi.applyTransaction({ update: [ele] });

          ele.std_Qty = old_std_Qty;
          this.gridApi.applyTransaction({ update: [ele] });
        }

        // Define the new column
        var newColumn = {
          headerName: "Stock",
          field: "availableQty",
          sortable: true,
          filter: true,
          resizable: true,
          width: 70,
          cellStyle: function (params) {
            if (params.data.availableQty != undefined) {
              if (
                params.data.std_Qty > Number(params.value) &&
                Number(params.value) < 1
              ) {
                return { color: "red" };
              } else if (
                params.data.std_Qty > Number(params.value) &&
                Number(params.value) > 0
              ) {
                return { color: "#ffbf00" };
              } else if (Number(params.value) < 1) {
                return { color: "red" };
              } else {
                return { color: "green" };
              }
            } else {
              return { color: "#181d1f" };
            }
          },
        };

        var columnDefs = this.gridApi.getColumnDefs();

        // Check if the new column already exists
        var existingColumn = columnDefs.find(function (column) {
          return column.field === newColumn.field;
        });

        if (!existingColumn) {
          columnDefs.splice(5, 0, newColumn);
          this.gridApi.setColumnDefs(columnDefs);
          this.gridApi.refreshCells();
        }
        this.isBtnLoading = false;
      },
      (error) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );
  }

  getuserList() {
    var fdata = {};
    this.userService.Search(fdata).subscribe(
      (data) => {
        this.userList = data.list;

        if (this.userList.length && this.recordData.loginByUserID) {
          this.setPrepareBy();
        }
      },
      (error) => {
        this.toastrMessageService.showInfo(error.error.message, "Info");
      }
    );
  }

  setPrepareBy() {
    var user = this.userList.filter(
      (x: any) => x.user_ID == this.recordData?.loginByUserID,
      true
    )[0];
    if (user)
      this.recordData.preparedBy = user?.first_Name + " " + user?.lastname;
  }

  exportToExcel() {
    if (this.invoiceItemList.length == 0) {
      this.toastrMessageService.showInfo("No result found to export.", "Info");
      return;
    }
    this.isExportBtnLoading = true;
    var toexport = [];

    for (let k = 0; k < this.invoiceItemList.length; k++) {
      const item = this.invoiceItemList[k];
      const exportObj: any = {
        "Sr No": k + 1,
        Particular: item.particular,
        HSN: item.hsn,
        SP: item.sp_text,
        Unit: item.unittext,
        Rate: item.std_Rate,
        Disc: item.discount1,
        "GST %": item.vatPer,
        GST: item.sgstAmt + item.cgstAmt + item.igstAmt,
        "Schedule Date": moment(item.scheduleDate).format("DD/MM/YYYY"),
        Descrption: item.itemDescription,
        Qty: item.std_Qty,
      };

      if (item.availableQty !== undefined) {
        exportObj.Stock = item.availableQty;
      }

      toexport.push(exportObj);
    }

    xlsxCommon.data2xlsx({
      filename: "Item List" + ".xlsx",
      sheetName: "Sheet1",
      data: toexport,
    });
    this.isExportBtnLoading = false;
  }

  onPendingCheck() {
    this.isPendingBtnLoading = true;
    var items: any[] = [];

    for (var i = 0; i < this.invoiceItemList.length; i++) {
      var ele = this.invoiceItemList[i];
      var sp = this.setupInfoData.stockPlaces.filter(
        (x) => x.name == ele.sp_text,
        true
      )[0];
      items.push({
        item: ele.item_ID,
        stockPlace: sp ? sp.spId : 0,
        enteredQty: ele.std_Qty,
      });
    }

    var fdata = {
      items: items,
    };

    this.inventoryService.CheckItemsPending(fdata).subscribe(
      (data) => {
        this.currentStockList = data;

        for (var i = 0; i < this.invoiceItemList.length; i++) {
          var ele = this.invoiceItemList[i];

          var currentStockItem = this.currentStockList.filter(
            (x) => x.item_ID == ele.item_ID
          );
          if (currentStockItem.length) {
            ele.pendingQty = currentStockItem[0].currentStock;
          } else {
            ele.pendingQty = 0;
          }

          var old_std_Qty = ele.std_Qty;
          ele.std_Qty = 0;
          this.gridApi.applyTransaction({ update: [ele] });

          ele.std_Qty = old_std_Qty;
          this.gridApi.applyTransaction({ update: [ele] });
        }

        // Define the new column
        var newColumn = {
          headerName: "Pending",
          field: "pendingQty",
          width: 70,
          sortable: true,
          filter: true,
          resizable: true,
          cellStyle: function (params) {
            if (params.data.pendingQty != undefined) {
              if (
                params.data.std_Qty > Number(params.value) &&
                Number(params.value) < 1
              ) {
                return { color: "red" };
              } else if (
                params.data.std_Qty > Number(params.value) &&
                Number(params.value) > 0
              ) {
                return { color: "#ffbf00" };
              } else if (Number(params.value) < 1) {
                return { color: "red" };
              } else {
                return { color: "green" };
              }
            } else {
              return { color: "#181d1f" };
            }
          },
        };

        var columnDefs = this.gridApi.getColumnDefs();

        // Check if the new column already exists
        var existingColumn = columnDefs.find(function (column) {
          return column.field === newColumn.field;
        });

        if (!existingColumn) {
          columnDefs.splice(5, 0, newColumn);
          this.gridApi.setColumnDefs(columnDefs);
          this.gridApi.refreshCells();
        }
        this.isPendingBtnLoading = false;
      },
      (error) => {
        this.isPendingBtnLoading = false;
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );
  }

  onPendingDetailsCheck() {
    this.isPendingDetailsBtnLoading = true;
    var items: any[] = [];

    for (var i = 0; i < this.invoiceItemList.length; i++) {
      var ele = this.invoiceItemList[i];
      var sp = this.setupInfoData.stockPlaces.filter(
        (x) => x.name == ele.sp_text,
        true
      )[0];
      items.push({
        item: ele.item_ID,
        stockPlace: sp ? sp.spId : 0,
        enteredQty: ele.std_Qty,
      });
    }

    var fdata = {
      items: items,
    };

    this.inventoryService.CheckItemsPendingDetails(fdata).subscribe(
      (data) => {
        this.currentStockList = data;

        for (var i = 0; i < this.invoiceItemList.length; i++) {
          var ele = this.invoiceItemList[i];

          var currentStockItem = this.currentStockList.filter(
            (x) => x.item_ID == ele.item_ID
          );
          if (currentStockItem.length) {
            ele.pendingDetails = currentStockItem[0].currentStock;
          } else {
            ele.pendingDetails = 0;
          }

          var old_std_Qty = ele.std_Qty;
          ele.std_Qty = 0;
          this.gridApi.applyTransaction({ update: [ele] });

          ele.std_Qty = old_std_Qty;
          this.gridApi.applyTransaction({ update: [ele] });
        }

        var newColumn = {
          field: "pendingDetails",
          headerName: "Details",
          width: 300,
          sortable: true,
          filter: true,
          resizable: true,
          wrapText: true,
          autoHeight: true,
          cellRenderer: function (params) {
            var data = params.data;
            var html = '<table style="width:100%;border-collapse:collapse;">';
            html +=
              "<tr><td>" +
              "04/03/23" +
              "</td><td>" +
              "bill 2" +
              "</td><td>" +
              "Sales Invoice" +
              "</td><td>" +
              "55.00" +
              "</td></tr>";
            html +=
              "<tr><td>" +
              "04/03/23" +
              "</td><td>" +
              "bill 2" +
              "</td><td>" +
              "Sales Invoice" +
              "</td><td>" +
              "55.00" +
              "</td></tr>";
            html +=
              "<tr><td>" +
              "04/03/23" +
              "</td><td>" +
              "bill 2" +
              "</td><td>" +
              "Sales Invoice" +
              "</td><td>" +
              "55.00" +
              "</td></tr>";
            html +=
              "<tr><td>" +
              "04/03/23" +
              "</td><td>" +
              "bill 2" +
              "</td><td>" +
              "Sales Invoice" +
              "</td><td>" +
              "55.00" +
              "</td></tr>";
            html += "</table>";
            return html;
          },
        };

        var columnDefs = this.gridApi.getColumnDefs();

        // Check if the new column already exists
        var existingColumn = columnDefs.find(function (column) {
          return column.field === newColumn.field;
        });

        if (!existingColumn) {
          columnDefs.splice(5, 0, newColumn);
          this.gridApi.setColumnDefs(columnDefs);
          this.gridApi.refreshCells();
        }
        this.isPendingDetailsBtnLoading = false;
      },
      (error) => {
        this.isPendingDetailsBtnLoading = false;
        this.toastrMessageService.showInfo(
          error.message ? error.message : error,
          "Info"
        );
      }
    );
  }

  getItemUnitList(itemData: IItem) {
    var unitList = [];

    if (!itemData.multiRate) {
      unitList.push({ name: itemData.std_Unit, id: null });
    } else {
      if (itemData.unit_Conv) {
        itemData.unit_Conv.map((x) => {
          unitList.push({ name: x.convUnitName, id: x.unit_Conv_ID });
        });
      }
    }
    return unitList;
  }

  onEdit() {
    const editUrl = (this.fromPOS ? "pos/" : "invoices/") + appCommon.InvoiceVoucherTypesReverseObj[this.invType] + "/edit/" + this.recordData.id;
    if (this.isFromInv) {
      this.router.navigate([editUrl]);
      this.passBack();
    } else {
      window.open("#/" + editUrl, "_blank");
    }
  }

  openPopup(item) {
    if (
      item.data.itemRow &&
      item.data.itemRow.is_BOM &&
      !item.data.bomCode &&
      item.data.pidReq
    ) {
      this.openPidList(item);
    } else if (
      item.data.itemRow &&
      item.data.itemRow.is_BOM &&
      item.data.bomCode &&
      !item.data.pidReq
    ) {
      this.openBOMDetailstPopup(item);
    } else {
      this.openItemDetailstPopup(item);
    }
  }

  openPidList(item: any): void {
    if (item.data.invoiceItemPIDNo && item.data.invoiceItemPIDNo.length) {
      const modalRef = this.modalService.open(PidListComponent, {
        centered: true,
        size: "xl",
        scrollable: true,
        keyboard: false,
      });
      modalRef.componentInstance.data = {
        data: item.data,
        invType: this.invType,
      };
    } else {
      alert("Pid List not found.");
    }
  }

  openBOMDetailstPopup(item: any): void {
    item.data.bomId = item.data.bomCode;
    const modalRef = this.modalService.open(BomItemDetailsViewComponent, {
      centered: true,
      size: "xl",
    });
    modalRef.componentInstance.data = {
      data: item.data,
      qty: item.data.std_Qty,
    };
  }

  openItemDetailstPopup(item: any): void {
    const modalRef = this.modalService.open(ItemDetailsModalComponent, {
      centered: true,
      size: "xl",
    });
    modalRef.componentInstance.data = { data: item.data };
  }
}

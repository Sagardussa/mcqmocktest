import { formatDate } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, ColumnApi } from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { CommonService } from 'src/app/providers/services/common.service';
import { InvoiceService } from 'src/app/providers/services/invoice.service';
import { PrintService } from 'src/app/providers/services/print.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ReportServiceService } from 'src/app/providers/services/report-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal.component';
import { xlsxCommon } from 'src/app/common/xlsx_common';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';

@Component({
  selector: 'app-item-register-view',
  templateUrl: './item-register-view.component.html',
  styleUrls: ['./item-register-view.component.scss']
})
export class ItemRegisterViewComponent implements OnInit {
  searchForm: FormGroup;
  gridApi: any;
  gridColumnApi!: ColumnApi;
  columnDefs: ColDef[];
  isOnItEvent: boolean = false;
  loginSuccessSubscription: Subscription;
  lst: any = [];
  stockPlaceList: any = [];
  isBtnLoading: boolean = false;
  submitted: boolean = false;
  public appCommon = appCommon;
  setupInfoData: any = {};
  precision: number = 2;
  isPrintBtnLoading: boolean = false;
  isExportBtnLoading: boolean = false;
  @Input() itemid: any;
  @Input() nm: any;
  @Input() currentStockSummaryForm: any;
  gridHeightWidth: any = {};
  currentCompany: ICompanyViewModel;
  constructor(
    private printService: PrintService,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private reportServiceService: ReportServiceService,
    recordCreationService: RecordCreationService,
    private commonService: CommonService,
    private authServiceService: AuthServiceService,
    private router: Router,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    companyResolver: CompanyResolver,) {
    this.currentCompany = companyResolver.getCurrentCompany();
    this.loginSuccessSubscription =
      recordCreationService.loginSuccessEventChanged$.subscribe(() => {
        if (this.isOnItEvent) {
          this.getDataFromApi();
        }
      });

    var token = this.authServiceService.getTokenInfo();
    if (token.company) {
      this.precision = token.company.precision;
    }
  }

  ngOnInit(): void {
    this.isOnItEvent = true;
    this.createSearchForm();
    this.getDataFromApi();
    this.searchForm.patchValue({ item: this.itemid, fromDate: this.currentStockSummaryForm.value.fromDate, toDate: this.currentStockSummaryForm.value.toDate })
    this.submitReportView();
    this.setGridHeight();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {
    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * (appCommon.GridHeightPer - 0.14)).toString() + 'px',
    };
  }

  getDataFromApi() {
    this.getStockPlaceList();
  }

  ngOnDestroy(): void {
    this.loginSuccessSubscription.unsubscribe();
  }

  clear() {
    this.submitted = false;
    this.createSearchForm();
  }

  createSearchForm(): void {
    this.searchForm = this.fb.group({
      fromDate: [formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd', 'en')],
      toDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      isOpeningStock: [false],
      stockDetail: [false],
      spIds: [null],
      item: [null, Validators.required],
      resultType: [1, [Validators.required]],
      includeInternalMov: [true],
    });
  }

  submitSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    else {
      if (this.searchForm.value.resultType == 1) {
        this.submitReportView();
      } else {
        this.submitReportExportToExcel();
      }
    }
  }
  submitReportExportToExcel() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    else {
      this.isExportBtnLoading = true;
      var fdata = this.getFilters();

      if (fdata.fromDate) {
        fdata.fromDate = moment(fdata.fromDate).format('DD/MM/yyyy') + " " + "00:00:00";
      }
      if (fdata.toDate) {
        fdata.toDate = moment(fdata.toDate).format('DD/MM/yyyy') + " " + "23:59:59";
      }

      this.reportServiceService.ItemRegisterExport(fdata)
        .subscribe(data => {
          if (data.size) {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(data);
            a.href = objectUrl;
            a.setAttribute("download", 'item-registerReport.xlsx');
            a.click();
            URL.revokeObjectURL(objectUrl);
          }
          else { this.toastrMessageService.showInfo('No data found to export.', 'Info'); }
          this.isExportBtnLoading = false;
        },
          async error => {
            this.isExportBtnLoading = false;
            const temp = await (new Response(error)).json();
            this.toastrMessageService.showInfo(temp.message, 'Info');
          });
    }
  }

  onPrintClick() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    else {
      this.isPrintBtnLoading = true;
      var fdata = this.getFilters();

      if (fdata.fromDate) {
        fdata.fromDate = moment(fdata.fromDate).format('DD/MM/yyyy') + " " + "00:00:00";
      }
      if (fdata.toDate) {
        fdata.toDate = moment(fdata.toDate).format('DD/MM/yyyy') + " " + "23:59:59";
      }

      this.reportServiceService.ItemRegisterExport(fdata)
        .subscribe(data => {
          if (data.size) {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(data);
            a.href = objectUrl;
            a.setAttribute("download", 'item-registerReport.xlsx');
            a.click();
            URL.revokeObjectURL(objectUrl);
          }
          else { this.toastrMessageService.showInfo('No data found to export.', 'Info'); }
          this.isPrintBtnLoading = false;
        },
          async error => {
            this.isPrintBtnLoading = false;
            const temp = await (new Response(error)).json();
            this.toastrMessageService.showInfo(temp.message, 'Info');
          });
    }
  }

  submitReportView() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    var fdata = this.getFilters();

    if (fdata.fromDate) {
      fdata.fromDate = moment(fdata.fromDate).format('DD/MM/yyyy') + " " + "00:00:00";
    }
    if (fdata.toDate) {
      fdata.toDate = moment(fdata.toDate).format('DD/MM/yyyy') + " " + "23:59:59";
    }

    //this.gridApi.showLoadingOverlay();
    this.isBtnLoading = true;

    this.reportServiceService.ItemRegister(fdata).subscribe(
      (data) => {
        this.isBtnLoading = false;

        if (data && data.length) {
          const colDefs: any = [];

          const keys = Object.keys(data[0]);
          keys.forEach((key) => {
            colDefs.push(this.resolveColDef(key));
          });

          this.gridApi.setColumnDefs(colDefs);
          this.gridColumnApi.setColumnsVisible(['BOMCode'], false);
          this.gridColumnApi.setColumnsVisible(['BOMName'], false);

          this.lst = data;
        } else {
          this.lst = [];
          this.toastrMessageService.showInfo(
            'No values found for selected criteria',
            'Info'
          );
        }
      },
      (error) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showInfo(error.error.message, 'Info');
        this.lst = [];
        this.gridApi.setRowData(this.lst);
      }
    );
  }

  resolveColDef(key: any) {
    if (key == 'BillNo') {
      return {
        field: 'BillNo',
        headerName: 'Bill No',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        wrapText: true,
        autoHeight: true,
        cellStyle: () => ({
          'font-weight': '600',
          'color': '#4aa3ff',
          cursor: 'pointer',
          'text-decoration': 'underline'
        }),
        onCellClicked: this.openInvDetailstPopup.bind(this)
      };
    } else if (key == 'BillDate') {
      return {
        field: 'BillDate',
        headerName: 'Bill Date',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        wrapText: true,
        autoHeight: true,
        valueFormatter: function (params: any) {
          if (params.value)
            return moment(params.value).format('DD/MM/yyyy hh:mm A');

        },
      };
    } else if (key == 'Type') {
      return {
        field: 'Type',
        headerName: 'Invoice Type',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        wrapText: true,
        autoHeight: true,
      };
    } else if (key == 'Party') {
      return {
        field: 'Party',
        headerName: 'Ledger',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
      };
    } else if (key == 'StockPlace') {
      return {
        field: 'StockPlace',
        headerName: 'Stock Place',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        wrapText: true,
        autoHeight: true,
      };
    } else if (key == 'Balance') {
      return {
        field: 'Balance',
        headerName: 'Balance',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        cellStyle: () => ({
          display: 'flex',
          justifyContent: 'right',
        }),
        headerClass: "ag-right-aligned-header",
        valueFormatter: this.FormatNumberVal.bind(this),
      };
    } else if (key == 'LedgerId') {
      return {
        field: 'LedgerId',
        headerName: 'LedgerId',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'TypeId') {
      return {
        field: 'TypeId',
        headerName: 'TypeId',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'Invcode') {
      return {
        field: 'Invcode',
        headerName: 'Invcode',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'Rate') {
      return {
        field: 'Rate',
        headerName: 'Rate',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'Discount1') {
      return {
        field: 'Discount1',
        headerName: 'Discount1',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'Discount2') {
      return {
        field: 'Discount2',
        headerName: 'Discount2',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'Discount3') {
      return {
        field: 'Discount3',
        headerName: 'Discount3',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else if (key == 'NetRate') {
      return {
        field: 'NetRate',
        headerName: 'NetRate',
        sortable: true,
        filter: true,
        resizable: true,
        width: 150,
        hide: true,
      };
    } else {
      return {
        field: key,
        width: 100,
        filter: true,
        headerClass: "ag-right-aligned-header",
        cellStyle: () => ({
          display: 'flex',
          justifyContent: 'right',
        }),
        valueFormatter: this.FormatNumberVal.bind(this),
      };
    }
  }

  FormatNumberVal(params: any) {
    return appCommon.FormatValueBasedOnPrecision(
      params.value,
      this.authServiceService,
      false
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getFilters() {
    var obj: any = {

      fromDate: this.searchForm.value.fromDate ? this.searchForm.value.fromDate : null,

      toDate: this.searchForm.value.toDate ? this.searchForm.value.toDate : null,

      isOpeningStock: this.searchForm.value.isOpeningStock,

      includeInternalMov: this.searchForm.value.includeInternalMov,

      stockDetail: this.searchForm.value.stockDetail,

      spIds: (!this.searchForm.value.isOpeningStock && this.searchForm.value.spIds) ? [parseInt(this.searchForm.value.spIds)] : null,

      itemId: this.searchForm.value.item,
    };
    return obj;
  }

  quickSearch() {
    this.submitReportView();

    this.searchForm.controls['fromDate'].patchValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.searchForm.controls['toDate'].patchValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    this.searchForm.controls['isOpeningStock'].patchValue(false);
    this.searchForm.controls['stockDetail'].patchValue(false);
    this.searchForm.controls['spIds'].patchValue(null);
  }

  getStockPlaceList(): void {
    var fdata = { table: 4 };
    this.commonService.dropdown(fdata).subscribe((data) => {
      this.stockPlaceList = data;
      this.isOnItEvent = false;
    });
  }

  onEdit(e: any) {

    var invTypeText = appCommon.InvoiceVoucherTypesReverseObj[e.rowData.TypeId];

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['invoices/' + invTypeText + "/edit/" + e.rowData.Invcode])
    );
    window.open("/#" + url, '_blank');
  }

  openInvDetailstPopup(item: any) {
    if (item.data.Invcode) {
      var fdata = { invtype: item.data.TypeId, fromInvoice: true };

      this.invoiceService
        .SetupInfo(fdata)
        .subscribe(
          data => {
            item.data.invCode = item.data.Invcode;
            const modalRef = this.modalService.open(InvoiceDetailsModalComponent, { centered: true, size: 'xl' });
            modalRef.componentInstance.data = { setupInfoData: data, type: item.data.TypeId, invType: item.data.TypeId, recordData: item.data, precision: this.precision };
          },
          error => {
            this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");
          });
    }
  }

  onPrintReportClick() {
    var fdata = this.getFilters();
    this.isPrintBtnLoading = true;
    this.reportServiceService
      .ItemRegister(fdata)
      .subscribe(
        data => {
          this.printService.printData(data);
          this.isPrintBtnLoading = false;
        },
        error => {
          this.isPrintBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  exportToExcel() {
    const fdata = this.searchForm.value;

    var lineData: string[] = [];
    if (fdata.item) { lineData.push(`Item : ${this.nm}`); };

    this.isExportBtnLoading = true;

    const allDisplayedColumns = this.gridColumnApi.getAllDisplayedColumns();

    // To get the field names in the visible order
    const columnDefs = allDisplayedColumns.map(column => column.getColDef());

    const headers = columnDefs.map(colDef => colDef.headerName);
    const rowData: any[] = [];

    // Iterate over the grid's data after filters and sorting are applied
    this.gridApi.forEachNodeAfterFilterAndSort(node => {
      const row = [];
      columnDefs.forEach((colDef: any) => {
        let value = node.data[colDef.field];
        if (colDef.headerName === '#') {
          value = node.rowIndex + 1;
        } else {
          value = node.data[colDef.field];
          if (colDef.valueFormatter) {
            value = colDef.valueFormatter({ value: value });
          }
        }
        row.push(value);
      });
      rowData.push(row);
    });

    // Combine headers and row data for export
    const exportData = [headers, ...rowData];
    // Export to Excel
    xlsxCommon.data2xlsxForDoc({
      lineData: lineData,
      reportTitle: `Stock Ledger Report : ${moment(fdata.fromDate).format('DD/MM/yyyy')} - ${moment(fdata.toDate).format('DD/MM/yyyy')}`,
      company: this.currentCompany,
      data: exportData,
      sheetName: 'Stock Ledger Report',
      filename: 'Stock Ledger Report.xlsx'
    });

    this.isExportBtnLoading = false;
  }
}
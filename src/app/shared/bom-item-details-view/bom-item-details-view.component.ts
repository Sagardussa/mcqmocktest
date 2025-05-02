import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { xlsxCommon } from 'src/app/common/xlsx_common';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { IItem } from 'src/app/core/interfaces/item';
import { ItemDetailsModalComponent } from 'src/app/pages/masters/item/item-details-modal/item-details-modal.component';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { ItemFetchService } from 'src/app/providers/services/item-fetch.service';
import { ItemServiceService } from 'src/app/providers/services/item-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-bom-item-details-view',
  templateUrl: './bom-item-details-view.component.html',
  styleUrls: ['./bom-item-details-view.component.scss']
})
export class BomItemDetailsViewComponent implements OnInit {
  columnDefs: ColDef[];
  gridApi: any;
  bomItemList: any[] = [];
  public appCommon = appCommon;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  precision: number = 2;
  recordData = null;
  selectedItemUnitList: any = [];
  @Input() data: any;
  @Input() qty: any;
  isDataLoading: boolean;
  isExportBtnLoading: boolean = false;
  currentCompany: ICompanyViewModel;
  isFromMasterBOM: boolean;
  constructor(
    private authServiceService: AuthServiceService,
    private itemFetchService: ItemFetchService,
    private itemService: ItemServiceService,
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    companyResolver: CompanyResolver,
  ) {
    this.currentCompany = companyResolver.getCurrentCompany();
    var token = this.authServiceService.getTokenInfo();
    if (token.company) {
      this.precision = token.company.precision;
    }
  }

  ngOnInit() {
    this.getData();
    this.isFromMasterBOM = this.data.isFromMasterBOM;
  }

  getData(): void {
    if (this.data.data.includeItemId) this.data.data.item_ID = this.data.data.includeItemId;
    if (this.data.data.includeBomMasterId) this.data.data.bomId = this.data.data.includeBomMasterId;
    var fdata = { bomMasterId: this.data.data.bomId, itemId: this.data.data.item_ID };

    this.itemService.GetBOM(fdata)
      .subscribe(
        data => {
          this.recordData = data;
          //get bom data
          this.recordData.bomData = this.recordData.bom_Master.find(x => x.id == this.data.data.bomId);
          setTimeout(() => {
            this.setBOMItem();
          }, 100);
        },
        error => {
          this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");
        });
  }

  onEdit() {
    const editUrl = 'masters/bill-of-material/edit/'  + this.data.data.item_ID + '/' + this.data.data.bomId;
    if(this.isFromMasterBOM) {
      this.router.navigate([editUrl]);
      this.cancelDialog();
    }
    else {
      window.open("#/" + editUrl, "_blank");
    }
  }

  async setBOMItem() {
    if (this.recordData && this.recordData.bom_Map) {
      try {
        this.isDataLoading = true;
        this.gridApi.showLoadingOverlay();

        if (this.data.data.includeBomMasterId) {
          this.data.data.bomId = this.data.data.includeBomMasterId;
        }

        const promises = this.recordData.bom_Map.map(async v => {
          if (v.bomMasterId == this.data.data.bomId) {
            // v.nitem = item;
            // v.particular = item.name;
            v.item_CodeTxt = v.includeItemCode;
            v.name = v.includeItemName;
            v.particular = v.name;
            v.unittext = v.unitName;
            v.amount = v.qty * v.rate;
            // this.selectedItemUnitList = await this.getItemUnitList(v.nitem);
            // if (this.selectedItemUnitList.length) {
            //   v.unitId = v.unitId ? v.unitId : this.selectedItemUnitList[0].id;
            //   v.unittext = this.selectedItemUnitList.find(x => x.id == v.unitId).name;
            //   v.units = this.selectedItemUnitList;
            // }

            return v;
          }
        });

        const bomItems = await Promise.all(promises);
        this.bomItemList = bomItems.filter(Boolean); // Filter out undefined values

        setTimeout(() => {
          this.gridApi.setRowData(this.bomItemList);
          this.isDataLoading = false;
        }, 500);
      } catch (error) {
        console.error("Error in setBOMItem:", error);
        this.isDataLoading = false;
      }
    }
  }


  openItemDetailstPopup(item: any): void {
    const modalRef = this.modalService.open(ItemDetailsModalComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.data = { data: { id: item.data.includeItemId } };
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    var colDefs: any = [
      { headerName: '#', resizable: true,sortable: true,filter: true, valueGetter: "node.rowIndex + 1" },
      {
        field: 'item_CodeTxt', headerName: 'Item Code', tooltipField: 'particular', resizable: true,sortable: true,filter: true,
        cellStyle: () => ({
          'font-weight': '600',
          'color': '#4aa3ff',
          cursor: 'pointer',
          'text-decoration': 'underline'
        }),
        onCellClicked: this.openItemDetailstPopup.bind(this)
      },
      { field: 'name', headerName: 'Name And Description', tooltipField: 'particular', width: 200,resizable: true,sortable: true,filter: true, },
      {
        field: 'unittext', headerName: 'Unit', width: 70,resizable: true,sortable: true,filter: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: function (params: any) {
          return {
            values: params.data.units.map(x => x.name)
          };
        }
      },
      { field: 'qty', headerName: 'Qty', width: 100, resizable: true,sortable: true,filter: true, },
    ];
    if (this.data.qty) colDefs.push(
      {
        field: 'qty', headerName: 'Total Qty', width: 100, resizable: true,sortable: true,filter: true,
        valueFormatter: (params) => {
          return (params.value * this.data.qty).toString();
        }
      }
    );
    colDefs.push(
      {
        field: 'rate', headerName: 'Rate', width: 100,resizable: true,sortable: true,filter: true,
        headerClass: "ag-right-aligned-header",
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatNumberVal.bind(this)
      },
      {
        field: 'amount', headerName: 'Amount', width: 100,resizable: true,sortable: true,filter: true,
        headerClass: "ag-right-aligned-header",
        cellStyle: () => ({
          display: "flex",
          justifyContent: "right"
        }),
        valueFormatter: this.FormatNumberVal.bind(this)
      },
      {
        field: 'includeBomMasterName', headerName: 'BOM Name', width: 200, resizable: true,sortable: true,filter: true,
        cellStyle: () => ({
          'font-weight': '600',
          'color': '#4aa3ff',
          cursor: 'pointer',
          'text-decoration': 'underline'
        }),
        onCellClicked: this.openBOMDetailstPopup.bind(this)
      });

    this.columnDefs = colDefs;
  }

  openBOMDetailstPopup(item: any): void {
    const modalRef = this.modalService.open(BomItemDetailsViewComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.data = { data: item.data };
  }

  FormatNumberVal(params: any) {
    return appCommon.FormatValueBasedOnPrecision(Number(params.value), this.authServiceService);
  }

  getItemUnitList(itemData: IItem) {
    var unitList = [];

    if (!itemData.multiRate) {
      unitList.push({ name: itemData.std_Unit, id: null });
    }
    else {
      if (itemData.unit_Conv) {
        itemData.unit_Conv.map(x => {
          unitList.push({ name: x.convUnitName, id: x.unit_Conv_ID });
        });
      }
    }
    return unitList;
  }

  cancelDialog() {
    this.activeModal.close();
  }

  exportToExcel() {
    this.isExportBtnLoading = true;

    var lineData: string[] = [];
    if (this.recordData) { lineData.push(`Item Code: ${this.recordData.item_CodeTxt}, Category: ${this.recordData.category}, Type: ${this.recordData.type}, Group: ${this.recordData.itemGroup}`); };
    if (this.recordData) { lineData.push(`Item Name: ${this.recordData.name}, Sizes: ${this.recordData.sizes}, Brand: ${this.recordData.brand}`); };

    // Get the current column definitions and their order
    const columnDefs = this.gridApi.getColumnDefs();
    const headers = columnDefs.map(colDef => colDef.headerName);
    const rowData: any[] = [];

    // Iterate over the grid's data after filters and sorting are applied
    this.gridApi.forEachNodeAfterFilterAndSort(node => {
      const row = [];
      columnDefs.forEach(colDef => {
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
      reportTitle: `BOM Details : ${this.recordData.bomData.name}`,
      company: this.currentCompany,
      data: exportData,
      sheetName: 'BOM Details',
      filename: 'BOM Details.xlsx'
    });

    this.isExportBtnLoading = false;
  }
}
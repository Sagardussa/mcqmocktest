import { formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { CommonService } from 'src/app/providers/services/common.service';
import { GridUtilsService } from 'src/app/providers/services/grid-utils.service';
import { GroupServiceService } from 'src/app/providers/services/group-service.service';
import { LedgerServiceService } from 'src/app/providers/services/ledger-service.service';
import { MasterSyncService } from 'src/app/providers/services/master-sync.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-search-ledger',
  templateUrl: './search-ledger.component.html',
  styleUrls: ['./search-ledger.component.scss']
})
export class SearchLedgerComponent implements OnInit {

  groups: any = [{ parentId: 16 }, { parentId: 17 }, { id: 16 }, { id: 17 }];

  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddToList: EventEmitter<any> = new EventEmitter<any>();
  @Output() onToDateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onGroupChange: EventEmitter<any> = new EventEmitter<any>();
  columnDefs: ColDef[];
  gridApi: any;
  @Input() lst: any = [];
  public rowSelection = 'multiple';
  ledgerSearchSearchForm: FormGroup;
  ledgerList: any = [];
  groupList: any = [];
  groupFiltered: any = [];
  public appCommon = appCommon;
  isSearchBtnLoading: boolean = false;
  salesPersonList: any = {};
  isOnItEvent: boolean = false;
  loginSuccessSubscription: Subscription;

  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';

  defaultColDef = {
    resizable: true,
    autoHeight: true,
  };
  @ViewChild('dfltinp') dfltinp: ElementRef;
  gridHeightWidth: any = {};

  constructor(private recordCreationService: RecordCreationService,
    private fb: FormBuilder,
    private commonService: CommonService,
    private masterSyncService: MasterSyncService,
    private ledgerServiceService: LedgerServiceService,
    private groupServiceService: GroupServiceService,
    private toastrMessageService: ToastrMessageService,
    private gridUtilsService: GridUtilsService,) {
    this.createLedgerSearchSearchForm();
    this.loginSuccessSubscription =
      recordCreationService.loginSuccessEventChanged$.subscribe((record) => {
        this.masterSyncService.SyncLedgers();
        this.listSalesPerson();
        this.getGroupList();
      });
  }

  ngOnInit(): void {
    this.getGroupList();
    this.listSalesPerson();
    this.setGridHeight();
    this.ledgerSearchSearchForm.get('toDate').valueChanges.subscribe(data => {
      setTimeout(() => { this.onToDateChange.emit(data) });
    });

    this.ledgerSearchSearchForm.get('groupId').valueChanges.subscribe(data => {
      setTimeout(() => { this.onGroupChange.emit(data) });
    });
  }



  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {
    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * (appCommon.GridHeightPer - 0.04)).toString() + 'px',
    };
  }

  ngAfterViewInit() {
    this.focusOnDefault();
  }

  focusOnDefault() {
    setTimeout(() => { if (this.dfltinp.nativeElement) this.dfltinp.nativeElement.focus(); }, 50);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.columnDefs = [
      {
        width: 25,
        headerName: '',
        field: 'ledger_id',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        valueFormatter: function (params) {
          return '';
        }
      },
      { field: 'name', headerName: 'Ledger', sortable: true, filter: true, resizable: true, width: 400, wrapText: true, autoHeight: true },
      { field: 'group', headerName: 'Group', sortable: true, filter: true, resizable: true, width: 200 },
      {
        field: 'address', headerName: 'Address', filter: true, resizable: true, width: 500,
        valueFormatter: function (params) {
          return params.value ? params.value : '' + " " +
            params.data.area ? params.data.area : '' + " " +
              params.data.city ? params.data.city : '' + " " +
                params.data.state ? params.data.state : ''
        },
      },
      {
        field: 'phone_1', headerName: 'Contact Info', filter: true, resizable: true, width: 180,
        valueFormatter: function (params) {
          return params.value ? params.value : '' + " " + params.data.phone_2 ? params.data.phone_2 : '' + " " + params.data.email ? params.data.email : '';
        },
      },
    ];
  }

  createLedgerSearchSearchForm(): void {
    this.ledgerSearchSearchForm = this.fb.group({
      name: [""],
      assignedUserID: [""],
      groupId: [17],
      includeChildGroups: [true],
      toDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
  }

  clearLedgerSearchSearchForm() {
    this.createLedgerSearchSearchForm();
    this.ledgerList = [];
  }

  listSalesPerson(): void {
    var fdata = { table: 18 };
    this.commonService.dropdown(fdata)
      .subscribe(
        data => {
          this.salesPersonList = data;

          this.isOnItEvent = false;
        }
      )
  }

  getGroupList(): void {
    this.groupServiceService
      .Search({})
      .subscribe(
        data => {
          data.list.forEach(v => {
            if (v.id == "16" || v.id == "17") {
              this.groupList.push(v);
            }
            else if (v.parentId == "16" || v.parentId == "17") { this.groupList.push(v); }
            else {
              //nothing
            }
          });
        },
      );
  }

  onFilterChanged() {
    // Recalculate totals when filter changes
    if (this.gridApi) {
      //this.gridUtilsService.updateColumnDefsWithFooter(this.gridApi, this.gridApi.getColumnDefs());
    }
  }

  searchLedgers() {

    var fdata = this.getLedgerSearchFilters();
    this.isSearchBtnLoading = true;

    this.ledgerServiceService
      .Search(fdata)
      .subscribe(
        data => {
          this.isSearchBtnLoading = false;
          this.ledgerList = data.list;
          //this.gridApi.setRowData(this.ledgerList);
          //this.gridUtilsService.setRecords(this.ledgerList);
          setTimeout(() => {
            if (this.gridApi) {
              this.gridApi.forEachNode((node: any) => node.setSelected(true));
              //this.gridUtilsService.updateColumnDefsWithFooter(this.gridApi, this.gridApi.getColumnDefs());
            }
          });
        },
        error => {
          this.isSearchBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
          this.ledgerList = [];
        });
  }

  getLedgerSearchFilters() {

    var toDate = null;
    if (this.ledgerSearchSearchForm.value.toDate) {
      toDate = moment(this.ledgerSearchSearchForm.value.toDate).format('DD/MM/yyyy') + " " + "23:59:59";
    }

    var obj: any = {
      isSync: false,
      name: null,
      assignedUserID: null,
      groups: [],
      includeChildGroups: false,
      toDate: toDate,
      lockFreeze: false
    };

    if (this.ledgerSearchSearchForm.value.name) {
      obj.name = this.ledgerSearchSearchForm.value.name;
    }

    obj.assignedUserID = this.ledgerSearchSearchForm.value.assignedUserID
      ? this.ledgerSearchSearchForm.value.assignedUserID
      : null;

    if (this.ledgerSearchSearchForm.value.groupId) {
      obj.groups.push(this.ledgerSearchSearchForm.value.groupId);
    }

    obj.includeChildGroups = this.ledgerSearchSearchForm.value.includeChildGroups;
    return obj;
  }

  submit() {
    let rowsSelection = this.gridApi.getSelectedRows();


    if (rowsSelection.length) {
      this.onAddToList.emit(rowsSelection);

    }
    else {
      alert('Please select ledger(s)');
    }
  }

  onNextClick() {
    this.onNext.emit(null);
  }


}

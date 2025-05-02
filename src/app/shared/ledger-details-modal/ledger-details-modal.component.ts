import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { CommonService } from 'src/app/providers/services/common.service';
import { LedgerServiceService } from 'src/app/providers/services/ledger-service.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { MasterSyncService } from 'src/app/providers/services/master-sync.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-ledger-details-modal',
  templateUrl: './ledger-details-modal.component.html',
  styleUrls: ['./ledger-details-modal.component.scss']
})
export class LedgerDetailsModalComponent implements OnInit {

  @Input() public data;
  ledger_id: number = 0;
  recordData: any;
  isDataLoading: boolean = false;
  precision: number;
  comapnyInfo: any;
  groupList: any = [];
  public appCommon = appCommon;

  ledgerlistFilter: any = {
    groups: [],
    includeChildGroups: true,
  };

  ledgers: any = [];
  ledgerSyncEventCompletedSubscription: Subscription;
  salesPersonList: any = [];

  isBank: boolean = false;
  isSundryDebtorChild: boolean = false;
  isSundryCreditorChild: boolean = false;
  billWise: boolean = false;
  isFromMasterLedger: boolean;

  constructor(
    private ledgerServiceService: LedgerServiceService,
    private toastrMessageService: ToastrMessageService,
    public activeModal: NgbActiveModal,
    private authServiceService: AuthServiceService,
    private localStorageService: LocalStorageServiceService,
    recordCreationService: RecordCreationService,
    private masterSyncService: MasterSyncService,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.comapnyInfo = this.authServiceService.getTokenInfo().company;
    this.precision = this.comapnyInfo.precision;

    this.ledgerSyncEventCompletedSubscription =
      recordCreationService.ledgerSyncEventCompleted$.subscribe(() => {
        this.loadLedgers();
      });
  }

  ngOnInit(): void {
    this.masterSyncService.SyncLedgers();
    this.ledger_id = this.data.ledger_id;
    this.getData();
    this.listSalesPerson();
    this.getGroupList();
    this.isFromMasterLedger = this.data.isFromMasterLedger;
  }

  onEdit() {
    const editUrl = 'masters/ledgers/edit/' + this.ledger_id
    if(this.isFromMasterLedger) {
      this.router.navigate([editUrl]);
      this.passBack();
    }
    else {
      window.open("#/" + editUrl, "_blank");
    }
  }

  ngOnDestroy(): void {
    this.ledgerSyncEventCompletedSubscription.unsubscribe();
  }

  getData(): void {

    this.isDataLoading = true;

    var fdata = { id: this.ledger_id };

    this.ledgerServiceService.Get(fdata)
      .subscribe(
        data => {
          this.recordData = data;

          if (this.groupList.length) this.setGroup();

          if (this.recordData.isProject && this.recordData.project_Parent && this.ledgers.length) {
            this.setLedger();
          };

          if (this.recordData.assignedUserID && this.salesPersonList.length) this.setSalesPerson();

          this.isDataLoading = false;
        },
        error => {
          this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");
        });
  }

  passBack() {
    this.activeModal.close();
  }

  loadLedgers() {
    var ldrList = this.localStorageService.getItem(
      appCommon.LocalStorageKeyType.LedgerList
    );
    if (ldrList.length) {
      //filter
      var grpList = this.localStorageService.getItem(
        appCommon.LocalStorageKeyType.GroupList
      );
      if (grpList.length) {
        var childGroups: any = [];

        this.ledgerlistFilter.groups.forEach((v: Number) => {
          childGroups.push(v);
          this.appCommon.GetChildGroupIds(v, grpList, childGroups);
        });
      }
      if (this.ledgerlistFilter.groups.length > 0)
        ldrList = ldrList.filter(
          (x: any) => !x.lock_Freeze && childGroups.indexOf(x.group_ID) != -1
        );

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

        ele.particular = particular.join(' ');
        ele.group = grpList.filter((x: any) => x.id == ele.group_ID)[0].name;
      }
    }

    if (ldrList && ldrList.length) {
      this.ledgers = ldrList.sort((a, b) => a.particular.localeCompare(b.particular));
    }

    if (this.ledgers.length && this.recordData && this.recordData.isProject && this.recordData.project_Parent) {
      this.setLedger();
    };
  }

  setGroup() {
    if (this.recordData && this.recordData.group_ID) {
    var group = this.groupList.filter(x => x.id == this.recordData.group_ID)[0];
    if (group) {
      this.recordData.groupText = group.name;
      this.setUi(this.recordData.groupText);
    };
  }
  }

  setLedger() {
    var ledger = this.ledgers.filter(x => x.id == this.recordData.project_Parent)[0];
    if (ledger) this.recordData.parantLedgerText = ledger.name;
  }

  listSalesPerson(): void {
    var fdata = { table: 18 };
    this.commonService.dropdown(fdata)
      .subscribe(
        data => {
          this.salesPersonList = data;

          if (this.salesPersonList.length && this.recordData && this.recordData.assignedUserID) this.setSalesPerson();
        }
      )
  }

  setSalesPerson() {
    var sp = this.salesPersonList.filter(x => x.id == this.recordData.assignedUserID)[0];
    if (sp) this.recordData.salesPerson = sp.name;
  }

  setUi(text: string) {
    if (appCommon.VerifyGroup(['Sundry Creditors'], text, this.groupList)) {
      this.billWise = true;
      this.isBank = false;
      this.isSundryDebtorChild = false;
      this.isSundryCreditorChild = true;
    }
    else if (appCommon.VerifyGroup(['Sundry Debtors'], text, this.groupList)) {
      this.billWise = true;
      this.isSundryDebtorChild = true;
      this.isBank = false;
      this.isSundryCreditorChild = false;
    }
    else if (appCommon.VerifyGroup(['Bank Account', 'Bank OD Account'], text, this.groupList)) {
      this.billWise = false;
      this.isBank = true;
      this.isSundryDebtorChild = false;
      this.isSundryCreditorChild = false;
    }
    else {
      this.billWise = false;
      this.isBank = false;
      this.isSundryDebtorChild = false;
      this.isSundryCreditorChild = false;
    }
  }

  getGroupList(): void {
    var fdata = { table: 10 };
    this.commonService.dropdown(fdata)
      .subscribe(
        data => {
          this.groupList = data;

          if (this.groupList.length) this.setGroup();
        }
      )
  }
}

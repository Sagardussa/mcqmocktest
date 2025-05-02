import { Injectable } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { GroupServiceService } from './group-service.service';
import { LocalStorageServiceService } from './local-storage-service.service';
import { RecordCreationService } from './record-creation.service';
import { LedgerServiceService } from './ledger-service.service';
import { ItemServiceService } from './item-service.service';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { CurrencyService } from './currency.service';

@Injectable({
  providedIn: 'root'
})
export class MasterSyncService {

  public appCommon = appCommon;
  currentCompany: ICompanyViewModel;

  constructor(private groupServiceService: GroupServiceService,
    private ledgerServiceService: LedgerServiceService,
    private localStorageService: LocalStorageServiceService,
    private recordCreationService: RecordCreationService,
    private itemServiceService: ItemServiceService,
    private currencyService: CurrencyService,
    private companyResolver: CompanyResolver) {
    this.currentCompany = companyResolver.getCurrentCompany();
  }

  public ClearData() {

    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.GroupList);
    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.LedgerList);
    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.ItemList);
    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.CurrencyList);

    this.SyncAll();
  }

  public SyncAll() {
    this.currentCompany = this.companyResolver.getCurrentCompany();
    this.SyncGroups();
    this.SyncLedgers();
    this.SyncCurrency();
    if (this.currentCompany.businessType != 23) this.SyncItems();
  }

  public SyncGroups() {

    var grpList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.GroupList);
    var lastModifiedDate = null;

    if (grpList && grpList.length) {
      lastModifiedDate = new Date(
        Math.max(
          ...grpList.map((e: any) => {
            if (e && e.modifiedDate) {
              return new Date(e.modifiedDate);
            }

          }),
        )
      )
    }

    var fdata = {
      isSync: true,
      lastModifiedDate: lastModifiedDate
    };

    this.groupServiceService
      .Sync(fdata)
      .subscribe(
        data => {

          var lst = data.list;
          if (!fdata.lastModifiedDate) {
            if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.GroupList, lst);
          }
          else {
            var grpList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.GroupList);
            if (!grpList || !grpList.length) {
              if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.GroupList, lst);
            }
            else {
              for (var i = 0; i < lst.length; i++) {
                var ele = lst[i];
                if (ele && ele.id) {
                  var idx = grpList.findIndex((x: any) => {
                    if (x && x.id) {
                      x.id == ele.id
                    }

                  });
                  if (idx != -1) {
                    grpList[idx] = ele;
                  }
                  else {
                    grpList.push(ele);
                  }
                }
              }

              if (grpList.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.GroupList, grpList);
            }
          }

          this.recordCreationService.announceGroupSyncEventChange({});
        },
        error => {
        });
  }

  public SyncLedgers() {

    var ldrList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.LedgerList);
    var lastModifiedDate = null;

    if (ldrList.length) {
      lastModifiedDate = new Date(
        Math.max(
          ...ldrList.map((e: any) => {
            return new Date(e.modified_Date);
          }),
        )
      )
    }

    var fdata = {
      isSync: true,
      lastModifiedDate: lastModifiedDate
    };

    this.ledgerServiceService
      .Sync(fdata)
      .subscribe(
        data => {

          var lst = data.list;
          if (!fdata.lastModifiedDate) {
            if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.LedgerList, lst);
          }
          else {
            var lrdList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.LedgerList);
            if (!lrdList.length) {
              if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.LedgerList, lst);
            }
            else {
              for (var i = 0; i < lst.length; i++) {
                var ele = lst[i];

                var idx = lrdList.findIndex((x: any) => x.id == ele.id);
                if (idx != -1) {
                  lrdList[idx] = ele;
                }
                else {
                  lrdList.push(ele);
                }
              }

              if (lrdList.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.LedgerList, lrdList);
            }
          }

          this.recordCreationService.announceLedgerSyncEventChange({});
        },
        error => {
        });
  }

  public SyncItems() {

    var itemList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.ItemList);
    var lastModifiedDate = null;

    if (itemList.length) {
      lastModifiedDate = new Date(
        Math.max(
          ...itemList.map((e: any) => {
            return new Date(e.md);
          }),
        )
      )
    }

    var fdata = {
      isSync: true,
      lastModifiedDate: lastModifiedDate
    };

    this.itemServiceService
      .Sync(fdata)
      .subscribe(
        data => {

          var lst = data.list;
          if (!fdata.lastModifiedDate) {
            if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.ItemList, lst);
          }
          else {
            var itmList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.ItemList);
            if (!itmList.length) {
              if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.ItemList, lst);
            }
            else {
              for (var i = 0; i < lst.length; i++) {
                var ele = lst[i];

                var idx = itmList.findIndex((x: any) => x.iid == ele.iid);
                if (idx != -1) {
                  itmList[idx] = ele;
                }
                else {
                  itmList.push(ele);
                }
              }

              if (itmList.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.ItemList, itmList);
            }
          }

          this.recordCreationService.announceItemSyncEventChange({});
        },
        error => {
        });
  }

  public SyncCurrency() {

    var recordList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.CurrencyList);
    var lastModifiedDate = null;

    if (recordList && recordList.length) {
      lastModifiedDate = new Date(
        Math.max(
          ...recordList.map((e: any) => {
            if (e && e.modifiedDate) {
              return new Date(e.modifiedDate);
            }

          }),
        )
      )
    }

    var fdata = {
      isSync: true,
      lastModifiedDate: lastModifiedDate
    };

    this.currencyService
      .Sync(fdata)
      .subscribe(
        data => {

          var lst = data.list;
          if (!fdata.lastModifiedDate) {
            if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.CurrencyList, lst);
          }
          else {
            var recordList = this.localStorageService.getItem(appCommon.LocalStorageKeyType.CurrencyList);
            if (!recordList || !recordList.length) {
              if (lst.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.CurrencyList, lst);
            }
            else {
              for (var i = 0; i < lst.length; i++) {
                var ele = lst[i];
                if (ele && ele.id) {
                  var idx = recordList.findIndex((x: any) => {
                    if (x && x.id) {
                      x.id == ele.id
                    }

                  });
                  if (idx != -1) {
                    recordList[idx] = ele;
                  }
                  else {
                    recordList.push(ele);
                  }
                }
              }

              if (recordList.length) this.localStorageService.setItem(appCommon.LocalStorageKeyType.CurrencyList, recordList);
            }
          }

          this.recordCreationService.announceCurrencySyncEventChange({});
        },
        error => {
        });
  }
}

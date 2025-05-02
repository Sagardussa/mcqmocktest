import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { IIdViewModel } from 'src/app/core/interfaces/common';
import { LedgerServiceService } from './ledger-service.service';
import { LocalStorageServiceService } from './local-storage-service.service';

@Injectable({
    providedIn: 'root'
})
export class LedgerFetchService {

    constructor(private http: HttpClient,
        private ledgerServiceService: LedgerServiceService,
        private localStorageService: LocalStorageServiceService,) { }

    Get(ledger: IIdViewModel) {
        var lst = this.localStorageService.getItem(
            appCommon.LocalStorageKeyType.LedgerList
        );

        var ledObj = null;
        if (lst.length) {
            var filteredList = lst.filter(x => x.id == ledger.id);
            if (filteredList.length) {
                ledObj = filteredList[0];
            }
        }
        return ledObj;
    }
}

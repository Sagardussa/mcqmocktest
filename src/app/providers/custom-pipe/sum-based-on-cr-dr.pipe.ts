import { Pipe, PipeTransform } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from '../services/auth-service.service';

@Pipe({
    name: 'sumCrDr'
})
export class SumBasedOnCrDr implements PipeTransform {
    public appCommon = appCommon;

    constructor(private authServiceService: AuthServiceService) { }

    transform(items: any[], attrs: string): any {

        let balcol = attrs.split(',')[0];
        let crdr = attrs.split(',')[1];
        let crdrText = '';
        if(items.length){
            crdrText = items[0].ledgerDrCr;
        }

        var total = items.reduce((a, b) => a + (b[balcol] * ((b[crdr] == b.ledgerDrCr) ? 1 : -1)), 0);

        return appCommon.FormatValueBasedOnPrecision(appCommon.Round(total, 2), this.authServiceService) + ' ' + crdrText;
    }
}
import { Pipe, PipeTransform } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from '../services/auth-service.service';

@Pipe({
  name: 'formatNumberVal'
})
export class FormatNumberValPipe implements PipeTransform {

  constructor(private authServiceService: AuthServiceService) { }

  transform(value: any, type: string, rowData: any): string {
    if (type === 'opening') {
      return this.formatValue(value, this.authServiceService) + ' ' + rowData.openingDrCr;
    } else if (type === 'pending') {
      return this.formatValue(value, this.authServiceService) + ' ' + rowData.pendingDrCr;
    } else {
      return '';
    }
  }

  private formatValue(value: number, authServiceService: any): string {
    return appCommon.FormatValueBasedOnPrecision(value, authServiceService);
  }
}

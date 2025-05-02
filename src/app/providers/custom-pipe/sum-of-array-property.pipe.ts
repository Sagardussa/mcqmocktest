import { Pipe, PipeTransform } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from '../services/auth-service.service';

@Pipe({
  name: 'sumOf'
})
export class SumOfArrayPropertyPipe implements PipeTransform {

  public appCommon = appCommon;

  constructor(private authServiceService: AuthServiceService) { }

  transform(items: any[], attrs: string): any {
    var total = items.reduce((a, b) => {
      let value = b[attrs];
      if (typeof value === 'string') {
        value = parseFloat(value.replace(/,/g, ''));
      }
      return a + value;
    }, 0);

    return appCommon.Round(total, 2);
  }
}

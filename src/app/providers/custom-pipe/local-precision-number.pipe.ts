import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'localPrecisionNumber'
})

export class LocalPrecisionNumberPipe implements PipeTransform {

  transform(value: number, precision = 2, showCurrency = true, currency = 'INR'): Observable<any> {
    return new Observable(observer => {
      const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      };

      if (showCurrency) {
        options.style = 'currency';
        options.currency = currency;
      } else {
        options.style = 'decimal';
      }

      const formattedValue = Number(value).toLocaleString('en-IN', options);
      observer.next(formattedValue);
      observer.complete();
    });
  }
}

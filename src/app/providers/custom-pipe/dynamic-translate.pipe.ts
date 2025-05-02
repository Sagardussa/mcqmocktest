import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicTranslate'
})
export class DynamicTranslatePipe implements PipeTransform {

  constructor() { }

  transform(value: any, prefix: any): string {
    return `${prefix}.${value}`;
  }
}

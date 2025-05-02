import { Component } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-date',
  template: `
    <ngb-datepicker [(ngModel)]="selectedDate" (select)="onDateSelect($event)" style class="dropdown-menu show mydatepicker"></ngb-datepicker>
  `,
  styleUrls: ['./custom-date.component.scss']
})
export class CustomDateComponent implements ICellEditorAngularComp {
  private params: any;
  public selectedDate: NgbDate;

  agInit(params: any): void {
    this.params = params;
    if (params.value) {
      const [day, month, year] = params.value.split('/').map(Number);
      this.selectedDate = new NgbDate(year, month, day);
    }
  }

  getValue(): any {
    return this.selectedDate ? `${this.selectedDate.day.toString().padStart(2, '0')}/${this.selectedDate.month.toString().padStart(2, '0')}/${this.selectedDate.year}` : null;
  }

  isPopup(): boolean {
    return true;
  }

  onDateSelect(date: NgbDate) {
    this.selectedDate = date;
    this.params.api.stopEditing();
  }
}

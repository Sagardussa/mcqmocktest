import { Component } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-custom-dropdown',
  template: `
    <div class="form-label-group">
      <select  class="form-control" [(ngModel)]="selectedOption" (change)="onOptionSelect($event)">
        <option *ngFor="let option of options" [value]="option.value">{{ option.text }}</option>
      </select>
    </div>
  `,
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements ICellEditorAngularComp {
  private params: any;
  public options: { text: string, value: any }[] = [];
  public selectedOption: any;

  agInit(params: any): void {
    this.params = params;
    this.options = params.options || [];
    this.selectedOption = params.value;
  }

  getValue(): any {
    return this.selectedOption;
  }

  isPopup(): boolean {
    return true;
  }

  onOptionSelect(event: Event): void {
    this.selectedOption = (event.target as HTMLSelectElement).value;
    this.params.api.stopEditing();
  }
}

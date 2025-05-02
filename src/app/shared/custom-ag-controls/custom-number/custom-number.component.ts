import { Component, ElementRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-number',
  template: `    
    <div class="form-label-group">
        <input #inputBox type="number" min=0 class="form-control" [(ngModel)]="numberValue" (keydown.enter)="onEnter()" (focus)="onFocus($event)"  placeholder="" />                           
   </div>
  `,
})
export class CustomNumberComponent implements ICellEditorAngularComp {
  private params: any;
  public numberValue: number;
  constructor(private elementRef: ElementRef) {}
  agInit(params: any): void {
    this.params = params;
    this.numberValue = params.value;
  }

  ngAfterViewInit(): void {
    this.focusInputBox();
  }

  getValue(): any {
    return this.numberValue;
  }

  isPopup(): boolean {
    return true;
  }

  // This method handles the 'Enter' key press event to stop editing
  onEnter() {
    this.params.api.stopEditing();
  }

  onFocus(event: any) {
    setTimeout(() => {
      event.target.select();
    });
  }

  private focusInputBox() {
    const inputBox: HTMLInputElement = this.elementRef.nativeElement.querySelector('input');
    if (inputBox) {
      inputBox.focus();
      inputBox.select();
    }
  }
}

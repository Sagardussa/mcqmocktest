import { Component, HostListener, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-text-area-editor',
  template: `<textarea [(ngModel)]="value" class="form-control" (keydown)="onKeyDown($event)"></textarea>`
})

export class TextAreaEditorComponent implements ICellEditorAngularComp {
  private params: any;
  public value: any;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
  }

  getValue(): any {
    return this.value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey && event.key === 'Enter') {
      event.stopPropagation(); // Prevent editor from closing
      const textarea = event.target as HTMLTextAreaElement;
      const { selectionStart, selectionEnd, value } = textarea;
      const newValue = `${value.substring(0, selectionStart)}\n${value.substring(selectionEnd)}`;
      this.value = newValue;
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart + 1, selectionStart + 1); // Move cursor to new line
      });
    }
  }
}
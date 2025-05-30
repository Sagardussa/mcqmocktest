import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-common-renderer',
  template: '<a class="pointer btn_danger" (click)="onClick($event)"><i class="fas fa-file-alt"></i></a>'
})
export class AgCommonRendererComponent implements AgRendererComponent {

  cellValue: string;
  private params: any;

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {

      const params = {
        event: $event,
        rowData: this.params.data
      }
      this.params.onClick(params);
    }
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}

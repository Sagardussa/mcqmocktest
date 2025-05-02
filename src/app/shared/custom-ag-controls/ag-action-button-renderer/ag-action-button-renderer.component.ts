import { Component, OnInit } from '@angular/core';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { PermissionManagerService } from '../../permission/permission-manager.service';

@Component({
  selector: 'app-ag-action-button-renderer',
  template: `
    <a *ngIf="isEditGranted" class="pointer btn_blue" (click)="onClick($event)">
      <i class="fas fas fa-pencil-alt mr-3"></i>
    </a>
    <a *ngIf="isDeleteGranted" class="text-danger pointer" (click)="onDelClick($event)">
      <i class="fas fa-trash-alt"></i>
    </a>
  `,
})
export class AgActionButtonRendererComponent implements OnInit {
  cellValue: string;
  private params: any;
  isEditGranted: boolean = true;
  isDeleteGranted: boolean = true;

  constructor(private permissionManagerService: PermissionManagerService) { }

  ngOnInit(): void { }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.params = params;
    // Check permissions
    if(this.params && this.params.permissions){
    this.isEditGranted = this.permissionManagerService.isGranted(this.params.permissions.edit);
    this.isDeleteGranted = this.permissionManagerService.isGranted(this.params.permissions.delete);
    }
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

  onDelClick($event: any) {
    if (this.params.onDelClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.data
      }
      this.params.onDelClick(params);
    }
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }
}

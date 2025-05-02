import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { IAfterGuiAttachedParams, ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'checkbox-cell',
  template: `<input type="checkbox" class="m_20" [checked]="params.value" (change)="onChange($event)">`,
  styleUrls: ['./checkbox-cell.component.scss']
})
export class CheckboxCellComponent implements AfterViewInit, ICellRendererAngularComp {

  @ViewChild('.checkbox') checkbox: ElementRef;

  public params: ICellRendererParams;

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    throw new Error("Method not implemented.");
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error("Method not implemented.");
  }

  ngAfterViewInit(): void {

  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public onChange(event) {
    this.params.data[this.params.colDef.field] = event.currentTarget.checked;
  }
}

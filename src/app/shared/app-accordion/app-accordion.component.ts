import { Component, EventEmitter, Input, Output } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';

@Component({
  selector: 'app-accordion',
  template: `
  <div class="v-accordion">
    <div class="v-accordion-item" [class.active]="item.isActive">
        <div class="v-accordion-item-header" (click)="toggleItem(item)">
            <div class="row pointer">
                <div class="col-sm-12 col-md-4 text-md-start text-left">
                    <span class="text-muted mt-1 fw-bold fs-7">{{item.name}}</span>
                </div>
                <div class="col-sm-12 col-md-2 text-md-end text-right">
                    <span class="text-muted mt-1 fw-bold fs-7">{{
                        appCommon.GetAbsoluteValue(item.OPENINGBAL) |localPrecisionNumber :
                        precision | async}} {{getCrOrDr(item.OPENINGBAL)}}</span>
                </div>
                <div class="col-sm-12 col-md-2 text-md-end text-right">
                    <span class="text-muted mt-1 fw-bold fs-7">{{appCommon.GetAbsoluteValue(item.DEBIT)
                        |localPrecisionNumber : precision | async}}</span>
                </div>
                <div class="col-sm-12 col-md-2 text-md-end text-right">
                    <span class="text-muted mt-1 fw-bold fs-7">{{appCommon.GetAbsoluteValue(item.CREDIT)
                        |localPrecisionNumber : precision | async}}</span>
                </div>
                <div class="col-sm-12 col-md-2 text-md-end text-right">
                    <span class="text-muted mt-1 fw-bold fs-7">{{appCommon.GetAbsoluteValue(item.OPENINGBAL
                        + item.DEBIT + item.CREDIT) |localPrecisionNumber : precision | async}} {{getCrOrDr(item.OPENINGBAL
                          + item.DEBIT + item.CREDIT)}}</span>
                </div>
            </div>
        </div>
        <div class="alert alert-primary mt-2" role="alert" *ngIf="item.isActive && isDataLoading"><strong>Loading...</strong><div class="spinner-border text-success" role="status" style="position:absolute; top: 6px; right:10px;"></div></div>
        <div class="v-accordion-item-content" [hidden]="!item.isActive">
       
            <div class="card" *ngFor="let item of item.childNodeData; let i = index;">
                <app-accordion [item]="item" (itemSelected)="selectItemClick($event)" [style.background-color]="parentColor"></app-accordion>
            </div>            
        </div>
    </div>
</div>
  `,
  styles: [`
    .v-accordion-item-header {
      cursor: pointer !important;
      padding: 0.5rem;
      border: 1px solid #eff2f7;
      //background-color: #eff2f7;
    }

    .v-accordion-item-content {
      cursor: pointer !important;
      padding: 0.5rem;
      //background-color: white;
    }
  `]
})
export class AppAccordionComponent {

  @Input() item: any;
  @Input() isDataLoading: any;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  precision: number = 2;
  public appCommon = appCommon;

  parentColor: string;

  constructor(private authServiceService: AuthServiceService) {
    var token = this.authServiceService.getTokenInfo();
    if (token.company) {
      this.precision = token.company.precision;
    }
  }

  ngOnInit() {
    this.parentColor = this.getColor(this.item);
  }

  toggleItem(item: any) {
    item.isActive = !item.isActive;
    this.itemSelected.emit(item);
  }

  selectItemClick(item: any) {
    this.itemSelected.emit(item);
  }

  getColor(item: any): string {
    const hash = this.hashString(item.name);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 90%)`;
  }

  private hashString(str: string): number {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  getCrOrDr(value: number): string {
    return value < 0 ? 'CR' : 'DR';
  }
}

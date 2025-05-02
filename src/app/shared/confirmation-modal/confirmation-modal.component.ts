import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthServiceService } from "src/app/providers/services/auth-service.service";
import { InvoiceFieldVisibilityService } from "src/app/providers/services/invoice-field-visibility.service";

@Component({
  selector: "app-confirmation-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
    </div>

    <div class="modal-body">
      <!-- <form [formGroup]="form" *ngIf="form">
        <div
          class="col-md-8"
          *ngIf="
            setupInfoData?.billingPlaces?.length > 1 &&
            comapnyInfo?.businessType == 23 &&
            !fdata?.id &&
            setupInfoData?.invTypeId == 7 &&
            fieldVisibilityService.isFieldVisible(
              setupInfoData?.invTypeId,
              'spCode'
            )
          "
        >
          <h5>
            Are you sure you want to continue
            {{
              fieldVisibilityService.getFieldLabel(
                setupInfoData?.invTypeId,
                "spCode"
              )
            }}?
          </h5>
        </div>
        <div class="form-group form-label-group">
          <select
            name="spCode"
            class="form-control"
            (change)="onSPChange()"
            formControlName="spCode"
            required
          >
            <option value="null">--select value--</option>
            <option
              *ngFor="let item of setupInfoData?.billingPlaces"
              [value]="item?.spId"
            >
              {{ item?.name }}
            </option>
          </select>
          <label class="col-md-12">{{
            fieldVisibilityService.getFieldLabel(
              setupInfoData?.invTypeId,
              "spCode"
            )
          }}</label>
        </div>
      </form> -->
      <h5>{{ message }}</h5>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-sm btn-danger"
        (click)="activeModal.dismiss('cancel')"
      >
        <i class="ri-close-line align-middle mr-2"></i>Cancel
      </button>
      <button
        type="button"
        class="btn btn-sm btn-success"
        (click)="activeModal.close(true)"
      >
        <i class="ri-eraser-line align-middle mr-2"></i>Yes
      </button>
    </div>
  `,
})
export class ConfirmationModalComponent implements OnInit {
  @Input() title: string;
  @Input() form: any;
  @Input() message: string;
  // @Input() setupInfoData: any;
  // @Input() userData: any;
  // @Input() fdata: any;
  // comapnyInfo: ICompanyViewModel;

  constructor(
    public activeModal: NgbActiveModal,
    public fieldVisibilityService: InvoiceFieldVisibilityService,
    private authServiceService: AuthServiceService
  ) {
    // this.comapnyInfo = this.authServiceService.getTokenInfo()?.company;
  }

  ngOnInit(): void {
    // this.form?.get("spCode")?.valueChanges?.subscribe((value) => {
    //   if (value) this.form.patchValue({ spCode: value });
    // });
  }

  // onSPChange() {
  //   var rec = this.setupInfoData?.stockPlaces.find(
  //     (x) => x.spId == this.form.value?.spCode
  //   );
  //   if (rec)
  //     this.form.patchValue({
  //       useInCompany: rec?.useInCompany,
  //       inventorySPCode: this.userData?.spCode
  //         ? this.userData?.spCode
  //         : rec?.spId,
  //     });
  // }
}

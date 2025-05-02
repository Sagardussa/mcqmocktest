import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-common-modal',
  template: `
<div class="modal-header" [ngClass]="{'alert-success': isConfirm, 'bgdanger': !isConfirm}">
    <h5 class="modal-title mt-0">{{title}}</h5>
    <div class="row">        
        <button type="button" class="btn btn-light mr-2" aria-label="Close" (click)="activeModal.dismiss()">
            <i class="fa fa-times" aria-hidden="true"></i>
        </button>
    </div>
</div>
  <div class="modal-body" *ngIf="message">
    <h5 class="text-center">{{ message }}</h5> 
  </div>
  <div class="modal-footer" *ngIf="isConfirm && !isModalAutoTimeOut">
    <button type="button" class="btn btn-warning btn-sm" (click)="activeModal.dismiss('cancel')">Cancel</button>
    <button type="button" class="btn btn-success btn-sm" (click)="activeModal.close(true)">Yes</button>
  </div>
  `,
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() isConfirm: boolean = false;
  @Input() isModalAutoTimeOut: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.title = this.title ? this.title : (this.isConfirm ? "Confirm" : "Alert");
    // Automatically close the modal after 5 seconds
    if (this.isModalAutoTimeOut) {
      setTimeout(() => {
        this.activeModal.close('timeout');
      }, 5000); // Adjust time here (5000 ms = 5 seconds)
    }
  }
}

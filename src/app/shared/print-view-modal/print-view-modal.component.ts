import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-print-view-modal',
  templateUrl: './print-view-modal.component.html',
  styleUrls: ['./print-view-modal.component.scss']
})
export class PrintViewModalComponent implements OnInit {

  @Input() public data;
  pdfUrl: any = null
  billNo : any = null;
  ledger : any = null;
  type : any = null;

  constructor(private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.billNo = this.data.billNo;
    this.ledger = this.data.ledger;
    this.type = this.data.type;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.blobUrl);
  }

  passBack() {
    this.activeModal.close();
  }
}

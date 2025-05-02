import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ag-image-cell-renderer',
  styleUrls: ['./ag-image-cell-renderer.component.scss'],
  template: `<img border="0" alt="No Image" class="img_b pointer" width="50" height="50" (click)="openPreview(smallDataModal)" [src]="params ? params : 'assets/images/noimg.png'">
  <ng-template #smallDataModal let-modal>
      <div class="modal-header">
        <h5 class="modal-title mt-0">Image Preview</h5>
        <button type="button" class="close" (click)="modal.dismiss('Cross click')" aria-hidden="true">×</button>
    </div>
    <div class="modal-body">
        <img [src]="params" class="preview-image" />
    </div>
    <!-- </div> -->
</ng-template>"`
})
export class AgImageCellRendererComponent implements OnInit {
  params: any;
  agInit(params: any) {
    this.params = params.data.filename ? (environment.apiUrl + '/' + params.data.filename) : "";
  }
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openPreview(smallDataModal: any) {
    if (this.params) this.modalService.open(smallDataModal);
  }
}

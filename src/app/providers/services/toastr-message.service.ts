import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrMessageService {
  constructor(
    private toastr: ToastrService
  ) { }

  showSuccess(message: string | undefined, title: string | undefined) {
    this.toastr.success(message, title, this.getToastConfig())
  }

  showError(message: string | undefined, title: string | undefined) {
    this.toastr.error(message, title)
  }

  showInfo(message: string | undefined, title: string | undefined) {
    this.toastr.info(message, title)
  }

  showWarning(message: string | undefined, title: string | undefined) {
    this.toastr.warning(message, title)
  }

  private getToastConfig(): Partial<IndividualConfig> {
    return {
      timeOut: 1000,
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true
    };
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginModelComponent } from 'src/app/account/auth/login-model/login-model.component';
import { appCommon } from 'src/app/common/_appCommon';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { ToastrMessageService } from '../services/toastr-message.service';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public appCommon = appCommon;
  constructor(private modalService: NgbModal,
    private router: Router,
    private authServiceService: AuthServiceService,
    private toastrMessageService: ToastrMessageService,
    public loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, newRequest: HttpHandler):
    Observable<HttpEvent<any>> {

    return newRequest.handle(request).pipe(catchError(err => {
      this.loaderService.hideLoader();
      if (err.status === 400) {
        if (err.error == 'Access Denied') {
          this.router.navigate(['/']);
        }
        //this.toastrMessageService.showInfo(err.error.message, "Info");
        if (err.error.includes("Invalid Session or Session Expired") || (err.error.message && err.error.message.includes("Invalid Session or Session Expired"))) {
          if (appCommon.EnUrlToRedirectOnLoginPage.some(e => e === this.router.routerState.snapshot.url)) {
            this.authServiceService.logout();
          }
          else if ('/account/login' === this.router.routerState.snapshot.url) {
            //do nothing
          }
          else {
            this.openModal();
          }
        } else {
          this.toastrMessageService.showInfo(err.error.message ? err.error.message : err.error, "Info");
        }
      }

      if (err.status === 500) {
        if (err.error.includes("Invalid Session or Session Expired") || (err.error.message && err.error.message.includes("Invalid Session or Session Expired"))) {
          if (appCommon.EnUrlToRedirectOnLoginPage.some(e => e === this.router.routerState.snapshot.url)) {
            this.authServiceService.logout();
          }
          else if ('/account/login' === this.router.routerState.snapshot.url) {
            //do nothing
          }
          else {
            this.openModal();
          }
        }
        this.toastrMessageService.showError(err.error.message ? err.error.message : err.error, "Error");
      }

      return throwError(err.error);
    }));
  }

  openModal() {
    //ModalComponent is component name where modal is declare
    const modalRef = this.modalService.open(LoginModelComponent);
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }
}

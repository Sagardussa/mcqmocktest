import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthServiceService } from "../services/auth-service.service";
import { ToastrMessageService } from "../services/toastr-message.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthServiceService,
    private toastrMessageService: ToastrMessageService,
    //private dialog: MatDialog,
  ) { }

  intercept(request: HttpRequest<any>, newRequest: HttpHandler):
    Observable<HttpEvent<any>> {

    return newRequest.handle(request).pipe(catchError(err => {
      if (err.status === 400) {
        this.toastrMessageService.showInfo(err.error.message, "Info");
        if (err.error.message.includes("Invalid Session or Session Expired")) {
          alert('Invalid Session or Session Expired');
          //this.openLoginPopup();
        }
      }
      return throwError(err.error);
    }));
  }

  // openLoginPopup(): void {
  //   if (this.dialog.getDialogById("login-pop-up")) return;
  //   const dialogRef = this.dialog.open(LoginModalComponent, {
  //     id: 'login-pop-up',
  //     width: "350px",
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe(res => {
  //   })
  // }
}
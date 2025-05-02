import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable()
export class httpInterceptor implements HttpInterceptor {

  constructor(private authServiceService: AuthServiceService) { }

  intercept(request: HttpRequest<any>, newRequest: HttpHandler):
    Observable<HttpEvent<any>> {

    let cloneReq = request;
    let cloneBody = request.body;
    var token = this.authServiceService.getTokenInfo();

    if (token.user && cloneBody) {
      cloneBody.sessionId = token.user.currentSessionId
    }

    if (token.user && cloneBody instanceof FormData) {
      cloneBody.append('sessionId', token.user.currentSessionId);
      cloneReq = request.clone({ body: cloneBody });
    }

    cloneReq = request.clone();
    return newRequest.handle(cloneReq);
  }

}

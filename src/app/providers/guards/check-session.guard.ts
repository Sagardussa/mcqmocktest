import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CheckSessionGuard implements CanActivate {

  constructor(private authServiceService: AuthServiceService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      var token = this.authServiceService.getTokenInfo();
      var fdata = {
        sessionId: token.user.currentSessionId
      };

      this.authServiceService.checkSession(fdata).subscribe(data => {
        resolve(true);
      }, error => {
        reject(true);
      });
    });
  }

}
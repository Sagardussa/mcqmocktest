import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { SurveyComponent } from 'src/app/pages/masters/survey/survey/survey.component';
import { SurveyService } from '../services/survey.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyDetailsResolver implements Resolve<SurveyComponent> {
  constructor(private surveyService: SurveyService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.surveyService.Get({ surveyNo: route.params.id });
  }
}

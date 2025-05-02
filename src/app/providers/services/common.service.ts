import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private authServiceService: AuthServiceService) { }

  dropdown(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Common/Dropdown', fdata)
  }

  itemCategoryList(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Common/Distinct', fdata)
  }

  getSurveyFormData(): Observable<any> {
    return this.http.get<any>('assets/survey/erp-ynk-survey.json');
  }
}

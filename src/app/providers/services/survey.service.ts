import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  constructor(private http: HttpClient) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Survey/Search', fdata)
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Survey/Create', fdata)
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Survey/Delete',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Survey/GetBySurveyNo',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Survey/Update',fdata)
  }

  FileUpload(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Survey/UploadFile',fdata)
  }

  FileDelete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/Survey/DeleteFile',fdata)
  }
}
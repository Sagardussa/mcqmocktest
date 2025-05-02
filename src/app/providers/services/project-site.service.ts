import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectSiteService {

  constructor(private http: HttpClient) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/ProjectSite/Search', fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/ProjectSite/Export', fdata, header);
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/ProjectSite/Create', fdata)
  }

  Delete(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ProjectSite/Delete',fdata)
  }

  Get(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ProjectSite/GetById',fdata)
  }

  Update(fdata:any){
    return this.http.post<any>(environment.apiUrl + '/api/ProjectSite/Update',fdata)
  }
}

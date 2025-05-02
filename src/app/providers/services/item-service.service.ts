import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IItem } from 'src/app/core/interfaces/item';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ItemServiceService {

  constructor(private http: HttpClient, private authServiceService: AuthServiceService) { }

  Search(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/Search', fdata)
  }

  UploadSearch(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/Upload/Search', fdata)
  }

  Export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.http.post<any>(environment.apiUrl + '/api/Item/Export', fdata, header);
  }
  Delete(fdata: any) {
    if (fdata) {
      var token = this.authServiceService.getTokenInfo();
      fdata.sessionId = token.user.currentSessionId;
    }
    return this.http.post<any>(environment.apiUrl + '/api/item/Delete', fdata)
  }

  Create(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/Create', fdata)
  }

  Get(fdata: any) {
    return this.http.post<IItem>(environment.apiUrl + '/api/item/GetById', fdata)
  }

  Update(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/Update', fdata)
  }

  UpdateBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/UpdateBOM', fdata)
  }

  SearchBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/SearchBOM', fdata)
  }

  GetBOM(fdata: any) {
    return this.http.post<IItem>(environment.apiUrl + '/api/item/GetBOM', fdata)
  }

  Sync(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/Sync', fdata)
  }

  UploadDocument(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/UploadDocument', fdata)
  }

  DeleteDocument(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/DeleteDocument', fdata)
  }

  UpdateDocumentStatus(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/UpdateDocumentStatus', fdata)
  }

  DeleteBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/DeleteBOM', fdata)
  }

  CreateBOM(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/CreateBOM', fdata)
  }

  UpdateQC(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/UpdateQC', fdata)
  }

  UpdateItemCodes(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/UpdateItemCodes', fdata)
  }

  UpdateItemSubstitutes(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/UpdateItemSubstitutes', fdata)
  }

  Upload(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/Upload', fdata)
  }

  getAutoCompleteItems(searchText: string, sessionId?: string): Observable<any> {
    let params = new HttpParams().set('searchText', searchText);
    var token = this.authServiceService.getTokenInfo();
    params = params.set('sessionId', token.user.currentSessionId);
    return this.http.get<any>(environment.apiUrl + '/api/Item/Auto-Complete', { params });
  }

  MergeItem(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Item/MergeItem', fdata)
  }

  GetMany(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/item/GetMany', fdata)
  }
}

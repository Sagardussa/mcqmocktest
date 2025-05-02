import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IIdViewModel } from 'src/app/core/interfaces/common';
import { environment } from 'src/environments/environment';
import { ItemServiceService } from './item-service.service';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ItemFetchService {

  constructor(private http: HttpClient, private itemServiceService: ItemServiceService, private authServiceService: AuthServiceService) { }

  async Get(item: IIdViewModel) {
    var itemData = await this.itemServiceService.Get(item).toPromise();
    return itemData;
  }

  getAutoCompleteItems(searchText: string, sessionId?: string): Observable<any> {
    let params = new HttpParams().set('searchText', searchText);
    var token = this.authServiceService.getTokenInfo();
    params = params.set('sessionId', token.user.currentSessionId);
    return this.http.get<any>(environment.apiUrl + '/api/Item/Auto-Complete', { params });
  }

  async GetMany(item: any) {
    var itemData = await this.itemServiceService.GetMany(item).toPromise();
    return itemData;
  }
}

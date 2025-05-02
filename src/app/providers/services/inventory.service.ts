import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private http: HttpClient
  ) { }

  CheckItemsStock(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Inventory/CheckItemsStock', fdata)
  }
  
  CheckItemsPending(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Inventory/CheckPendingItems', fdata)
  }

  CheckItemsPendingDetails(fdata: any) {
    return this.http.post<any>(environment.apiUrl + '/api/Inventory/CheckPendingItemsDetails', fdata)
  }
}
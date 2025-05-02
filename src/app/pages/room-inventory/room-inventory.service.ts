import {Injectable} from "@angular/core";
import {BaseApiService} from "../../utils/services/base-api.service";
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../app-setting";
import {Observable} from "rxjs";

export interface RoomInventory {
  id?: number
  roomId?: number
  itemId?: number
  memberId?: number
  qty?: number
  roomNumber?: string
  itemName?: string
  memberName?: string
}

@Injectable({
  providedIn: 'root'
})

export class RoomInventoryService extends BaseApiService<RoomInventory> {
  constructor(http: HttpClient, settingService: SettingService) {
    super("roominventory", http, settingService);
  }

  public addMulti(model: RoomInventory[]): Observable<RoomInventory[]> {
      return this.httpClient.post<RoomInventory[]>(`${this.getUrl()}/multi`, model);
  }
}
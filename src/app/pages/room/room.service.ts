import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";

export interface Room {
  id?: number;
  roomNumber?: string;
  description?: string;
  roomTypeId?: number;
  roomTypeName?: string;
  floorId?: number;
  floorName?: string;
  tagIds?: number[];
  tagNames?: string[];
  status?: number;
  statusNameEn?: string;
  statusNameKh?: string;
  houseKeepingStatus?: number;
  houseKeepingStatusNameEn?: string;
  houseKeepingStatusNameKh?: string;
  startNumber?: number;
  endNumber?: number;
}

export interface RoomAdvancedFilter {
  roomTypeId: number;
  roomStatusId: number;
  tagIds: number[];
  floorId: number;
  houseKeepingStatusId: number;
  isAdvancedFilter: boolean;
}
@Injectable({
  providedIn: "root",
})
export class RoomService extends BaseApiService<Room> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("room", http, settingService);
  }

  addBatchRoom(room: Room) {
    return this.http.post(`${this.getUrl()}/add-batch`, room);
  }
}

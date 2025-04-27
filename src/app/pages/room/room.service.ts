import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";

export interface Room {
  id?: number;
  roomNumber?: string;
  note?: string;
  roomTypeId?: number;
  roomTypeName?: string;
  floorId?: number;
  floorName?: string;
  tagIds?: number[];
  tagNames?: string[];
  status?: number;
  statusName?: string
  statusNameEn?: string
}

export interface RoomAdvancedFilter {
  roomTypeId: number;
  roomStatusId: number;
  tagIds: number[];
  floorId: number;
  isAdvancedFilter: boolean;
}
@Injectable({
  providedIn: "root",
})
export class RoomService extends BaseApiService<Room> {
  constructor(http: HttpClient, settingService: SettingService) {
    super("room", http, settingService);
  }
}

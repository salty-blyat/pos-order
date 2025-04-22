import { Injectable } from "@angular/core";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { HttpClient } from "@angular/common/http";


export interface Amenity {
  id?: number;
  name?: string;
  availability?: boolean;
  note?: string;
}

export interface AmenityGroup {
  id?: number;
  name?: string;
  amenities?: Amenity[];
}

export interface RoomType {
  id?: number;
  name?: string;
  roomClass?: number;
  roomClassNameKh?: string;
  roomClassNameEn?: string;
  baseAdults?: number;
  baseChildren?: number;
  maxAdults?: number;
  maxChildren?: number;
  maxOccupancy?: number;
  basePrice?: number;
  basePriceAdult?: number;
  basePriceChild?: number;
  size?: number;
  description?: string;
  amenityGroup?: AmenityGroup[];
}

@Injectable({
  providedIn: "root",
})
export class RoomTypeService extends BaseApiService<RoomType> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super("roomtype", http, settingService);
  }
}

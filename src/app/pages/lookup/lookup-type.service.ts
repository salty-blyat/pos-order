import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';

export enum LOOKUP_TYPE {
  GenderId = 1,
  Nationality = 2,
  Status = 36001,
  HouseKeepingStatus = 36002,
  Amenities = 36003,
  Position = 36004,
  RoomClass = 36005,
  HkActivityType = 36006,
}
export enum HkActivityType
{
  MarkCleaning = 1,
  MarkClean = 2,
  MarkInspect = 3,
  MarkDirty = 4,
  MarkOOO = 5,
  MarkOOS = 6,
  FixOOO = 7,
  FixOOS = 8,
  MarkStatus = 9
}
export enum RoomBlockStatus
{
  Block = 1,
  OOO = 3,
}

export enum StaffPosition {
  Housekeeper =1,
}

export enum RoomClass {
  Budget = 325,
  Classic = 326,
  Deluxe = 328,
  Double = 1,
  Premium = 327
}

export enum Status {
  Vacant = 1,
  Occupied = 2,
  Reserved = 3,
  OutOfOrder = 4,
  OutOfService = 5,
  Blocked = 6
}

export enum HousekeepingStatus {
  Clean = 1,
  Dirty = 2,
  Cleaning = 3,
  Inspected = 4
}

export enum AmenityType {
  Hotel = 1,
  Room = 2,
  FrontDesk = 3
}




export interface LookupType {
  id?: number;
  name?: string;
  nameEn?: string;
}
@Injectable({
  providedIn: 'root',
})
export class LookupTypeService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super('lookuptype', http, settingService);
  }
}

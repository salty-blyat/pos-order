import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../utils/services/base-api.service';
import { SettingService } from '../../app-setting';

export enum LOOKUP_TYPE {
  SexId = 1,
  Nationality = 2,
  Status = 36001,
  ChargeType = 36002,
}

export enum Status {
  Vacant = 1,
  Occupied = 2,
  Reserved = 3,
  OutOfOrder = 4,
  OutOfService = 5,
  Blocked = 6
}

export enum ChargeType {
  Meter = 1,
  Fixed = 2,
  GrossArea = 3,
  NetArea = 4,
}

export enum RoomChargeStatus
{
  Active = 1,
  Inactive = 2,
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
  constructor(http: HttpClient, settingService: SettingService) {
    super('lookuptype', http, settingService);
  }
}

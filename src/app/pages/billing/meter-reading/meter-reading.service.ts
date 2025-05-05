import {BaseApiService} from "../../../utils/services/base-api.service";
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../../app-setting";
import {Injectable} from "@angular/core";

export interface MeterReading {
  id?: number
  meterSerial?: string
  roomId?: number
  chargeId?: number
  startDate?: string
  endDate?: string
  previousReading?: number
  currentReading?: number
  statusId?: number
  totalUsage?: number
  note?: string,
  roomNumber?: string
  chargeName?: string
  unitName?: string
}

@Injectable({
  providedIn: 'root',
})

export class MeterReadingService extends BaseApiService<MeterReading>{
  constructor(http: HttpClient, settingService: SettingService) {
    super("meterreading", http, settingService);
  }
}
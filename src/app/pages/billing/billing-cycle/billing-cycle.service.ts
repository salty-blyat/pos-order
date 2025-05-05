import {Injectable} from "@angular/core";
import {BaseApiService} from "../../../utils/services/base-api.service";
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../../app-setting";

export interface BillingCycle {
  id?: number
  name?: string
  totalRoom?: number
  totalDay?: number
  startDate?: string
  endDate?: string
  statusId?: number
  note?: string
}

@Injectable({
  providedIn: 'root',
})

export class BillingCycleService extends BaseApiService<BillingCycle>{
  constructor(http: HttpClient, settingService: SettingService) {
    super("billingcycle", http, settingService);
  }
}
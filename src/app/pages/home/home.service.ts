import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseApiService} from "../../utils/services/base-api.service";
import {SettingService} from "../../app-setting";

export interface Summary {
  totalCustomer?:number
  totalComplaint?: number,
  totalProgressComplaint?: number,
  newComplaint?: number,
  totalClosedComplaint?:number,
  totalCannotSolvedComplaint?: number,
  newClosedCompaint?: number,
}


@Injectable({providedIn: 'root'})

export class HomeService extends BaseApiService<any> {
  constructor(private http: HttpClient, settingService: SettingService) {
    super('home/dashboard', http, settingService);
  }

}

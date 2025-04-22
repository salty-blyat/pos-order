import {BaseApiService} from "../../utils/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SettingService} from "../../app-setting";

export interface AutoNumber{
  id?: number,
  name?: string,
  format?:string,
  note?:string,
}
@Injectable({
  providedIn: 'root'
})
export class AutoNumberService extends BaseApiService<any>{
  constructor(private http: HttpClient,settingService: SettingService) {
    super('autonumber', http, settingService);
  }
}

import {BaseApiService} from "../../utils/services/base-api.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SettingService} from "../../app-setting";

export interface RoomMember {
  id?: number
  roomId?: number
  memberId?: number
  joinedDate?: string
  leftDate?: string
  note?: string
  roomNumber?: string
  memberName?: string
}


@Injectable({
  providedIn: 'root'
})
export class RoomMemberService extends BaseApiService<RoomMember>{
  constructor(http: HttpClient, settingService: SettingService) {
    super("roommember", http, settingService);
  }
}
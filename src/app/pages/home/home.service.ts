import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BaseApiService } from "../../utils/services/base-api.service";
import { SettingService } from "../../app-setting";
import { Observable } from "rxjs";

export interface Summary {
  // dont use but dont delete also
  totalCustomer?: number;
  totalComplaint?: number;
  totalProgressComplaint?: number;
  newComplaint?: number;
  totalClosedComplaint?: number;
  totalCannotSolvedComplaint?: number;
  newClosedCompaint?: number;
}
export interface Dashboard {
  id?: number; // put to silence shareddomain error in baselist
  summary?: DashboardSummary;
  membersByClass?: MembersByClass[];
  topAgents?: TopAgent[];
  recentTransactions?: RecentTransaction[];
  topPoints?: TopPoint[];
  topBalances?: TopBalance[];
}

export interface DashboardSummary {
  totalUsers?: number;
  agents?: number;
}
export interface MembersByClass {
  id?: number;
  name?: string;
  code?: string;
  count?: number;
}
export interface TopAgent {
  id?: number;
  name?: string;
  code?: string;
  value?: number;
}

export interface RecentTransaction {
  id?: string;
  date?: string;
  type?: string;
  location?: string;
  amount?: number;
  memberCode?: string;
  memberName?: string;
  accountType?: number;
}

export interface TopPoint {
  id?: number;
  name?: string;
  code?: string;
  points?: number;
}
export interface TopBalance {
  id?: number;
  name?: string;
  code?: string;
  balance?: number;
}

export interface DateRange {
  fromDate?: string | Date;
  toDate?: string | Date;
}
@Injectable({ providedIn: "root" })
export class HomeService extends BaseApiService<any> {
  constructor(public http: HttpClient, settingService: SettingService) {
    super("dashboard", http, settingService);
  }

  dashboard(date: DateRange): Observable<Dashboard> {
    return this.http.post<Dashboard>(this.getUrl(),date  );
  } 
}

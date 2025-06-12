import { Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { BaseUiService } from "../../utils/services/base-ui.service";
import { Dashboard, DateRange } from "./home.service";
import { Observable } from "rxjs";
import { SearchResult } from "../../utils/services/base-api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class HomeUiService extends BaseUiService {
  constructor(modalService: NzModalService) {
    super(modalService, "", "", "450px", "450px", "450px", "450px");
  }
  
}

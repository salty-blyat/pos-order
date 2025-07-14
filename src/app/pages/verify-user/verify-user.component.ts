import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Guest, RequestService } from "../request/request.service";
import { NotificationService } from "../service/notification.service";
import { App, AuthService, Tenant } from "../../helpers/auth.service";
import { APP_STORAGE_KEY } from "../../const";
@Component({
  selector: "app-verify-user",
  template: `
    <div class="verify-container" nz-flex nzJustify="center" nzAlign="center">
      <div>
        <h1 class="welcome-banner">
          {{ "Welcome to" | translate }} {{ CompanyName }}
        </h1>

        <form
          class="verify-form"
          nz-form
          [formGroup]="frm"
          [style.height.%]="100"
        >
          @if(isLoading){
          <div class="verify-card" style="position: relative;height: 370px; ">
            <app-loading></app-loading>
          </div>
          } @else if(!isLoading && !phoneNumber){
          <div class="verify-card" style="margin:auto;padding:64px 0px;">
            <app-no-result-found></app-no-result-found>
          </div>
          }@else if (!isLoading && phoneNumber){
          <div class="verify-card" style="line-height: 1;">
            <h2>{{ "Guest Verification" | translate }}</h2>
            <span>{{
              "Please enter the last 3 digit of your phone number to proceed"
                | translate
            }}</span>
            <h3 style="text-align: center; margin-top:24px;">
              {{ "Your Phone Number" | translate }}
            </h3>
            <h1 style="text-align: center;">{{ phoneNumber }}</h1>
            <div nz-flex nzJustify="center">
              <nz-form-item>
                <nz-form-control>
                  <input
                    type="text"
                    nz-input
                    formControlName="lastThreeDigits"
                    type="tel"
                    placeholder="Enter last 3 digits"
                    style="text-align: center;"
                  />
                </nz-form-control>
              </nz-form-item>
            </div>
            <button
              [disabled]="!frm.valid"
              [nzLoading]="isLoading"
              nz-button
              style="width: 100%;"
              nzType="primary"
              (click)="onSubmit($event)"
            >
              {{ "Confirm" | translate }}
            </button>
          </div>
          }
        </form>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .verify-container {
        height: 70vh;
        margin: auto;
      }
      .verify-card {
        background-color: white;
        border-radius: 8px;
        width: 370px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .verify-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .welcome-banner {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class VerifyUserComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: RequestService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionStorageService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }
  frm!: FormGroup;
  isLoading = false;
  guestPhone: string = "";
  CompanyName = '';
  CompanyLogo = "";
  CompanyNameEn = "";

  routeRefresh!: Subscription;

  ngOnInit(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.initControl();

    this.routeRefresh = this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const uuid = params.get("uuid");
        const tenantCode = params.get("tenantCode");

        this.setAppInfo(tenantCode!);
        this.service.getGuest(uuid!).subscribe((res: Guest) => {
          const stayId = res.stayId;
          const roomId = res.roomId;
          const roomNo = res.roomNo;
          const guestId = res.guestId;
          const guestName = res.guestName;
          const guestPhone = res.guestPhone;
          this.guestPhone = guestPhone ?? "";

          this.sessionService.setValue({ key: "guestId", value: guestId });
          this.sessionService.setValue({ key: "roomId", value: roomId });
          this.sessionService.setValue({ key: "stayId", value: stayId });
          this.sessionService.setValue({ key: "roomNo", value: roomNo });
          this.sessionService.setValue({
            key: "guestName",
            value: guestName,
          });
          this.sessionService.setValue({
            key: "guestPhone",
            value: guestPhone,
          });
        });

        this.service.getCompanyInfo(tenantCode!).subscribe({
          next: (res: any[]) => {
            const getValue = (key: string) =>
              res.find(item => item.key === key)?.value || '';
            this.CompanyName = getValue('CompanyName');
            this.CompanyLogo = getValue('CompanyLogo');
            this.CompanyNameEn = getValue('CompanyNameEn');
            this.sessionService.setValue({ key: "companyName", value: this.CompanyName });
            this.sessionService.setValue({ key: "companyLogo", value: this.CompanyLogo });
            this.sessionService.setValue({ key: "companyNameEn", value: this.CompanyNameEn });
          }
        });


        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  initControl(): void {
    this.frm = this.fb.group({
      lastThreeDigits: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      stayId: [null],
    });
  }

  get phoneNumber() {
    // TODO: FORMAT THIS
    const phone = this.guestPhone ?? "";
    const formatted = phone.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1 $2 $3XXX");
    return formatted;
  }
  setAppInfo(tenantCode: string) {
    const tenant: Tenant = {
      name: "",
      note: "",
      code: tenantCode!,
      logo: "",
      tenantData: "",
    }
    const app: App = {
      appCode: "hotel-portal"
    }
    this.authService.setStorageValue({
      key: APP_STORAGE_KEY.App,
      value: app,
    });

    this.authService.setStorageValue({
      key: APP_STORAGE_KEY.Tenant,
      value: tenant,
    });
  }
  onSubmit(e?: any) {
    this.frm.patchValue({ stayId: this.sessionService.getValue("stayId") });
    if (this.frm.valid && !this.isLoading) {
      this.isLoading = true;
      this.service.verifyPhone(this.frm.getRawValue()).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.router.navigate(["/home"]);
          } else {
            this.notificationService.customErrorNotification(
              "Invalid phone number"
            );
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
    }
  }
}

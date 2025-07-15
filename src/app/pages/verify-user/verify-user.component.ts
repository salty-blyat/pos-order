import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { Guest, RequestService, VerifiedInfo } from "../request/request.service";
import { NotificationService } from "../service/notification.service";
import { App, AuthService, Tenant } from "../../helpers/auth.service";
import { APP_STORAGE_KEY } from "../../const";
@Component({
  selector: "app-verify-user",
  template: `
    <div class="verify-container" nz-flex nzJustify="center" nzAlign="center"> 
        <form
          class="verify-form"
          nz-form
          [formGroup]="frm"
          [style.height.%]="100"
        >
          <!-- @if(isLoading){
          <div class="verify-card" style="position: relative;height: 370px; ">
            <app-loading></app-loading>
          </div>
          } @else if(!isLoading && !phoneNumber){
          <div class="verify-card" style="margin:auto;padding:64px 0px;">
            <app-no-result-found></app-no-result-found>
          </div>
          }@else if (!isLoading && phoneNumber){  -->
          <h1 class="welcome-banner">
            {{ "Welcome to" | translate }} {{ CompanyName }}
          </h1> 
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
                    style="text-align: center;" nzSize="large"
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
          <!-- } -->
        </form> 
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
        width: 100%; 
        max-width: 370px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .verify-form {
        display: flex;
        width: 100%;
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
  CompanyName = "";
  CompanyLogo = "";
  CompanyNameEn = "";
  uuid: string = "";

  routeRefresh!: Subscription;

  ngOnInit(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.initControl();

    this.routeRefresh = this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.uuid = params.get("uuid")!;
        const tenantCode = params.get("tenantCode")!;

        this.authService.updateClientInfo(tenantCode).subscribe({
          next: () => {
            this.CompanyName = this.sessionService.getValue("companyName") || "";
            this.CompanyLogo = this.sessionService.getValue("companyLogo") || "";
            this.CompanyNameEn = this.sessionService.getValue("companyNameEn") || "";

            this.service.getGuest(this.uuid).subscribe({
              next: (res: Guest) => {
              this.guestPhone = res.guestPhone ?? "";
              this.sessionService.setValue({ key: "roomNo", value: res.roomNo });
              this.sessionService.setValue({ key: "checkInDate", value: res.checkInDate });
              this.sessionService.setValue({ key: "checkOutDate", value: res.checkOutDate });
              this.sessionService.setValue({ key: "totalNight", value: res.totalNight });
              this.sessionService.setValue({ key: "guestName", value: res.guestName });
              this.sessionService.setValue({ key: "guestPhone", value: this.guestPhone });
              this.isLoading = false;
            },
            error: (err) => {
              console.error(err);
              this.router.navigate(["/not-found"]);
              this.isLoading = false;
            }
          });
          },
          error: (err) => {
            console.error(err);
            this.router.navigate(["/not-found"]);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(["/not-found"]);
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
      roomUid: [null],
    });
  }

  get phoneNumber() {
    const phone = this.guestPhone ?? "";

    const match = phone.match(/^(\D*\d{0,3})?(\d+)$/);

    if (!match) return phone;

    const prefix = match[1] ?? "";
    const digits = match[2];

    const formatted = digits.replace(/(\d{3})(?=\d)/g, "$1 ");

    return `${prefix ? prefix + ' ' : ''}${formatted} ___`;
  }
  onSubmit(e?: any) {
    this.frm.patchValue({ roomUid: this.uuid });
    if (this.frm.valid && !this.isLoading) {
      this.isLoading = true;
      this.service.verifyPhone(this.frm.getRawValue()).subscribe({
        next: (res: VerifiedInfo) => {
          if (res.isValid) {
            this.sessionService.setValue({ key: "isVerified", value: res.isValid });
            this.sessionService.setValue({ key: "guestId", value: res.guestId });
            this.sessionService.setValue({ key: "stayId", value: res.stayId });
            this.sessionService.setValue({ key: "roomId", value: res.roomId });
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

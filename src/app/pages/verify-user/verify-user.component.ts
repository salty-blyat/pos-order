import { Component, NgZone, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { VerifyService } from "./verify.service";
@Component({
  selector: "app-verify-user",
  template: `
    <div style="margin-top: 20%;">
      <h1 class="welcome-banner">Welcome to {{ CompanyName }}</h1> 

    <form class="verify-form" nz-form [formGroup]="frm" [style.height.%]="100">
      <div class="verify-card" style="line-height: 1;">
        <h2>Guest Verification</h2>
        <span
          >Please enter the last 3 digit of your phone number to proceed.</span
        >
        <h3 style="text-align: center; margin-top:24px;">Your Phone Number</h3>
        <h1 style="text-align: center;">012 344 XXX</h1>
        <div nz-flex nzJustify="center"> 
          <nz-form-item>
            <nz-form-control>
              <input type="text" nz-input formControlName="phone" type="tel" placeholder="Enter last 3 digits" style="text-align: center;" >
            </nz-form-control>
          </nz-form-item>
        </div>
        <button
          [disabled]="!frm.valid"
          nz-button
          style="width: 100%;"
          nzType="primary"
          (click)="onSubmit($event)"
        >
          Confirm
        </button>
      </div>
    </form>  

</div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    ` 
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
  constructor(private fb: FormBuilder, private router: Router, private service: VerifyService, private activatedRoute: ActivatedRoute, private sessionService: SessionStorageService) { }
  frm!: FormGroup;
  isLoading = false;
  CompanyName = "Hotel Paradise";
  routeRefresh!: Subscription;
  ngOnInit(): void {
    this.initControl();
    this.routeRefresh = this.activatedRoute.paramMap.subscribe((params) => {
      const uuid = params.get("uuid");
      this.service.verify(uuid!).subscribe((res) => {
        const guestId = res.guestId;
        const roomId = res.roomId;
        const stayId = res.stayId;
        this.sessionService.setValue({ key: "guestId", value: guestId });
        this.sessionService.setValue({ key: "roomId", value: roomId });
        this.sessionService.setValue({ key: "stayId", value: stayId });
      })
    });
  }
  initControl(): void {
    this.frm = this.fb.group({
      phone: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    });
  }

  onSubmit(e?: any) {
    if (this.frm.valid && !this.isLoading) {
      this.isLoading = true;
      if (this.frm?.get('phone')?.value == '111') {
        this.router.navigate(['/home']);
      }
      this.isLoading = false;
    }
  }
}

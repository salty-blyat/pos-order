import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ServiceUiService } from "./service-ui-service.service";
import { Service, ServiceService } from "./service.service";
import { Subscription } from "rxjs";
import { SessionStorageService } from "../../utils/services/sessionStorage.service";
import { RequestService, RequestStatus } from "../request/request.service";

@Component({
  selector: "app-service-operation",
  template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button nz-button nzType="text" (click)="goBack()">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;"> {{ "Back" | translate }}</span>
      </button>
    </div>

    <form
      class="service-op"
      nz-flex
      nzGap="middle"
      [ngStyle]="{ height: isLoading ? '80vh' : '100%' }"
      nzVertical
      nz-form
      [formGroup]="frm"
    >
      @if(isLoading){
           <app-loading></app-loading>
       } @else if(!service && !isLoading){ 
        <div style='margin:auto'>
          <app-no-result-found></app-no-result-found>
        </div>
      } @else if (!isLoading && service){
      <h3 class="service-op-title">
        {{ service?.name || "" }}
      </h3>
      <div>
        <img
          class="service-op-img"
          [src]="
            service?.image ? service.image : './../../../assets/image/noimg.jpg'
          "
          [alt]="service?.name"
        />
      </div>
      <div *ngIf="service?.description" class="service-op-des">
        <h4>{{ "Description" | translate }}</h4>
        <p>{{ service?.description || "" }}</p>
      </div>
      <nz-form-item *ngIf="service?.trackQty">
        <nz-form-label>{{ "Quantity" | translate }}</nz-form-label>
        <nz-form-control>
          <div nz-flex nzGap="small" nzAlign="center">
            <button
              nz-button
              nzSize="large"
              [disabled]="this.frm.get('quantity')?.value <= 1"
              (click)="
                this.frm.get('quantity')?.setValue(this.frm.get('quantity')?.value - 1)
              "
            >
              -
            </button>
            <input
              nz-input
              formControlName="quantity"
              nzSize="large"
              readonly
              class="qty-size text-center"
            />
            <button
              nz-button
              nzSize="large"
              [disabled]="this.frm.get('quantity')?.value >= this.service?.maxQty!"
              (click)="
                this.frm.get('quantity')?.setValue(this.frm.get('quantity')?.value + 1)
              "
            >
              +
            </button>
          </div>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>{{ "Note" | translate }}</nz-form-label>
        <nz-form-control>
          <textarea nz-input rows="3" formControlName="note"></textarea>
        </nz-form-control>
      </nz-form-item>
      <button
        [disabled]="!frm?.valid"
        nz-button
        style="width: 100%;"
        nzType="primary"
        (click)="onSubmit($event)"
      >
        {{ "Request" | translate }}
      </button>
      }
    </form>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .text-center {
        text-align: center;
      }
      .qty-size {
        width: 100px;
      }
      .ant-form-item-label {
        padding: 0px !important;
        margin: 0px !important;
      }
      .service-op {
        padding: 16px 16px 32px 16px;
        background-color: white;
        border-radius: 8px;
      }
      .service-op-title {
        font-size: 20px;
        font-weight: bold;
      }
      .service-op-img {
        width: 100%; 
        max-height:400px;
        border-radius: 8px;
        object-fit: cover;
      }
      .service-op-des {
        background-color: #eff5ff;
        border: 1px solid rgb(219 234 254);
        padding: 16px;
        border-radius: 8px;
        h4 {
          font-weight: bold;
          font-size: 14px;
        }
        p {
          margin: 0px;
        }
      }
    `,
  ],
  standalone: false,
})
export class ServiceOperationComponent implements OnInit {
  frm!: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private uiService: ServiceUiService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private serviceService: ServiceService,
    private requestService: RequestService,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) { }
  routeRefresh!: Subscription;
  serviceRefresh!: Subscription;
  service!: Service;

  goBack() {
    this.location.back();
  }
  decreseQty() {
    this.frm.get("quantity")?.setValue(this.frm.get("quantity")?.value - 1);
  }
  increaseQty() {
    this.frm.get("quantity")?.setValue(this.frm.get("quantity")?.value + 1);
  }

  ngOnInit(): void {
    this.initControl();
    this.routeRefresh = this.activatedRoute.paramMap.subscribe((params) => {
      this.serviceRefresh = this.serviceService
        .find(Number(params.get("id")))
        .subscribe((res) => {
          this.service = res;
          if (this.service?.trackQty) {
            this.frm.get("quantity")?.setValue(1);
            this.frm
              .get("quantity")
              ?.addValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(this.service?.maxQty || 1),
              ]);
          } else {
            this.frm.get("quantity")?.setValue(0);
          }
        });
    });
  }
  initControl(): void {
    this.frm = this.fb.group({
      quantity: [0],
      note: [null],
      status: [RequestStatus.Pending],
      requestTime: [new Date()],
      serviceTypeId: [this.service?.serviceTypeId || 0],
      serviceItemId: [0],
      guestId: [null],
      roomId: [null],
      stayId: [null],
    });
  }

  onSubmit(e?: any) {
    const guestId = this.sessionStorageService.getValue("guestId");
    const roomId = this.sessionStorageService.getValue("roomId");
    const stayId = this.sessionStorageService.getValue("stayId");
    const serviceItemId = this.service?.id || 0;
    this.frm.patchValue({
      guestId: guestId,
      roomId: roomId,
      stayId: stayId,
      serviceItemId: serviceItemId,
    });

    if (this.frm.valid && !this.isLoading) {
      this.isLoading = true;
      this.requestService.addData(this.frm.value).subscribe({
        next: (res) => {
          this.uiService.showSuccess();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
    }
  }
  ngOnDestroy(): void {
    this.routeRefresh?.unsubscribe();
    this.serviceRefresh?.unsubscribe();
  }
}

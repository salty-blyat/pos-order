import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ServiceUiService } from "./service-ui-service.service";

@Component({
  selector: "app-service-operation",
  template: `
    <div nz-flex nzGap="small" nzAlign="center" style="margin-bottom: 16px;">
      <button nz-button nzType="text" (click)="goBack()">
        <i nz-icon nzType="arrow-left"></i
        ><span style="font-size: 16px;"> Back</span>
      </button>
    </div>

    <form
      class="service-op"
      nz-flex
      nzGap="middle" 
      [ngStyle]="{ height: isLoading? 'calc(100vh - 300px)' : '100%' }"
      nzVertical
      nz-form
      [formGroup]="frm" 
    >
    <ng-container *ngIf="isLoading">
      <app-loading></app-loading>
    </ng-container >
       <ng-container *ngIf="!isLoading">
      <h3 class="service-op-title">
        {{ service.name }}
      </h3>
      <div>
        <img
          class="service-op-img"
          [src]="
            service.image ? service.image : './../../../assets/image/noimg.jpg'
          "
          [alt]="service.name"
        />
      </div>
      <div class="service-op-des">
        <h4>{{ "Description" | translate }}</h4>
        <p>{{ service.description }}</p>
      </div>
        <nz-form-item>
        <nz-form-label>{{ "Qty " | translate }}</nz-form-label>
        <nz-form-control>
          <div nz-flex nzGap="small"  nzAlign="center">
            <button nz-button nzSize="large"  [disabled]="this.frm.get('qty')?.value <=1"  (click)="this.frm.get('qty')?.setValue(this.frm.get('qty')?.value - 1)">-</button>
            <input nz-input formControlName="qty" nzSize="large"  readonly  class="qty-size text-center" />
            <button nz-button  nzSize="large" (click)="this.frm.get('qty')?.setValue(this.frm.get('qty')?.value +1)">+</button>
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
        [disabled]="!frm.valid"
        nz-button
        style="width: 100%;"
        nzType="primary"
        (click)="onSubmit($event)"
      >
        {{'Request' | translate}}
      </button>
    </ng-container>
    </form>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    .text-center{
      text-align: center;
    }
    .qty-size{
      width: 100px;
    }
      .ant-form-item-label {
        padding: 0px !important;
        margin: 0px !important;
      }
      .service-op {
        padding:16px 16px 32px 16px;
        background-color: white;
        border-radius: 8px;
        
      }
      .service-op-title {
        font-size: 20px;
        font-weight: bold;
      }
      .service-op-img {
        width: 100%;
        height: 200px;
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
export class ServiceOperationComponent {
  frm!: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private uiService: ServiceUiService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  service = {
    id: 2,
    departmentName: null,
    serviceTypeName: null,
    name: "Frontdesk",
    serviceTypeId: 0,
    departmentId: 0,
    trackQty: true,
    maxQty: 0,
    image:
      "https://core.sgx.bz/files/localhost/hotel/25/07/d154e7917fe74436ba8fa67f07941d9c.jpeg",
    description: "Frontdesk is a service that helps guests check-in and out.",
  };

  goBack() {
    this.location.back();
  }
  decreseQty() {
    this.frm.get("qty")?.setValue(this.frm.get("qty")?.value - 1);

  }
  increaseQty() {
    this.frm.get("qty")?.setValue(this.frm.get("qty")?.value + 1);
  }

  ngOnInit(): void {
    this.initControl();
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log("id", params.get("id"));
    });
  }
  initControl(): void {
    this.frm = this.fb.group({
      qty: [1, [Validators.required, Validators.min(1)]],
      serviceTypeId: [null],
      note: [null],
    });
  }
  onSubmit(e?: any) {
    if (this.frm.valid && !this.isLoading) {
      this.isLoading = true; 
        this.uiService.showSuccess(); 
    }
  }
}

import { Component, inject, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { RoomUiService } from "./room-ui.service";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { Room, RoomService } from "./room.service";

@Component({
  selector: 'app-room-view',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span>{{ model?.roomNumber || ('Loading' | translate) }}</span>
      </div>
      <div class="modal-content row-content" nz-row>
          <app-loading *ngIf="isLoading()"></app-loading>
          <div [nzSm]="6" [nzXs]="24" class="left-content" nz-col>
              <div nz-row>
                  <div nz-col nzSpan="12"></div>
                  <div nz-col nzSpan="12"></div>
              </div>
              <h5 style="margin-bottom: 10px; color: #000000a6">
                  <i nz-icon nzTheme="outline" nzType="profile"></i>&nbsp;
                  {{ 'GeneralInfo' | translate }}
                  <nz-tag nzColor="success" style="margin: 0 6px">
                      {{ 'Room' | translate }}
                  </nz-tag>
              </h5>
              <div>
                  <nz-card [nzExtra]="customerAction" [nzTitle]="title" class="card-room-info">
                      <ng-template #title>
                          <span style="margin-right: 8px">
                              {{ model.roomNumber }} 
                          </span>
                      </ng-template>

                      <ng-template #customerAction>
                          <a *ngIf="!isLoading() && isRoomEdit()">
                              <i nz-icon nzTheme="outline" nzType="edit"></i>
                          </a>
                          <nz-divider nzType="vertical" *ngIf="!isLoading() && isRoomEdit()"></nz-divider>
                          <a *ngIf="!isLoading() && isRoomRemove()">
                              <i nz-icon nzTheme="outline" nzType="delete" class="delete"></i>
                          </a>
                      </ng-template>

                      <h5>
                          <i nz-icon nzTheme="outline" nzType="tags"></i> &nbsp;
                          <span class="info-text">{{ model.floorName }}</span>
                      </h5>

                      <h5>
                          <i nz-icon nzTheme="outline" nzType="info-circle"></i> &nbsp;
                          <span class="info-text">{{ model.statusName }}</span>
                      </h5>

                      <h5>
                          <i nz-icon nzTheme="outline" nzType="user"></i> &nbsp;
                          <span class="info-text blod-text">{{ 0 }}</span>
                      </h5>
                  </nz-card>
              </div>
          </div>
          <div [nzSm]="18" [nzXs]="24" class="main-content" nz-col>
              <nz-tabset class="tab-custom" [nzTabBarStyle]="{marginBottom: '0'}" #tabSetComponent>
                  <nz-tab [nzTitle]="tabCharge">
                      <ng-template #tabCharge>
                          <i nz-icon nzTheme="outline" nzType="file-text"></i>
                          <span>{{ 'Charge' | translate }}</span>
                      </ng-template>
                      <app-room-charge-list></app-room-charge-list>
                  </nz-tab>
                  <nz-tab [nzTitle]="tabMember">
                      <ng-template #tabMember>
                          <i nz-icon nzTheme="outline" nzType="team"></i>
                          <span>{{ 'Member' | translate }}</span>
                      </ng-template>
                  </nz-tab>
                  <nz-tab [nzTitle]="tabAsset">
                      <ng-template #tabAsset>
                          <i nz-icon nzTheme="outline" nzType="setting"></i>
                          <span>{{ 'Asset' | translate }}</span>
                      </ng-template>

                  </nz-tab>
              </nz-tabset>
          </div>
      </div>
      <div *nzModalFooter>
          <div *ngIf="modal?.isView">
              <a (click)="cancel()" class="close">
                  <i nz-icon nzType="close" nzTheme="outline"></i>
                  <span class="action-text"> {{ 'Close' | translate }}</span>
              </a>
          </div>
      </div>
  `,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [`
    .row-content {
      height: 100%;
      padding-top: 10px;
      padding-left: 16px;
      h5 {
        font-size: 0.9rem;
        margin-bottom: 0.2rem;
      }

      .left-content {
        padding: 0 16px 0 0;
        height: 100%;
        overflow-y: auto;
        border-right: 1px solid #f2f2f2;
        
        .info-text {
          color: #000000a6;
        }
        .blod-text{
          font-weight: bold;
          font-size: 1rem;
        }

        .button-add {
          border-radius: 6px;
          width: 100%;
          padding: 18px 0px;
          height: 60px;
        }
      }

      .main-content {
        padding: 0 16px 0 16px;
        height: 100%;
        overflow-y: auto;
        margin-top: -10px;
      }
    }

    .card-room-info {
      border-radius: 6px;
      margin-bottom: 6px;
      border: none;
      cursor: pointer;
      background-color: #f0f2f5;
      .ant-card-head {
        border-bottom: none;
        min-height: 44px;
        padding: 0 16px;

        .ant-card-head-title {
          padding: 12px 0px 8px 0px;
        }
      }
      .ant-card-extra{
        padding: 12px 0px 8px 0px;
      }

      .ant-card-body {
        padding: 0 16px 12px 16px;
      }
    }
    .tab-custom {
      .ant-tabs-tab-btn{
        padding: 0;
      }
      .ant-tabs-tab{
        padding: 6px 0 0 !important;
      }

      nz-table{
        height: calc(100vh - 264px);
      }
      
    }
  `],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})

export class RoomViewComponent implements OnInit{
  constructor(
    private service: RoomService,
    protected uiService: RoomUiService,
    private ref : NzModalRef<RoomViewComponent>,
  ) {}
  model: Room = {};
  modal:any = inject(NZ_MODAL_DATA);
  isLoading = signal<boolean>(false);
  isRoomEdit = signal(true);
  isRoomRemove = signal(true);

  ngOnInit() {
    if (this.modal?.id){
      this.isLoading.set(true);
      this.service.find(this.modal?.id).subscribe({
        next: (result: Room) => {
          this.model = result;
          this.isLoading.set(false);
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  cancel(){
    this.ref.triggerCancel().then();
  };
}
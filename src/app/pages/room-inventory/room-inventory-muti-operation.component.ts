import {Component, ElementRef, inject, OnInit, signal, viewChild, ViewChild, ViewEncapsulation} from "@angular/core";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {RoomInventory, RoomInventoryService} from "./room-inventory.service";
import {CommonValidators} from "../../utils/services/common-validators";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-room-inventory-muti-operation',
  template: `
      <div *nzModalTitle class="modal-header-ellipsis">
          <span *ngIf="!modal?.id">{{ "Add" | translate }}</span>
<!--          <span *ngIf="modal?.id && !modal?.isView">-->
<!--            {{ "Edit" | translate }} {{ model?.roomId || ("Loading" | translate) }}-->
<!--          </span>-->
<!--          <span *ngIf="modal?.id && modal?.isView">-->
<!--            {{ model?.roomId || ("Loading" | translate) }}-->
<!--        </span>-->
      </div>
      <div class="modal-content">
          <app-loading *ngIf="isLoading()"></app-loading>
          <form nz-form [formGroup]="frm" [nzAutoTips]="autoTips">
              <div #scrollable nz-row class="table-form">
                  <nz-table
                          nzSize="small"
                          nzTableLayout="fixed"
                          #fixedTable
                          [nzData]="inventories.controls"
                          [nzNoResult]="' '"
                          [nzFrontPagination]="false"
                  >
                      <thead>
                      <tr class="table-form-thead">
                          <th class="col-header" nzWidth="5%" style="padding:0;">#</th>
                          <th class="col-header" nzWidth="30%">
                              {{ "ItemName" | translate }}
                          </th>
                          <th class="col-header" nzWidth="40%">
                              {{ "Qty" | translate }}
                          </th>
                          <th class="col-header" nzWidth="5%"></th>
                      </tr>
                      </thead>
                      <tbody formArrayName="inventories">
                      <ng-container *ngFor="let item of inventories?.controls; let i = index">
                          <tr [formGroupName]="i">
                              <td>
                                  <nz-form-item style="margin-bottom: 0 !important">
                                      <nz-form-control>
                                          <span>{{ i + 1 }}</span>
                                      </nz-form-control>
                                  </nz-form-item>
                              </td>
                              <td>
                                  <nz-form-item style="margin: 0 !important; ">
                                      <nz-form-control [nzSm]="24" [nzXs]="24">
                                          <app-item-select formControlName="itemId"></app-item-select>
                                      </nz-form-control>
                                  </nz-form-item>
                              </td>
                              <td>
                                  <nz-form-item style="margin: 0 !important; ">
                                      <nz-form-control [nzSm]="24" [nzXs]="24">
                                          <input nz-input formControlName="qty" style="width:100%; "/>
                                      </nz-form-control>
                                  </nz-form-item>
                              </td>

                              <td>
                                  <a nz-button nzType="link" nzDanger (click)="removeInventory(i)" style="padding:0;"
                                     [disabled]="modal?.isView">
                                      <i nz-icon nzType="delete" nzTheme="outline"></i>
                                  </a>
                              </td>
                          </tr>
                      </ng-container>
                      </tbody>
                  </nz-table>
              </div>
              <div nz-row>
                      <button
                              nz-button
                              nzBlock
                              type="button"
                              class="btn-add-row"
                              nzType="link"
                              [nzSize]="'large'"
                              (click)="addInventory(); scrollToBottom()"
                              [disabled]="modal?.isView"
                      >
                          <i nz-icon nzTheme="outline" nzType="plus"></i>
                          {{ "Add" | translate }}
                      </button>
              </div>
             
          </form>
      </div>
      <div *nzModalFooter>
          <div *ngIf="!modal?.isView">
              <button
                      nz-button
                      nzType="primary"
                      [disabled]="!frm.valid || inventories.length === 0"
                      (click)="onSubmit($event)"
              >
                  <i *ngIf="isLoading()" nz-icon nzType="loading"></i>
                  {{ "Save" | translate }}
              </button>
              <button nz-button nzType="default" (click)="cancel()">
                  {{ "Cancel" | translate }}
              </button>
          </div>
          <!--          <div *ngIf="modal?.isView">-->
          <!--              <a (click)="uiService.showEdit(model.id || 0)" *ngIf="!isLoading() && isRoomInventoryEdit()">-->
          <!--                  <i nz-icon nzType="edit" nzTheme="outline"></i>-->
          <!--                  <span class="action-text"> {{ "Edit" | translate }}</span>-->
          <!--              </a>-->
          <!--              <nz-divider nzType="vertical" *ngIf="!isLoading() && isRoomInventoryEdit()"></nz-divider>-->
          <!--              <a nz-typography nzType="danger" (click)="uiService.showDelete(model.id || 0)" *ngIf="!isLoading() && isRoomInventoryRemove()">-->
          <!--                  <i nz-icon nzType="delete" nzTheme="outline"></i>-->
          <!--                  <span class="action-text"> {{ "Delete" | translate }}</span>-->
          <!--              </a>-->
          <!--              <nz-divider nzType="vertical" *ngIf="!isLoading() && isRoomInventoryRemove()"></nz-divider>-->
          <!--              <a nz-typography (click)="cancel()" style="color: gray;">-->
          <!--                  <i nz-icon nzType="close" nzTheme="outline"></i>-->
          <!--                  <span class="action-text"> {{ "Close" | translate }}</span>-->
          <!--              </a>-->
          <!--          </div>-->
      </div>
  `,
  standalone: false,
  styleUrls: ["../../../assets/scss/operation.style.scss"],
  styles: [`
    .table-form{
      max-height: 500px;
      overflow-y: auto;
      nz-table {
        width: 100%;
        min-height: 0 !important;
        td {
          padding: 2px !important;
        }
        
        &-thead {
          position: sticky;
          z-index: 200;
          top: 0;
        }
      }
    }

    .btn-add-row {
      font-weight: bold;
      font-size: 14px;
      border-bottom: 1px solid #f0f0f0 !important;
      height: 36px;
      border-radius: 0 !important;
    }
    .btn-add-row:hover {
      border-bottom: 1px solid #f0f0f0;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})

export class RoomInventoryMutiOperationComponent implements OnInit{
  constructor(
    private service: RoomInventoryService,
    private ref: NzModalRef<RoomInventoryMutiOperationComponent>,
    private fb: FormBuilder,
  ) {
  }

  modal = inject(NZ_MODAL_DATA);
  list: RoomInventory[] = [];
  isLoading = signal<boolean>(false);
  tableForm = viewChild.required<ElementRef>('scrollable');
  frm!: FormGroup;
  autoTips: Record<any, any> = CommonValidators.autoTips;

  ngOnInit() {
    this.initControl();
  }

  initControl() {
    this.frm = this.fb.group({
      inventories: this.fb.array([]),
    });
  }

  onSubmit(e?: any) {
    if (this.frm.valid && !this.isLoading()) {
      let operation$: Observable<RoomInventory[]> = this.service.addMulti(this.frm.getRawValue()?.inventories);
      // if (this.modal?.id) {
      //   operation$ = this.service.edit({
      //     ...this.frm.getRawValue(),
      //     id: this.modal?.id,
      //   });
      // }
      if (e.detail === 1 || e.detail === 0) {
        this.isLoading.set(true);
        operation$.subscribe({
          next: (result: RoomInventory[]) => {
            this.list = result;
            this.isLoading.set(false);
            this.ref.triggerOk().then();
          },
          error: (error: any) => {
            console.log(error);
            this.isLoading.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
          },
        });
      }
    }
  }

  get inventories() {
    return this.frm.get("inventories") as FormArray;
  }

  addInventory(inventory?: RoomInventory) {
    const { required, integerValidator } = CommonValidators;
    this.inventories.push(
      this.fb.group({
        id: [inventory?.id ?? 0],
        roomId: [this.modal?.roomId, [required]],
        itemId: [inventory?.itemId, [required]],
        memberId: [0],
        qty: [inventory?.qty,[integerValidator]],
      })
    );
  }

  removeInventory(index: number) {
    this.inventories.removeAt(index);
  }

  cancel() {
    this.ref.triggerCancel().then();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const element = this.tableForm()?.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }
}
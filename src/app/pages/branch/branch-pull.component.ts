import {Component} from "@angular/core";
import {NzModalRef} from "ng-zorro-antd/modal";
import {FormBuilder} from "@angular/forms";
import {NotificationService} from "../../utils/services/notification.service";
import {Branch, BranchService} from "./branch.service";

@Component({
    selector: 'app-branch-pull',
    template: `
    <div *nzModalTitle>
      <span>{{ 'Branch'| translate}}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="loading" style="position: absolute; top: 50%; left: 50%"></nz-spin>
      <a>
        <i nz-icon nzType="exclamation-circle" nzTheme="outline"></i>
      </a>
      <span>{{'PullBranches' | translate}} !</span>
    </div>
    <div *nzModalFooter>
      <button nz-button nzType="primary" (click)="onSubmit()">
        <i *ngIf="loading" nz-icon nzType="loading"></i>
        {{ "Pull" | translate }}
      </button>
      <button nz-button nzType="default" (click)="cancel()">
        {{ "Cancel" | translate }}
      </button>
    </div>
  `,
    styles: [`
    .modal-content{
      padding: 20px 50px 8px;
      display: flex;
    }
    .modal-content > a{
      display: flex;
      align-items: center;
    }
    .modal-content > a > i{
      font-size: 18px;
      margin-right: 10px;
    }
  `],
    styleUrls: ['../../../assets/scss/operation_modal.scss'],
    standalone: false
})
export class BranchPullComponent{
  constructor(
    private ref:NzModalRef<BranchPullComponent>,
    private fb: FormBuilder,
    private service: BranchService,
    private notificationService: NotificationService,
  ) {
  }
  loading = false;
  model: Branch = {};
  ngOnInit(): void {

  }

  onSubmit(){
    this.loading = true;
    let message = "PullSuccessfully";
    this.service.pull().subscribe(result => {
        this.loading = false;
        this.notificationService.successNotification(message);
        this.ref.triggerOk().then();
      },
      (error: any) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
  cancel(){
    this.ref.triggerCancel().then();
  }
}

// import { Component, computed, ViewEncapsulation } from "@angular/core";
// import { FormBuilder } from "@angular/forms";
// import { NzModalRef } from "ng-zorro-antd/modal";
// import { CommonValidators } from "../../utils/services/common-validators";
// import { BaseOperationComponent } from "../../utils/components/base-operation.component";
// import { AuthService } from "../../helpers/auth.service";
// import { AuthKeys } from "../../const";
// import { Card, CardService } from "./card.service";
// import { CardUiService } from "./card-ui.service";

// @Component({
//   selector: "app-auto-number-operation",
//   template: `
//     <form
//       nz-form
//       [formGroup]="frm"
//       [style.height.%]="100"
//       [nzAutoTips]="autoTips"
//     >
//       <div nz-row>
//         <div nz-col [nzXs]="24">
//           <div nz-row>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
//                   >{{ "Code" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
//                   <input
//                     [autofocus]="true"
//                     nz-input
//                     formControlName="code"
//                     [placeholder]="
//                       frm.controls['code'].disabled
//                         ? ('NewCode' | translate)
//                         : ''
//                     "
//                   />
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired=""
//                   >{{ "DateOfBirth" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
//                   <nz-date-picker formControlName="birthDate"></nz-date-picker>
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//           </div>

//           <div nz-row>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
//                   >{{ "Name" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24" nzHasFeedback>
//                   <input nz-input formControlName="name" />
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24"
//                   >{{ "LatinName" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24">
//                   <input nz-input formControlName="latinName" />
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//           </div>

//           <div nz-row>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired
//                   >{{ "Phone" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip="">
//                   <input nz-input formControlName="phone" />
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24"
//                   >{{ "Email" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24" nzErrorTip>
//                   <input nz-input formControlName="email" />
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//           </div>

//           <div nz-row>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired=""
//                   >{{ "MemberClass" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24">
//                   <app-member-class-select
//                     formControlName="memberClassId"
//                   ></app-member-class-select>
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//             <div nz-col [nzXs]="12">
//               <nz-form-item>
//                 <nz-form-label [nzSm]="8" [nzXs]="24" nzRequired=""
//                   >{{ "Agent" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzSm]="14" [nzXs]="24">
//                   <app-agent-select
//                     formControlName="agentId"
//                   ></app-agent-select>
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//           </div>

//           <div nz-row>
//             <div nz-col [nzSpan]="24">
//               <nz-form-item>
//                 <nz-form-label [nzSpan]="4"
//                   >{{ "Address" | translate }}
//                 </nz-form-label>
//                 <nz-form-control [nzXs]="19">
//                   <textarea
//                     nz-input
//                     type="text"
//                     formControlName="address"
//                     rows="3"
//                   ></textarea>
//                 </nz-form-control>
//               </nz-form-item>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   `,
//   styleUrls: ["../../../assets/scss/operation.style.scss"],
//   standalone: false,
//   encapsulation: ViewEncapsulation.None,
// })
// export class CardOperationComponent extends BaseOperationComponent<Card> {
//   constructor(
//     fb: FormBuilder,
//     ref: NzModalRef<CardOperationComponent>,
//     service: CardService,
//     private authService: AuthService,
//     uiService: CardUiService
//   ) {
//     super(fb, ref, service, uiService);
//   }

//   isCardEdit = computed(() => true);
//   isCardRemove = computed(() => true);

//   override initControl(): void {
//     const {
//       nameMaxLengthValidator,
//       noteMaxLengthValidator,
//       nameExistValidator,
//       required,
//     } = CommonValidators;
//     this.frm = this.fb.group({
//       accountId: [null, [nameMaxLengthValidator(), required]],
//       cardNumber: [null, [nameMaxLengthValidator(), required]],
//       issueDate: [
//         null,
//         [nameMaxLengthValidator(), required],
//         [nameExistValidator(this.service, this.modal?.id)],
//       ],
//       expiryDate: "2025-05-20T10:33:50.497Z",
//       status: 1,

//       name: [
//         null,
//         [nameMaxLengthValidator(), required],
//         [nameExistValidator(this.service, this.modal?.id)],
//       ],
//       format: [null, [required]],
//       note: [null, [noteMaxLengthValidator()]],
//     });
//   }

//   override setFormValue() {
//     this.frm.setValue({
//       name: this.model.name,
//       format: this.model.format,
//       note: this.model.note,
//     });
//   }
// }

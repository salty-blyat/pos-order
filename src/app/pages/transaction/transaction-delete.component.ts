// import { Component, OnInit } from "@angular/core";
// import { BaseDeleteComponent } from "../../utils/components/base-delete.component";
// import { AccountService, Transaction } from "../account/account.service";
// import { AccountUiService } from "../account/account-ui.service";
// import { NzModalRef } from "ng-zorro-antd/modal";
// import { FormBuilder } from "@angular/forms";
// import { CommonValidators } from "../../utils/services/common-validators";

// @Component({
//   selector: "app-transaction-delete",
//   template: ``,
// })
// export class TransactionDeleteComponent extends BaseDeleteComponent<Transaction> {
//   constructor(
//     service: AccountService,
//     override uiService: AccountUiService,
//     ref: NzModalRef<TransactionDeleteComponent>,
//     fb: FormBuilder
//   ) {
//     super(service, uiService, ref, fb);
//   }
//   override initControl(): void {
//     const { noteMaxLengthValidator, required } = CommonValidators;
//     this.frm = this.fb.group({
//       transNo: [{ value: null, disabled: true }, [required]],
//       note: [null, [noteMaxLengthValidator()]],
//     });
//   }

//   override setFormValue() {
//     this.frm.setValue({
//       transNo: this.model.transNo,
//       note: this.model.note,
//     });
//   }
// }

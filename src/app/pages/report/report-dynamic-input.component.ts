import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ComponentFactoryResolver,
  Input,
  ChangeDetectorRef,
  forwardRef,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { ReportParam } from "./report.service";
import { ParamSelectComponent } from "./report-operation.component";

const INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ReportDynamicInputComponent),
  multi: true,
};

@Component({
  selector: "app-report-dynamic-input",
  template: `
    <div>
      <form nz-form [nzLayout]="'vertical'">
        <nz-form-item>
          <nz-form-label *ngIf="formItem.label" style="padding: 0">
            <span
              style="font-size: 12px; font-weight: 700; color: rgba(0,0,0,.45)"
              >{{ formItem.label | translate }}</span
            >
          </nz-form-label>
          <nz-form-control nzErrorTip="">
            <ng-container #inputComponentRef></ng-container>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `,
  providers: [INPUT_VALUE_ACCESSOR],
  standalone: false,
})
export class ReportDynamicInputComponent
  implements AfterViewInit, ControlValueAccessor
{
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @ViewChild("inputComponentRef", { read: ViewContainerRef })
  inputComponentRef!: ViewContainerRef;
  @Input() group!: FormGroup;
  @Input() formItem: ReportParam = {};
  componentRef: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      // @ts-ignore
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          //@ts-ignore
          ParamSelectComponent[this.formItem.type]
        );
      this.componentRef =
        this.inputComponentRef.createComponent<any>(componentFactory);
      this.componentRef.instance.onTouchedCallback = this.onTouchedCallback;
      this.componentRef.instance.onChangeCallback = this.onChangeCallback;
      this.componentRef.instance.showAllOption = true;
      try {
        console.log(this.formItem.initParam);

        let initParam = JSON.parse(this.formItem.initParam?.toString() ?? "{}");
        this.componentRef.instance.applyInitParam(initParam);
      } catch (e) {
        console.log(e);
      }
      try {
        this.componentRef.instance.applyDefaultValue(
          this.convertDefaultSelectValue()
        );
      } catch (e) {
        console.log(e);
      }
      this.changeDetectorRef.detectChanges();
    }, 100);
  }

  convertDefaultSelectValue() {
    let defaultValue = this.value.id ?? this.value.value;
    defaultValue = defaultValue.toString();
    return defaultValue.split(",").map((x) => this.convertDataType(x));
  }

  convertDataType(val: any) {
    if (val?.toLowerCase() == "true") {
      return true;
    } else if (val?.toLowerCase() == "false") {
      return false;
    } else {
      return +val || val;
    }
  }

  private value: { id: string; label: string; value?: string } = {
    id: "0",
    label: "",
  };
  private onTouchedCallback!: () => {};
  private onChangeCallback!: (_: number) => {};
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  writeValue(obj: any): void {
    // Work only with muti select component
    this.value = obj;
    if (this.componentRef) {
      this.componentRef.instance.selectedValue = this.value;
      this.componentRef.instance.onModalChange();
    }
  }
}

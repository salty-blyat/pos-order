import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  Optional,
} from "@angular/core";
import { NgControl } from "@angular/forms";
import {DecimalPipe} from "@angular/common";

@Directive({
    selector: "[currencyInput]",
    standalone: false
})
export class CurrencyInputDirective {

  input!: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl,
    private decimalPipe: DecimalPipe,
  ) {}




  ngAfterViewInit() {
    this.input =
      this.el.nativeElement.tagName === "INPUT"
        ? this.el.nativeElement
        : this.el.nativeElement.querySelector("input");
    setTimeout(()=>{
      this.format();
    },100)
  }

  @HostListener("blur", ["$event"]) onBlur(event:any) {
   this.format()
  }

  format(){
    let text = (this.input.value || "").replace(/[, ]/g, '');
    let value = parseFloat(text) || 0;
    const formattedVal = this.decimalPipe.transform(
      value,//this.input.value,
      "1.0-10"
    );
    if (this.ngControl) {
      this.ngControl.control?.setValue(formattedVal, { emitEvent: false });
    } else {
      this.renderer.setProperty(this.input, "value", formattedVal);
    }
  }

  @HostListener("focus", ["$event"]) onFocus(event: any) {
    // const initVal = this.input.value.replace(/,/g, '');
    // if (this.ngControl) {
    //   this.ngControl.control?.setValue(initVal, { emitEvent: false });
    // } else {
    //   this.renderer.setProperty(this.input, "value", initVal);
    // }
  }


}

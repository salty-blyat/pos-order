import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { timer } from "rxjs";
import { NzCodeEditorComponent } from "ng-zorro-antd/code-editor";

@Component({
    selector: 'app-code-editor',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CodeEditorComponent,
            multi: true
        }
    ],
    template: `
    <nz-code-editor
      class="editor"
      [(ngModel)]="value"
      (ngModelChange)="onValueChange()"
      [nzEditorOption]="{ language: language, readOnly: disabled}"
      [nzLoading]="isLoaded"
    ></nz-code-editor>
  `,
    styles: [`
    .editor {
      height: calc(100vh - 254px);
    }
`],
    standalone: false
})
export class CodeEditorComponent implements OnInit, ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() language: string = 'html';
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  value: string = '';
  isLoaded: boolean = false;
  @ViewChild(NzCodeEditorComponent, { static: false }) editorComponent?: NzCodeEditorComponent;
  constructor() { }

  onChange: any = () => { }
  onTouch: any = () => { }

  ngOnInit(): void {
    this.isLoaded = true;
    timer(300).subscribe(() => {
      this.onValueChange();
      this.editorComponent?.layout();
      this.isLoaded = false;
    })
  }

  onValueChange() {
    this.onChange(this.value);
    this.onTouch(this.value);
    this.valueChange.emit(this.value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(val: any): void {
    this.value = val;
  }

}

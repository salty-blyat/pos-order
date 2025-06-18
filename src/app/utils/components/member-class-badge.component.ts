import { Component, Input } from "@angular/core";

@Component({
  selector: "app-member-class-badge",
  template: ` <div class="member-class">
    <img *ngIf="photo" class="member-class-img" [src]="photo" [alt]="name" />
    <span *ngIf="name">
      {{ name }}
    </span>
  </div>`,
  styles: [
    `
      .member-class-img {
        width: 20px;
      }
      .member-class {
        display: flex;
        margin: auto;
        background-color: #e9f3ff;
        width: fit-content;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        color: #3b82f6;
      }
    `,
  ],
  standalone: false,
})
export class MemberClassBadge {
  @Input() photo?: string;
  @Input() name?: string;
}

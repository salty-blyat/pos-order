import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core"; 

@Component({
  selector: "app-card",
  template: `
    <div class="service-type-card" (click)="createRipple($event)">
      <img
        class="service-type-card__img"
        [src]="image ? image : './../../../assets/image/noimg.jpg'"
        [alt]="text"
      />
      <h3 class="service-type-card__name">{{ text }}</h3>
    </div>
  `,
  styles: [
    `
      .service-type-card {
        user-select: none;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
      }

      .service-type-card__img {
        width: 100%;
        height: 150px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        object-fit: cover;
      }

      .service-type-card__name {
        text-align: center;
        padding: 8px;
        font-size: 14px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  @Input() text!: string;
  @Input() id!: number;
  @Input() image!: string;
  @Output() onClick = new EventEmitter<number>();
  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";

    ripple.style.left = event.clientX - rect.left - size / 2 + "px";
    ripple.style.top = event.clientY - rect.top - size / 2 + "px";

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600); // matches the animation duration
    this.onClick.emit(this.id);
  }
}

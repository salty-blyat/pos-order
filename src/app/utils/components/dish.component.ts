import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-dish",
  template: `
    <div class="dish-card" (click)="createRipple($event)">
        <span class="ripple"></span> <!-- Ripple effect span -->
      <div class="dish-image-container">
        <img class="dish-image" [src]="src" alt="" />
      </div>
      <div class="dish-info">
        <span class="title">{{ title }}</span>
        <span class="price">{{ price }}</span>
      </div>
    </div>
  `,
  styleUrls: ["../../../assets/scss/list.style.scss"],
  styles: [
    `
      .dish-info {
        user-select: none;
        padding: 8px 8px 12px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
      .title {
        font-size: 12px;
         text-align: center;
      }

      .price {
        font-size: 11px;
        text-align: center;
      }
      .title,
      .price {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }

      .dish-card { 
        line-height: 1.2; 
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        cursor: pointer;
      }
      .dish-image-container {
        width: 100%;
        height: 120px;
        background-color: #f3f3f3; /* subtle background for padding effect */
        // border-radius: 4px;
        border-radius: 4px 4px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .dish-image {
        max-width: 100%;
        // max-height: 100%;
        object-fit: cover;
        display: block;
      }
      ////////////////
      .dish-card {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background-color: rgba(0, 0, 0, 0.15);
  animation: ripple-animation 600ms linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}


    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DishComponent {
  @Input() title!: string;
  @Input() price!: string;
  @Input() src!: string;
  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';

    ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = event.clientY - rect.top - size / 2 + 'px';

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600); // matches the animation duration
  }


}

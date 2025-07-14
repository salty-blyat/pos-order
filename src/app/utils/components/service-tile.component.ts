import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Service } from "../../pages/service/service.service";

@Component({
  selector: "app-service-tile",
  template: `
    <div class="service-list" nz-flex nzGap="small" (click)="createRipple($event)">
      <img class="service-image" [src]="imageUrl" alt="" />
      <div   >
        <h3>{{ service?.name }}</h3> <br>
        <p *ngIf="service?.description">{{ service?.description }}</p>
      </div>
    </div>
  `,
  styles: [
    `
    .service-list {
     background-color:white;
     border-radius:8px;
     padding:8px;
     overflow:hidden;
     position:relative;
     cursor:pointer;
     margin-bottom: 12px;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  

    }
      .service-image {
        width: 70px;
        border-radius: 8px;
      }
    `,
  ],
  standalone: false,
})
export class ServiceTileComponent {
  @Input() service: Service | null = null;
  @Output() onClick = new EventEmitter<number>();
  get imageUrl(): string {
    return this.service?.image || "./../../../assets/image/noimg.jpg";
  }
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

    this.onClick.emit(this.service?.id);
  }
}

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Service } from "../../pages/service/service.service";

@Component({
  selector: "app-service-tile",
  template: `
    <div
      class="service-list shadow"
      nz-flex
      nzGap="small"
      (click)="createRipple($event)"
    >
      <img class="service-image" [src]="imageUrl" alt="" />
      <div class="service-info-tile">
        <h3>{{ service?.name }}</h3>
        <p *ngIf="service?.description">{{ service?.description }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .service-list {
        background-color: white;
        border-radius: 8px;
        padding: 8px;
        overflow: hidden;
        height: 100px;
        position: relative;
        cursor: pointer;
        margin-bottom: 12px;
      }
      .service-info-tile {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
      .service-image {
        width: 80px;
        border-radius: 8px;
        height: 100%;
        object-fit: cover;
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

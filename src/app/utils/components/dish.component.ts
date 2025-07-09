import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-dish",
  template: `
    <div class="dish-card">
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
        min-height: 160px;
        width: 100%;
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
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .dish-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        display: block;
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
}

import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "app-category-buttons",
  template: `
    <div class="category-buttons">
      <div class="category-group">
        <button
          *ngFor="let category of categories"
          nz-button
          [style.backgroundColor]="radioValue === category ? '' : '#ffffff'"

          [nzType]="radioValue == category ? 'primary' : 'text'"
          (click)="selectCategory(category)"
          class="rounded-category-button"
        >
          <span class="category-label">
            {{ category }}
          </span>
          <br />
          <span class="category-qty"> 11 items </span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .category-buttons { 
        user-select: none;
        padding: 16px 4px 32px 16px;
      }

      .category-label {
        font-size: 14px;
      }
      .category-qty {
        font-size: 10px;
      }
      .category-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .rounded-category-button {
        height: auto !important;
        text-align: left;
        padding: 4px 16px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.09);
        font-size: 14px;
      }
    `,
  ],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class CategoryButtonsComponent {
  categories: string[] = [
    "All",
    "Pizza",
    "Burger",
    "Sushi",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
    "Steak",
  ];
  radioValue: string = "All";

  @Output() categoryChange = new EventEmitter<string>();

  selectCategory(category: string): void {
    this.radioValue = category;
    this.categoryChange.emit(category);
  }
}

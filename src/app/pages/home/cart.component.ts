import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-cart",
  template: `
    <div class="cart">
      <div nz-flex nzAlign="normal" nzJustify="space-between">
        <span class="cart-title" style="color: #808080;">Table No #04</span>
        <button nz-button nzType="text" nzSize="small" nzShape="round">
          <nz-icon style="color: red;" nzType="delete" nzTheme="outline" />
        </button>
         
      </div>
      <hr style="border: 1px dotted #8080801a;"/>
      <div>
        <span class="cart-title">Ordered Items</span>
        <div class="item-info" *ngFor="let dish of dish">
          <div nz-flex nzJustify="center" nzAlign="center" nzGap="4px">
            <button
              nz-button
              nzShape="circle"
              nzSize="small"
              nzType="text"
              (click)="decreaseQty(dish)"
            >
              <nz-icon nzType="minus" nzTheme="outline"></nz-icon>
            </button>
            <span class="item-quantity">{{ dish.quantity }}</span>
            <button
              nz-button
              nzShape="circle"
              nzSize="small"
              nzType="text"
              (click)="increaseQty(dish)"
            >
              <nz-icon nzType="plus" nzTheme="outline"></nz-icon>
            </button>
          </div>
          <span class="item-name">{{ dish.name }}</span>
          <span class="item-price">{{ "$" + dish.price }}</span>
        </div>
      </div>
      <hr />
      <div>
        <span class="cart-title">Payment Summary</span>
        <div class="payment-summary" nz-flex nzJustify="space-between">
          <span>Subtotal (4 items)</span>
          <span>$11.48</span>
        </div>
        <div class="payment-summary" nz-flex nzJustify="space-between">
          <span>Tax (10%)</span>
          <span>$1.14</span>
        </div>
        <div class="payment-summary" nz-flex nzJustify="space-between">
          <span>Discount</span>
          <span>$0.00</span>
        </div>
        <div class="payment-summary" nz-flex nzJustify="space-between">
          <span>Total</span>
          <span>$12.62</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .payment-summary {
        margin-top: 4px;
        font-size: 11px;
      }
      hr {
        color: #8080801a;
      }
      .cart {
        padding: 12px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        background-color: white;
        border-radius: 8px;
      }
      .item-info {
        display: grid;
        margin-top: 4px;
        grid-template-columns: auto 1fr auto;
        gap: 8px;
      }
      .item-quantity{
        font-size: 11px;
        font-weight: bold; 
      }      
      .item-price {
        text-align: right;
        font-size: 11px;
       }
      .item-name{
        font-size: 11px;
      }
      .item {
        font-size: 11px;
        font-weight: 500;
        line-height: 1.4;
      }

      .cart-title {
        font-size: 14px;
        font-weight: bold;
        color: #000000c2;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CartComponent {
  @Input() title!: string;
  @Input() price!: string;
  @Input() description!: string;
  @Input() src!: string;
  increaseQty(dish: any): void {
    dish.quantity++;
  }

  decreaseQty(dish: any): void {
    if (dish.quantity > 1) {
      dish.quantity--;
    }
  }

  dish = [
    {
      id: 1,
      name: "Orange Juice",
      description: "Note: Less Ice",
      price: 2.87,
      quantity: 4,
      image: "https://source.unsplash.com/300x200/?pizza",
    },
    {
      id: 2,
      name: "American Favorite",
      description: "Crust: Stuffed Crust Sosis\nExtras: Extra Mozarella",
      price: 4.87,
      quantity: 1,
      image: "https://source.unsplash.com/300x200/?pizza",
    },
    {
      id: 3,
      name: "Spicy Italian Sausage",
      description: "Note: No Spicy",
      price: 5.87,
      quantity: 2,
      image: "https://source.unsplash.com/300x200/?spicy",
    },
    {
      id: 4,
      name: "Hawaiian Luau",
      description: "Note: Extra Ham",
      price: 6.87,
      quantity: 3,
      image: "https://source.unsplash.com/300x200/?hawaiian",
    },
  ];
}
